import React, { useState, useEffect, useRef } from 'react';
import Icon from 'components/AppIcon';

const URLInputStep = ({ projectData, onComplete, onSaveDraft }) => {
  const [url, setUrl] = useState(projectData.tiktokUrl || '');
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isFileMode, setIsFileMode] = useState(false);
  const fileInputRef = useRef(null);
  const videoPreviewRef = useRef(null);
  const [videoMetadata, setVideoMetadata] = useState(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoThumbnail, setVideoThumbnail] = useState('');

  const exampleUrls = [
    'https://www.tiktok.com/@username/video/1234567890123456789',
    'https://vm.tiktok.com/ZMeAbCdEf/',
    'https://www.tiktok.com/t/ZTdAbCdEf/'
  ];

  const validateTikTokUrl = (inputUrl) => {
    const tiktokPatterns = [
      /^https:\/\/www\.tiktok\.com\/@[\w.-]+\/video\/\d+/,
      /^https:\/\/vm\.tiktok\.com\/[\w]+/,
      /^https:\/\/www\.tiktok\.com\/t\/[\w]+/,
      /^https:\/\/m\.tiktok\.com\/v\/\d+/
    ];

    return tiktokPatterns.some(pattern => pattern.test(inputUrl));
  };

  const handleUrlChange = (e) => {
    const inputUrl = e.target.value;
    setUrl(inputUrl);
    setValidationError('');
    
    if (inputUrl.trim()) {
      setIsValid(validateTikTokUrl(inputUrl.trim()));
    } else {
      setIsValid(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      setIsValid(validateTikTokUrl(text.trim()));
    } catch (error) {
      console.error('Failed to paste from clipboard:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isFileMode) {
      if (!selectedFile) {
        setValidationError('Please select a video file');
        return;
      }

      setIsValidating(true);
      setValidationError('');

      try {
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const videoData = {
          tiktokUrl: '',
          sourceVideo: {
            id: `local_video_${Date.now()}`,
            title: selectedFile.name.replace(/\.[^/.]+$/, ''),
            duration: Math.round(videoDuration),
            thumbnail: videoThumbnail || 'https://picsum.photos/400/600?random=1',
            author: 'Local Upload',
            views: 'N/A',
            likes: 'N/A'
          },
          localVideoFile: selectedFile,
          isLocalFile: true,
          name: `TikTok Clone - ${new Date().toLocaleDateString()}`
        };

        onComplete(videoData);
      } catch (error) {
        setValidationError('Failed to process video. Please try again.');
        console.error('Error processing video:', error);
      } finally {
        setIsValidating(false);
      }
    } else {
      if (!url.trim()) {
        setValidationError('Please enter a TikTok URL');
        return;
      }

      if (!isValid) {
        setValidationError('Please enter a valid TikTok URL');
        return;
      }

      setIsValidating(true);
      setValidationError('');

      try {
        // Mock validation delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock validation result
        const mockVideoData = {
          tiktokUrl: url.trim(),
          sourceVideo: {
            id: 'mock_video_123',
            title: 'Amazing TikTok Content',
            duration: 45,
            thumbnail: 'https://picsum.photos/400/600?random=1',
            author: '@creator_username',
            views: '2.3M',
            likes: '145K'
          },
          name: `TikTok Clone - ${new Date().toLocaleDateString()}`
        };

        onComplete(mockVideoData);
      } catch (error) {
        setValidationError('Failed to validate URL. Please check the link and try again.');
      } finally {
        setIsValidating(false);
      }
    }
  };

  const handleExampleClick = (exampleUrl) => {
    setUrl(exampleUrl);
    setIsValid(true);
    setShowExamples(false);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is a video
    if (!file.type.startsWith('video/')) {
      setValidationError('Please select a valid video file');
      setSelectedFile(null);
      return;
    }

    // Check file size (limit to 100MB)
    if (file.size > 100 * 1024 * 1024) {
      setValidationError('File size exceeds 100MB limit');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setValidationError('');
    generateVideoThumbnail(file);
  };

  const generateVideoThumbnail = (file) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    
    video.onloadedmetadata = () => {
      setVideoDuration(video.duration);
      setVideoMetadata({
        width: video.videoWidth,
        height: video.videoHeight,
        duration: video.duration
      });
      
      // Set video to 25% of duration to grab a meaningful frame
      video.currentTime = video.duration * 0.25;
    };
    
    video.onseeked = () => {
      // Create a canvas to capture the thumbnail
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const thumbnailUrl = canvas.toDataURL('image/jpeg');
      setVideoThumbnail(thumbnailUrl);
    };
    
    // Set up the video source
    video.src = URL.createObjectURL(file);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const toggleInputMode = () => {
    setIsFileMode(!isFileMode);
    setValidationError('');
    if (isFileMode) {
      setSelectedFile(null);
      setVideoThumbnail('');
    } else {
      setUrl('');
      setIsValid(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name={isFileMode ? "Upload" : "Link"} size={32} className="text-primary" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
          {isFileMode ? "Upload Video" : "Enter TikTok URL"}
        </h1>
        <p className="text-text-secondary max-w-2xl mx-auto">
          {isFileMode 
            ? "Upload a video file from your device to transform with an AI avatar."
            : "Paste the URL of the TikTok video you want to clone with an AI avatar."}
        </p>
        <div className="mt-4">
          <button 
            onClick={toggleInputMode}
            className="text-primary hover:text-primary-700 text-sm font-medium flex items-center justify-center mx-auto space-x-1"
          >
            <Icon name={isFileMode ? "Link" : "Upload"} size={16} />
            <span>Switch to {isFileMode ? "URL input" : "file upload"}</span>
          </button>
        </div>
      </div>

      <div className="bg-surface rounded-lg border border-border p-6 md:p-8 mb-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {isFileMode ? (
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Video File
              </label>
              
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="video/*"
                className="hidden"
              />
              
              {!selectedFile ? (
                <div 
                  onClick={handleBrowseClick}
                  className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:bg-background transition-colors duration-200"
                >
                  <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Upload" size={24} className="text-primary" />
                  </div>
                  <p className="text-text-primary font-medium mb-1">Click to browse</p>
                  <p className="text-text-secondary text-sm">or drag and drop a video file</p>
                  <p className="text-text-secondary text-xs mt-4">Supported formats: MP4, MOV, WebM (Max: 100MB)</p>
                </div>
              ) : (
                <div className="border border-border rounded-lg p-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-28 bg-background rounded-lg overflow-hidden flex-shrink-0">
                      {videoThumbnail ? (
                        <img src={videoThumbnail} alt="Video thumbnail" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-background">
                          <Icon name="Video" size={24} className="text-text-secondary" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-text-primary mb-1 truncate">
                        {selectedFile.name}
                      </h3>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-text-secondary">
                        <div className="flex items-center space-x-1">
                          <Icon name="FileText" size={12} />
                          <span>{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                        </div>
                        {videoDuration > 0 && (
                          <div className="flex items-center space-x-1">
                            <Icon name="Clock" size={12} />
                            <span>{Math.floor(videoDuration / 60)}:{Math.floor(videoDuration % 60).toString().padStart(2, '0')}</span>
                          </div>
                        )}
                        {videoMetadata?.width && (
                          <div className="flex items-center space-x-1">
                            <Icon name="Maximize" size={12} />
                            <span>{videoMetadata.width}x{videoMetadata.height}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <Icon name="Film" size={12} />
                          <span>{selectedFile.type.split('/')[1].toUpperCase()}</span>
                        </div>
                      </div>
                      <div className="mt-2 flex space-x-2">
                        <button
                          type="button"
                          onClick={handleBrowseClick}
                          className="text-xs text-primary hover:text-primary-700 font-medium transition-colors duration-200"
                        >
                          Change file
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFile(null);
                            setVideoThumbnail('');
                            setVideoMetadata(null);
                          }}
                          className="text-xs text-error hover:text-error-700 font-medium transition-colors duration-200"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {validationError && (
                <p className="mt-2 text-sm text-error flex items-center space-x-1">
                  <Icon name="AlertCircle" size={14} />
                  <span>{validationError}</span>
                </p>
              )}
            </div>
          ) : (
            <div>
              <label htmlFor="tiktok-url" className="block text-sm font-medium text-text-primary mb-2">
                TikTok Video URL
              </label>
              <div className="relative">
                <input
                  id="tiktok-url"
                  type="url"
                  value={url}
                  onChange={handleUrlChange}
                  placeholder="https://www.tiktok.com/@username/video/..."
                  className={`w-full px-4 py-3 pr-12 text-sm border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
                    validationError 
                      ? 'border-error focus:ring-error-500 focus:border-error-500' 
                      : isValid 
                        ? 'border-success focus:ring-success-500 focus:border-success-500' :'border-border'
                  }`}
                  disabled={isValidating}
                />
                <button
                  type="button"
                  onClick={handlePaste}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors duration-200"
                  title="Paste from clipboard"
                  disabled={isValidating}
                >
                  <Icon name="Clipboard" size={16} />
                </button>
                {isValid && (
                  <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                    <Icon name="CheckCircle" size={16} className="text-success" />
                  </div>
                )}
              </div>
              {validationError && (
                <p className="mt-2 text-sm text-error flex items-center space-x-1">
                  <Icon name="AlertCircle" size={14} />
                  <span>{validationError}</span>
                </p>
              )}
              {isValid && !validationError && (
                <p className="mt-2 text-sm text-success flex items-center space-x-1">
                  <Icon name="CheckCircle" size={14} />
                  <span>Valid TikTok URL detected</span>
                </p>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={(isFileMode ? !selectedFile : !isValid) || isValidating}
              className="flex-1 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isValidating ? (
                <>
                  <Icon name="Loader2" size={16} className="animate-spin" />
                  <span>{isFileMode ? "Processing video..." : "Validating URL..."}</span>
                </>
              ) : (
                <>
                  <Icon name="ArrowRight" size={16} />
                  <span>Start Processing</span>
                </>
              )}
            </button>
            
            {!isFileMode && (
              <button
                type="button"
                onClick={() => setShowExamples(!showExamples)}
                className="px-6 py-3 border border-border text-text-secondary hover:text-text-primary hover:bg-background rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Icon name="HelpCircle" size={16} />
                <span>Examples</span>
              </button>
            )}
          </div>
        </form>

        {/* Examples Section */}
        {!isFileMode && showExamples && (
          <div className="mt-6 p-4 bg-background rounded-lg border border-border-light">
            <h3 className="text-sm font-medium text-text-primary mb-3">Example TikTok URLs:</h3>
            <div className="space-y-2">
              {exampleUrls.map((exampleUrl, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(exampleUrl)}
                  className="w-full text-left p-3 text-sm text-text-secondary hover:text-text-primary hover:bg-surface rounded border border-border-light transition-colors duration-200 font-mono"
                >
                  {exampleUrl}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Requirements & Limitations */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-surface rounded-lg border border-border p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Icon name="CheckCircle" size={20} className="text-success" />
            <h3 className="text-lg font-semibold text-text-primary">Supported Features</h3>
          </div>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li className="flex items-center space-x-2">
              <Icon name="Check" size={14} className="text-success" />
              <span>{isFileMode ? "Video files up to 100MB" : "Public TikTok videos up to 2 minutes"}</span>
            </li>
            <li className="flex items-center space-x-2">
              <Icon name="Check" size={14} className="text-success" />
              <span>Multi-language speech transcription</span>
            </li>
            <li className="flex items-center space-x-2">
              <Icon name="Check" size={14} className="text-success" />
              <span>Automatic language detection</span>
            </li>
            <li className="flex items-center space-x-2">
              <Icon name="Check" size={14} className="text-success" />
              <span>HD quality avatar generation</span>
            </li>
            <li className="flex items-center space-x-2">
              <Icon name="Check" size={14} className="text-success" />
              <span>{isFileMode ? "MP4, MOV, WebM formats" : "Watermarked content support"}</span>
            </li>
          </ul>
        </div>

        <div className="bg-surface rounded-lg border border-border p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Icon name="AlertTriangle" size={20} className="text-warning" />
            <h3 className="text-lg font-semibold text-text-primary">Important Notes</h3>
          </div>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li className="flex items-center space-x-2">
              <Icon name="Info" size={14} className="text-warning" />
              <span>{isFileMode ? "Maximum video length: 3 minutes" : "Only public videos can be processed"}</span>
            </li>
            <li className="flex items-center space-x-2">
              <Icon name="Info" size={14} className="text-warning" />
              <span>Processing time: 2-5 minutes per video</span>
            </li>
            <li className="flex items-center space-x-2">
              <Icon name="Info" size={14} className="text-warning" />
              <span>Respect original creator's rights</span>
            </li>
            <li className="flex items-center space-x-2">
              <Icon name="Info" size={14} className="text-warning" />
              <span>Generated content for personal use</span>
            </li>
            <li className="flex items-center space-x-2">
              <Icon name="Info" size={14} className="text-warning" />
              <span>AI-generated content disclaimer required</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default URLInputStep;