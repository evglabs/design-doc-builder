import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  FileText, 
  Clock, 
  Share2, 
  MoreVertical,
  Trash2,
  Copy,
  Edit3,
  Eye
} from 'lucide-react';
import { Document, CreateDocumentRequest } from '../types';
import { apiService } from '../services/api';

interface DashboardProps {
  onEditDocument: (document: Document) => void;
}

export function Dashboard({ onEditDocument }: DashboardProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'updated_at' | 'created_at' | 'title'>('updated_at');
  const [filterBy, setFilterBy] = useState<'all' | 'public' | 'private'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const docs = await apiService.getDocuments();
      setDocuments(docs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDocument = async (title: string) => {
    try {
      const createData: CreateDocumentRequest = { title };
      const newDocument = await apiService.createDocument(createData);
      setDocuments(prev => [newDocument, ...prev]);
      setShowCreateModal(false);
      onEditDocument(newDocument);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create document');
    }
  };

  const handleDeleteDocument = async (id: number) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    
    try {
      await apiService.deleteDocument(id);
      setDocuments(prev => prev.filter(doc => doc.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete document');
    }
  };

  const handleDuplicateDocument = async (doc: Document) => {
    try {
      const duplicatedDoc = await apiService.duplicateDocument(doc.id, `${doc.title} (Copy)`);
      setDocuments(prev => [duplicatedDoc, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to duplicate document');
    }
  };

  const getFilteredAndSortedDocuments = () => {
    let filtered = documents.filter(doc => {
      const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = 
        filterBy === 'all' || 
        (filterBy === 'public' && doc.is_public) ||
        (filterBy === 'private' && !doc.is_public);
      
      return matchesSearch && matchesFilter;
    });

    return filtered.sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      const dateA = new Date(a[sortBy]).getTime();
      const dateB = new Date(b[sortBy]).getTime();
      return dateB - dateA;
    });
  };

  const getCompletionPercentage = (doc: Document) => {
    const sections = doc.content.sections || {};
    const totalSections = 6; // context, objective, technical_requirements, examples, constraints, output_format
    const completedSections = Object.values(sections).filter(section => section?.trim()).length;
    return Math.round((completedSections / totalSections) * 100);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Documents</h1>
          <p className="text-gray-600 mt-2">
            Create and manage your AI coding prompt documents
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>New Document</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex-1 md:mr-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex space-x-4">
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Documents</option>
              <option value="private">Private</option>
              <option value="public">Public</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="updated_at">Last Updated</option>
              <option value="created_at">Date Created</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
          <button
            onClick={() => setError(null)}
            className="float-right text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getFilteredAndSortedDocuments().map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {doc.title}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatDate(doc.updated_at)}</span>
                    </div>
                    {doc.is_public && (
                      <div className="flex items-center space-x-1">
                        <Share2 className="w-4 h-4" />
                        <span>Public</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="relative">
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === doc.id ? null : doc.id)}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  
                  {activeDropdown === doc.id && (
                    <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-48">
                      <button
                        onClick={() => {
                          onEditDocument(doc);
                          setActiveDropdown(null);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <Edit3 className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => {
                          handleDuplicateDocument(doc);
                          setActiveDropdown(null);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <Copy className="w-4 h-4" />
                        <span>Duplicate</span>
                      </button>
                      {doc.is_public && (
                        <button
                          onClick={() => {
                            // TODO: Implement view shared document
                            setActiveDropdown(null);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View Public</span>
                        </button>
                      )}
                      <button
                        onClick={() => {
                          handleDeleteDocument(doc.id);
                          setActiveDropdown(null);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600 flex items-center space-x-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Completion Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Completion</span>
                  <span className="font-medium">{getCompletionPercentage(doc)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all" 
                    style={{ width: `${getCompletionPercentage(doc)}%` }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => onEditDocument(doc)}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDuplicateDocument(doc)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {getFilteredAndSortedDocuments().length === 0 && !loading && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || filterBy !== 'all' ? 'No documents found' : 'No documents yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterBy !== 'all' 
              ? 'Try adjusting your search or filters' 
              : 'Create your first AI coding prompt document to get started'
            }
          </p>
          {(!searchTerm && filterBy === 'all') && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Your First Document
            </button>
          )}
        </div>
      )}

      {/* Create Document Modal */}
      {showCreateModal && (
        <CreateDocumentModal
          onSubmit={handleCreateDocument}
          onCancel={() => setShowCreateModal(false)}
        />
      )}

      {/* Click outside to close dropdown */}
      {activeDropdown && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setActiveDropdown(null)}
        />
      )}
    </div>
  );
}

interface CreateDocumentModalProps {
  onSubmit: (title: string) => void;
  onCancel: () => void;
}

function CreateDocumentModal({ onSubmit, onCancel }: CreateDocumentModalProps) {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit(title.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Create New Document
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Document Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., React Component Development Guide"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
          </div>
          
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
