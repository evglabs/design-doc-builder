import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../database/connection';
import { 
  Document, 
  CreateDocumentInput, 
  UpdateDocumentInput, 
  DocumentContent,
  DocumentVersion 
} from '../types';
import { DEFAULT_DOCUMENT_CONTENT } from '../utils/constants';

export class DocumentService {
  private db = getDatabase();

  async createDocument(ownerId: number, input: CreateDocumentInput): Promise<Document> {
    let content = DEFAULT_DOCUMENT_CONTENT;
    
    // If template_id is provided, load template content
    if (input.template_id) {
      const template = this.getTemplate(input.template_id);
      if (template) {
        content = { ...DEFAULT_DOCUMENT_CONTENT, ...template.content };
      }
    }

    const stmt = this.db.prepare(`
      INSERT INTO documents (title, owner_id, content, template_id) 
      VALUES (?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      input.title,
      ownerId,
      JSON.stringify(content),
      input.template_id || null
    );

    const document = await this.getDocumentById(result.lastInsertRowid as number, ownerId);
    if (!document) {
      throw new Error('Failed to create document');
    }

    // Create initial version
    await this.createVersion(document.id, content);

    return document;
  }

  async getDocumentById(id: number, userId?: number): Promise<Document | null> {
    let query = `
      SELECT d.*, u.email as owner_email 
      FROM documents d 
      JOIN users u ON d.owner_id = u.id 
      WHERE d.id = ?
    `;
    
    // If userId provided, only return if user owns it or it's public
    if (userId !== undefined) {
      query += ` AND (d.owner_id = ? OR d.is_public = 1)`;
    }

    const stmt = this.db.prepare(query);
    const params = userId !== undefined ? [id, userId] : [id];
    const row = stmt.get(...params) as any;
    
    if (!row) {
      return null;
    }

    return {
      ...row,
      content: JSON.parse(row.content || '{}')
    };
  }

  async getDocumentByShareToken(shareToken: string): Promise<Document | null> {
    const stmt = this.db.prepare(`
      SELECT d.*, u.email as owner_email 
      FROM documents d 
      JOIN users u ON d.owner_id = u.id 
      WHERE d.share_token = ? 
      AND d.is_public = 1
      AND (d.share_expires_at IS NULL OR d.share_expires_at > datetime('now'))
    `);
    
    const row = stmt.get(shareToken) as any;
    
    if (!row) {
      return null;
    }

    return {
      ...row,
      content: JSON.parse(row.content || '{}')
    };
  }

  async getUserDocuments(userId: number): Promise<Document[]> {
    const stmt = this.db.prepare(`
      SELECT d.*, u.email as owner_email 
      FROM documents d 
      JOIN users u ON d.owner_id = u.id 
      WHERE d.owner_id = ? 
      ORDER BY d.updated_at DESC
    `);
    
    const rows = stmt.all(userId) as any[];
    
    return rows.map(row => ({
      ...row,
      content: JSON.parse(row.content || '{}')
    }));
  }

  async updateDocument(id: number, userId: number, updates: UpdateDocumentInput): Promise<Document | null> {
    const setParts: string[] = [];
    const values: any[] = [];

    if (updates.title !== undefined) {
      setParts.push('title = ?');
      values.push(updates.title);
    }

    if (updates.content !== undefined) {
      // Get current content and merge with updates
      const current = await this.getDocumentById(id, userId);
      if (!current) {
        return null;
      }
      
      const mergedContent = { ...current.content, ...updates.content };
      setParts.push('content = ?');
      values.push(JSON.stringify(mergedContent));
      
      // Create version snapshot
      await this.createVersion(id, mergedContent);
    }

    if (updates.is_public !== undefined) {
      setParts.push('is_public = ?');
      values.push(updates.is_public);
    }

    if (setParts.length === 0) {
      return this.getDocumentById(id, userId);
    }

    values.push(id, userId);

    const stmt = this.db.prepare(`
      UPDATE documents 
      SET ${setParts.join(', ')} 
      WHERE id = ? AND owner_id = ?
    `);

    const result = stmt.run(...values);
    
    if (result.changes === 0) {
      return null;
    }

    return this.getDocumentById(id, userId);
  }

  async deleteDocument(id: number, userId: number): Promise<boolean> {
    const stmt = this.db.prepare(`
      DELETE FROM documents 
      WHERE id = ? AND owner_id = ?
    `);
    
    const result = stmt.run(id, userId);
    return result.changes > 0;
  }

  async duplicateDocument(id: number, userId: number, newTitle: string): Promise<Document | null> {
    const original = await this.getDocumentById(id, userId);
    if (!original) {
      return null;
    }

    const createInput: CreateDocumentInput = {
      title: newTitle
    };

    if (original.template_id) {
      createInput.template_id = original.template_id;
    }

    return this.createDocument(userId, createInput);
  }

  async generateShareToken(id: number, userId: number, expiresAt?: string): Promise<string | null> {
    // Verify user owns document
    const document = await this.getDocumentById(id, userId);
    if (!document) {
      return null;
    }

    const shareToken = uuidv4();
    
    const stmt = this.db.prepare(`
      UPDATE documents 
      SET share_token = ?, share_expires_at = ?, is_public = 1
      WHERE id = ? AND owner_id = ?
    `);
    
    const result = stmt.run(shareToken, expiresAt || null, id, userId);
    
    return result.changes > 0 ? shareToken : null;
  }

  async revokeShare(id: number, userId: number): Promise<boolean> {
    const stmt = this.db.prepare(`
      UPDATE documents 
      SET share_token = NULL, share_expires_at = NULL, is_public = 0
      WHERE id = ? AND owner_id = ?
    `);
    
    const result = stmt.run(id, userId);
    return result.changes > 0;
  }

  private async createVersion(documentId: number, content: DocumentContent): Promise<void> {
    // Get current version count
    const countStmt = this.db.prepare(`
      SELECT COUNT(*) as count FROM document_versions WHERE document_id = ?
    `);
    const { count } = countStmt.get(documentId) as { count: number };

    // Insert new version
    const insertStmt = this.db.prepare(`
      INSERT INTO document_versions (document_id, version_number, content) 
      VALUES (?, ?, ?)
    `);
    insertStmt.run(documentId, count + 1, JSON.stringify(content));

    // Keep only last 5 versions
    if (count >= 5) {
      const deleteStmt = this.db.prepare(`
        DELETE FROM document_versions 
        WHERE document_id = ? 
        AND version_number <= ?
      `);
      deleteStmt.run(documentId, count - 4);
    }
  }

  async getDocumentVersions(id: number, userId: number): Promise<DocumentVersion[]> {
    // Verify user owns document
    const document = await this.getDocumentById(id, userId);
    if (!document) {
      return [];
    }

    const stmt = this.db.prepare(`
      SELECT * FROM document_versions 
      WHERE document_id = ? 
      ORDER BY version_number DESC
    `);
    
    const rows = stmt.all(id) as any[];
    
    return rows.map(row => ({
      ...row,
      content: JSON.parse(row.content)
    }));
  }

  private getTemplate(id: number): { content: Partial<DocumentContent> } | null {
    const stmt = this.db.prepare(`
      SELECT content FROM document_templates WHERE id = ?
    `);
    
    const row = stmt.get(id) as { content: string } | undefined;
    
    if (!row) {
      return null;
    }

    return {
      content: JSON.parse(row.content)
    };
  }
}
