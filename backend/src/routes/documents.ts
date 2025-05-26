import express from 'express';
import { Document, CreateDocumentInput, UpdateDocumentInput, DocumentContent } from '../types';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Temporary mock data for now since we don't have document service fully implemented
const mockDocuments: Document[] = [];

// Get all documents for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
  try {
    // For now, return empty array
    return res.json({
      success: true,
      data: mockDocuments.filter(doc => doc.owner_id === req.user?.id)
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch documents'
    });
  }
});

// Get a specific document
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const documentId = parseInt(req.params.id);
    const document = mockDocuments.find(doc => 
      doc.id === documentId && doc.owner_id === req.user?.id
    );

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found'
      });
    }

    return res.json({
      success: true,
      data: document
    });
  } catch (error) {
    console.error('Error fetching document:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch document'
    });
  }
});

// Create a new document
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, template_id }: CreateDocumentInput = req.body;
    
    if (!title) {
      return res.status(400).json({
        success: false,
        error: 'Title is required'
      });
    }

    const newDocument: Document = {
      id: Date.now(), // Simple ID generation for mock
      title,
      owner_id: req.user!.id,
      content: template_id ? getTemplateContent(template_id) : getDefaultContent(),
      is_public: false,
      share_token: null,
      share_expires_at: null,
      template_id: template_id || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    mockDocuments.push(newDocument);

    return res.status(201).json({
      success: true,
      data: newDocument
    });
  } catch (error) {
    console.error('Error creating document:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create document'
    });
  }
});

// Update a document
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const documentId = parseInt(req.params.id);
    const updates: UpdateDocumentInput = req.body;
    
    const documentIndex = mockDocuments.findIndex(doc => 
      doc.id === documentId && doc.owner_id === req.user?.id
    );

    if (documentIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Document not found'
      });
    }

    // Update the document with proper content merging
    const updatedDocument: Document = {
      ...mockDocuments[documentIndex],
      ...updates,
      content: updates.content ? 
        { ...mockDocuments[documentIndex].content, ...updates.content } : 
        mockDocuments[documentIndex].content,
      updated_at: new Date().toISOString()
    };

    mockDocuments[documentIndex] = updatedDocument;

    return res.json({
      success: true,
      data: updatedDocument
    });
  } catch (error) {
    console.error('Error updating document:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update document'
    });
  }
});

// Delete a document
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const documentId = parseInt(req.params.id);
    const documentIndex = mockDocuments.findIndex(doc => 
      doc.id === documentId && doc.owner_id === req.user?.id
    );

    if (documentIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Document not found'
      });
    }

    mockDocuments.splice(documentIndex, 1);

    return res.json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting document:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete document'
    });
  }
});

function getTemplateContent(templateId: number): DocumentContent {
  // Return template-based content
  const templates: Record<number, DocumentContent> = {
    1: {
      sections: {
        context: "Web Application Development",
        objective: "Create a web application that provides excellent user experience",
        technical_requirements: "JavaScript/TypeScript with Node.js backend, React frontend",
        examples: "Similar to popular web apps with authentication, real-time features",
        constraints: "Must load in under 2 seconds, handle 100 concurrent users",
        output_format: "Complete working web application with deployment instructions"
      },
      metadata: {
        version: "1.0",
        lastModified: new Date().toISOString(),
        completeness: 30,
        qualityScore: 70
      }
    },
    2: {
      sections: {
        context: "Command-Line Tool Development",
        objective: "Create a CLI tool that automates common development tasks",
        technical_requirements: "Python 3.9+ or Go 1.19+, minimal external dependencies",
        examples: "Similar to tools like grep, sed, awk but for modern development",
        constraints: "Process files up to 100MB within 30 seconds, max 128MB RAM",
        output_format: "Single binary executable with help documentation"
      },
      metadata: {
        version: "1.0",
        lastModified: new Date().toISOString(),
        completeness: 30,
        qualityScore: 70
      }
    },
    3: {
      sections: {
        context: "REST API Development",
        objective: "Create a REST API that serves as backend for applications",
        technical_requirements: "Node.js with TypeScript or Python with FastAPI",
        examples: "RESTful API with CRUD operations, authentication, documentation",
        constraints: "Sub-100ms response times, auto-scaling capability",
        output_format: "Deployable API with OpenAPI documentation"
      },
      metadata: {
        version: "1.0",
        lastModified: new Date().toISOString(),
        completeness: 30,
        qualityScore: 70
      }
    }
  };

  return templates[templateId] || getDefaultContent();
}

function getDefaultContent(): DocumentContent {
  return {
    sections: {
      context: "",
      objective: "",
      technical_requirements: "",
      examples: "",
      constraints: "",
      output_format: ""
    },
    metadata: {
      version: "1.0",
      lastModified: new Date().toISOString(),
      completeness: 0,
      qualityScore: 0
    }
  };
}

export default router;
