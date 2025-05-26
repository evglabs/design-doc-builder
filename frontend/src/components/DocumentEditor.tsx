import { useState, useEffect } from 'react';
import { 
  Save, 
  Download, 
  Share2, 
  CheckCircle,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { DocumentContent } from '../types';

interface DocumentEditorProps {
  document: {
    id: number;
    title: string;
    content: DocumentContent;
  };
  onSave: (content: DocumentContent) => void;
  onTitleChange: (title: string) => void;
}

const PROMPT_SECTIONS = [
  {
    key: 'context',
    title: 'Context & Background',
    description: 'Provide clear context about your project, system, or problem domain',
    placeholder: 'Describe your project, technology stack, existing codebase, and relevant background information...',
    tips: [
      'Include your tech stack and frameworks',
      'Mention existing code patterns',
      'Describe the overall architecture',
      'Explain any constraints or requirements'
    ]
  },
  {
    key: 'objective',
    title: 'Clear Objective',
    description: 'Define exactly what you want to accomplish',
    placeholder: 'Clearly state what you want to build, fix, or improve...',
    tips: [
      'Be specific about the desired outcome',
      'Include functional requirements',
      'Mention any performance criteria',
      'Specify integration requirements'
    ]
  },
  {
    key: 'technical_requirements',
    title: 'Technical Requirements',
    description: 'Specify technical constraints, patterns, and standards',
    placeholder: 'List specific technical requirements, coding standards, patterns to follow...',
    tips: [
      'Coding standards and style preferences',
      'Design patterns to use or avoid',
      'Error handling requirements',
      'Testing requirements',
      'Security considerations'
    ]
  },
  {
    key: 'examples',
    title: 'Examples & References',
    description: 'Provide examples of similar implementations or desired patterns',
    placeholder: 'Include code examples, similar implementations, or reference materials...',
    tips: [
      'Show similar code from your project',
      'Reference external examples',
      'Include API documentation snippets',
      'Provide sample inputs/outputs'
    ]
  },
  {
    key: 'constraints',
    title: 'Constraints & Limitations',
    description: 'Define what should be avoided or limited',
    placeholder: 'List any constraints, limitations, or things to avoid...',
    tips: [
      'Dependencies to avoid',
      'Performance limitations',
      'Browser/platform compatibility',
      'Budget or time constraints',
      'Legacy system compatibility'
    ]
  },
  {
    key: 'output_format',
    title: 'Desired Output Format',
    description: 'Specify how you want the code or solution formatted',
    placeholder: 'Describe the format, structure, or deliverables you expect...',
    tips: [
      'File structure preferences',
      'Documentation requirements',
      'Code organization',
      'Comments and explanations needed'
    ]
  }
];

export function DocumentEditor({ document, onSave, onTitleChange }: DocumentEditorProps) {
  const [content, setContent] = useState<DocumentContent>(document.content);
  const [activeSection, setActiveSection] = useState<string>('context');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    setContent(document.content);
    setHasUnsavedChanges(false);
  }, [document]);

  const handleContentChange = (sectionKey: string, value: string) => {
    const newContent = {
      ...content,
      sections: {
        ...content.sections,
        [sectionKey]: value
      }
    };
    setContent(newContent);
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    onSave(content);
    setHasUnsavedChanges(false);
  };

  const getSectionCompleteness = () => {
    const totalSections = PROMPT_SECTIONS.length;
    const completedSections = PROMPT_SECTIONS.filter(
      section => content.sections?.[section.key]?.trim()
    ).length;
    return Math.round((completedSections / totalSections) * 100);
  };

  const getQualityScore = () => {
    let score = 0;
    PROMPT_SECTIONS.forEach(section => {
      const sectionContent = content.sections?.[section.key]?.trim() || '';
      if (sectionContent.length > 50) score += 1;
      if (sectionContent.length > 200) score += 1;
      if (sectionContent.includes('example') || sectionContent.includes('like')) score += 0.5;
    });
    return Math.min(100, Math.round((score / (PROMPT_SECTIONS.length * 2)) * 100));
  };

  const activePromptSection = PROMPT_SECTIONS.find(s => s.key === activeSection);

  return (
    <div className="flex h-full bg-gray-50">
      {/* Sidebar - Section Navigation */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <input
            type="text"
            value={document.title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="text-xl font-semibold w-full border-none outline-none bg-transparent"
            placeholder="Document Title"
          />
          
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Completeness</span>
              <span className="font-medium">{getSectionCompleteness()}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all" 
                style={{ width: `${getSectionCompleteness()}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Quality Score</span>
              <span className="font-medium">{getQualityScore()}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all" 
                style={{ width: `${getQualityScore()}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <nav className="p-4 space-y-1">
            {PROMPT_SECTIONS.map((section) => {
              const isCompleted = content.sections?.[section.key]?.trim();
              const isActive = activeSection === section.key;
              
              return (
                <button
                  key={section.key}
                  onClick={() => setActiveSection(section.key)}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-blue-50 border-blue-200 border'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-medium ${isActive ? 'text-blue-900' : 'text-gray-900'}`}>
                      {section.title}
                    </span>
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {section.description}
                  </p>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <button
            onClick={handleSave}
            disabled={!hasUnsavedChanges}
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{hasUnsavedChanges ? 'Save Changes' : 'Saved'}</span>
          </button>
          
          <div className="flex space-x-2">
            <button className="flex-1 flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
            <button className="flex-1 flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex-1 flex flex-col">
        {activePromptSection && (
          <>
            {/* Section Header */}
            <div className="bg-white border-b border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {activePromptSection.title}
                  </h2>
                  <p className="text-gray-600 mt-2">
                    {activePromptSection.description}
                  </p>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <HelpCircle className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Editor Content */}
            <div className="flex-1 flex">
              {/* Text Editor */}
              <div className="flex-1 p-6">
                <textarea
                  value={content.sections?.[activePromptSection.key] || ''}
                  onChange={(e) => handleContentChange(activePromptSection.key, e.target.value)}
                  placeholder={activePromptSection.placeholder}
                  className="w-full h-full resize-none border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Tips Sidebar */}
              <div className="w-80 bg-white border-l border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">💡 Tips for this section</h3>
                <ul className="space-y-3">
                  {activePromptSection.tips.map((tip, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Character Count</h4>
                  <p className="text-sm text-blue-700">
                    {content.sections?.[activePromptSection.key]?.length || 0} characters
                  </p>
                  <div className="mt-2 w-full bg-blue-200 rounded-full h-1">
                    <div 
                      className="bg-blue-500 h-1 rounded-full transition-all" 
                      style={{ 
                        width: `${Math.min(100, ((content.sections?.[activePromptSection.key]?.length || 0) / 200) * 100)}%` 
                      }}
                    />
                  </div>
                  <p className="text-xs text-blue-600 mt-1">
                    Aim for at least 200 characters for quality prompts
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
