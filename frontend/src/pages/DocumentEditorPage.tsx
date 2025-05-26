import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, LogOut, FileText, User, Menu, X } from 'lucide-react';
import { DocumentEditor } from '../components/DocumentEditor';
import { Document, DocumentContent, UpdateDocumentRequest } from '../types';
import { useAuthStore } from '../stores/authStore';
import { apiService } from '../services/api';

export function DocumentEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (id) {
      loadDocument(parseInt(id));
    }
  }, [id]);

  const loadDocument = async (documentId: number) => {
    try {
      setLoading(true);
      const doc = await apiService.getDocument(documentId);
      setDocument(doc);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load document');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (content: DocumentContent) => {
    if (!document) return;

    try {
      const updateData: UpdateDocumentRequest = { content };
      const updatedDoc = await apiService.updateDocument(document.id, updateData);
      setDocument(updatedDoc);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save document');
    }
  };

  const handleTitleChange = async (newTitle: string) => {
    if (!document || newTitle === document.title) return;

    try {
      const updateData: UpdateDocumentRequest = { title: newTitle };
      const updatedDoc = await apiService.updateDocument(document.id, updateData);
      setDocument(updatedDoc);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update title');
    }
  };

  const handleLogout = async () => {
    try {
      await apiService.logout();
      logout();
    } catch (error) {
      // Even if the API call fails, logout locally
      logout();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading document...</p>
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-4">
            {error || 'Document not found'}
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile menu overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-gray-600 opacity-75" />
        </div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 bg-blue-600">
          <div className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-white" />
            <span className="text-xl font-bold text-white">PromptBuilder</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:text-gray-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-8 px-4">
          <div className="space-y-1">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full text-left hover:bg-gray-50 text-gray-700 group flex items-center px-3 py-2 text-sm font-medium rounded-md"
            >
              <ArrowLeft className="text-gray-500 mr-3 h-5 w-5" />
              Back to Documents
            </button>
            <div className="bg-blue-50 text-blue-700 group flex items-center px-3 py-2 text-sm font-medium rounded-md">
              <FileText className="text-blue-500 mr-3 h-5 w-5" />
              Editor
            </div>
          </div>
        </nav>

        {/* User menu */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name || user?.email}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign out</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="lg:hidden bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-500 hover:text-gray-700"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-blue-600" />
              <span className="text-lg font-semibold text-gray-900">PromptBuilder</span>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Error display */}
        {error && (
          <div className="bg-red-50 border-b border-red-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="text-red-700">{error}</span>
              <button
                onClick={() => setError(null)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Document Editor */}
        <main className="flex-1 overflow-hidden">
          <DocumentEditor
            document={document}
            onSave={handleSave}
            onTitleChange={handleTitleChange}
          />
        </main>
      </div>
    </div>
  );
}
