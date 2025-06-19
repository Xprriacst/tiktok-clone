import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from 'components/AppIcon';


// Import components
import URLInputStep from './components/URLInputStep';
import ProcessingStep from './components/ProcessingStep';
import CustomizationStep from './components/CustomizationStep';
import PreviewExportStep from './components/PreviewExportStep';

const VideoCreationWorkflow = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [projectData, setProjectData] = useState({
    id: null,
    name: '',
    tiktokUrl: '',
    sourceVideo: null,
    transcription: '',
    detectedLanguage: '',
    selectedAvatar: null,
    voiceSettings: {
      pitch: 50,
      speed: 50,
      accent: 'neutral'
    },
    backgroundSettings: {
      type: 'solid',
      color: '#ffffff',
      preset: 'studio-white'
    },
    processingStatus: 'idle',
    createdAt: new Date(),
    lastModified: new Date()
  });
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const steps = [
    { id: 1, title: 'URL Input', icon: 'Link', description: 'Enter TikTok URL' },
    { id: 2, title: 'Processing', icon: 'Loader2', description: 'Download & Analyze' },
    { id: 3, title: 'Customization', icon: 'Settings', description: 'Avatar & Voice' },
    { id: 4, title: 'Export', icon: 'Download', description: 'Preview & Download' }
  ];

  // Initialize project from location state if available
  useEffect(() => {
    if (location.state?.projectData) {
      setProjectData(location.state.projectData);
      setCurrentStep(location.state.step || 1);
    }
  }, [location.state]);

  const handleStepComplete = (stepData) => {
    setProjectData(prev => ({
      ...prev,
      ...stepData,
      lastModified: new Date()
    }));

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleStepBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveDraft = async () => {
    try {
      // Mock save operation
      const draftId = `draft_${Date.now()}`;
      const updatedProject = {
        ...projectData,
        id: projectData.id || draftId,
        name: projectData.name || `TikTok Clone ${new Date().toLocaleDateString()}`,
        status: 'draft'
      };
      
      setProjectData(updatedProject);
      setIsDraftSaved(true);
      setShowSaveDialog(true);
      
      setTimeout(() => setShowSaveDialog(false), 3000);
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  };

  const handleNavigateToProcessing = () => {
    navigate('/processing-status-queue', {
      state: { 
        projectId: projectData.id,
        fromWorkflow: true 
      }
    });
  };

  const handleNavigateToLibrary = () => {
    navigate('/project-history-library');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <URLInputStep
            projectData={projectData}
            onComplete={handleStepComplete}
            onSaveDraft={handleSaveDraft}
          />
        );
      case 2:
        return (
          <ProcessingStep
            projectData={projectData}
            onComplete={handleStepComplete}
            onBack={handleStepBack}
            onNavigateToProcessing={handleNavigateToProcessing}
          />
        );
      case 3:
        return (
          <CustomizationStep
            projectData={projectData}
            onComplete={handleStepComplete}
            onBack={handleStepBack}
            onSaveDraft={handleSaveDraft}
          />
        );
      case 4:
        return (
          <PreviewExportStep
            projectData={projectData}
            onBack={handleStepBack}
            onComplete={() => navigate('/video-preview-export', { state: { projectData } })}
            onSaveDraft={handleSaveDraft}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Step Progress Indicator */}
      <div className="bg-surface border-b border-border sticky top-16 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            {/* Mobile Step Indicator */}
            <div className="md:hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= steps[currentStep - 1]?.id ? 'bg-primary text-white' : 'bg-background border border-border text-text-secondary'
                  }`}>
                    <Icon name={steps[currentStep - 1]?.icon} size={16} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-text-primary">
                      Step {currentStep} of {steps.length}
                    </div>
                    <div className="text-xs text-text-secondary">
                      {steps[currentStep - 1]?.title}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-text-secondary">
                  {Math.round((currentStep / steps.length) * 100)}% Complete
                </div>
              </div>
              <div className="w-full bg-background rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / steps.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Desktop Step Indicator */}
            <div className="hidden md:flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                      currentStep >= step.id 
                        ? 'bg-primary text-white' 
                        : currentStep === step.id - 1
                          ? 'bg-primary-50 border-2 border-primary text-primary' :'bg-background border border-border text-text-secondary'
                    }`}>
                      <Icon 
                        name={step.icon} 
                        size={18} 
                        className={currentStep === 2 && step.id === 2 ? 'animate-spin' : ''} 
                      />
                    </div>
                    <div>
                      <div className={`text-sm font-medium ${
                        currentStep >= step.id ? 'text-text-primary' : 'text-text-secondary'
                      }`}>
                        {step.title}
                      </div>
                      <div className="text-xs text-text-secondary">
                        {step.description}
                      </div>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-px mx-6 ${
                      currentStep > step.id ? 'bg-primary' : 'bg-border'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderStepContent()}
      </div>

      {/* Floating Save Draft Button */}
      {currentStep > 1 && (
        <button
          onClick={handleSaveDraft}
          className="fixed bottom-6 right-6 bg-secondary text-white p-4 rounded-full shadow-lg hover:bg-secondary-700 transition-all duration-200 z-50 md:bottom-8 md:right-8"
          title="Save as Draft"
        >
          <Icon name="Save" size={20} />
        </button>
      )}

      {/* Save Confirmation Dialog */}
      {showSaveDialog && (
        <div className="fixed bottom-20 right-6 bg-surface border border-border rounded-lg shadow-lg p-4 z-50 animate-slide-in md:bottom-24 md:right-8">
          <div className="flex items-center space-x-2">
            <Icon name="CheckCircle" size={16} className="text-success" />
            <span className="text-sm font-medium text-text-primary">Draft saved successfully!</span>
          </div>
          <div className="mt-2 flex space-x-2">
            <button
              onClick={handleNavigateToLibrary}
              className="text-xs text-primary hover:text-primary-700 font-medium transition-colors duration-200"
            >
              View in Library
            </button>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Spacer */}
      <div className="h-20 md:hidden" />
    </div>
  );
};

export default VideoCreationWorkflow;