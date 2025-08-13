import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import Webcam from 'react-webcam';
import { FaCamera, FaUpload, FaLeaf, FaSpinner, FaCheckCircle, FaExclamationTriangle, FaArrowLeft, FaGlobe, FaLanguage } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';

const DiseaseDetection = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'camera'
  const [webcamImage, setWebcamImage] = useState(null);
  const webcamRef = useRef(null);
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [translatedAdvice, setTranslatedAdvice] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [cameraFacing, setCameraFacing] = useState('environment'); // 'environment' or 'user'
  const [cameraError, setCameraError] = useState(null);

  // Auto-detect user's preferred language
  React.useEffect(() => {
    const userLang = navigator.language || navigator.userLanguage;
    const langCode = userLang.split('-')[0];
    
    // Check if the detected language is in our supported languages
    const supportedLang = languages.find(lang => lang.code === langCode);
    if (supportedLang && langCode !== 'en') {
      setSelectedLanguage(langCode);
    }
  }, []);

  // Available languages for translation
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
    { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
    { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'ml', name: 'മലയാളം', flag: '🇮🇳' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  ];

  // Format LLM response to remove special characters and improve readability
  const formatLLMResponse = (text) => {
    if (!text) return null;
    
    // Clean up the text
    let cleanedText = text
      .replace(/\*\*/g, '') // Remove **
      .replace(/\*/g, '') // Remove *
      .replace(/`/g, '') // Remove backticks
      .replace(/#{1,6}\s/g, '') // Remove markdown headers
      .replace(/\n{3,}/g, '\n\n') // Limit consecutive newlines to 2
      .trim();
    
    // Split into paragraphs and format
    const paragraphs = cleanedText.split('\n').filter(line => line.trim());
    
    return (
      <div className="space-y-3">
        {paragraphs.map((paragraph, index) => {
          // Check if it's a numbered list item
          const isNumberedList = /^\d+\.\s/.test(paragraph);
          // Check if it's a bullet point
          const isBulletPoint = /^[-•*]\s/.test(paragraph);
          
          if (isNumberedList || isBulletPoint) {
            return (
              <div key={index} className="flex items-start gap-3">
                <span className="text-green-300 font-medium mt-1">
                  {isNumberedList ? '•' : '•'}
                </span>
                <p className="text-white leading-relaxed">
                  {paragraph.replace(/^[-•*]\s/, '').replace(/^\d+\.\s/, '')}
                </p>
              </div>
            );
          }
          
          // Check if it's a header (starts with capital letters and ends with colon)
          const isHeader = /^[A-Z][A-Z\s]+:/.test(paragraph);
          
          if (isHeader) {
            return (
              <h4 key={index} className="text-green-300 font-semibold text-lg mb-2">
                {paragraph}
              </h4>
            );
          }
          
          return (
            <p key={index} className="text-white leading-relaxed">
              {paragraph}
            </p>
          );
        })}
      </div>
    );
  };

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: cameraFacing
  };

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setWebcamImage(imageSrc);
      setSelectedImage(imageSrc);
    }
  }, [webcamRef]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
        setWebcamImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      toast.error('Please select or capture an image first');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      // Convert base64 to blob for upload
      const base64Response = await fetch(selectedImage);
      const blob = await base64Response.blob();
      
      // Create FormData for image upload
      const formData = new FormData();
      formData.append('image', blob, 'plant_image.jpg');

      // First upload image to Cloudinary
      const uploadResponse = await fetch(`${process.env.REACT_APP_BACKEND_URI}/upload-image`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image');
      }

      const uploadData = await uploadResponse.json();
      const imageUrl = uploadData.data.image_url;

      // Call the disease detection API with the Cloudinary URL
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/disease-detection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ image_url: imageUrl }),
      });

      const data = await response.json();

      if (data.success) {
        setAnalysisResult(data.data);
        toast.success('Disease analysis completed successfully!');
      } else {
        throw new Error(data.error || 'Analysis failed');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error(error.message || 'Failed to analyze image');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setWebcamImage(null);
    setAnalysisResult(null);
    setTranslatedAdvice(null);
    setSelectedLanguage('en');
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  const handleTranslate = async () => {
    if (!analysisResult?.advice || selectedLanguage === 'en') {
      setTranslatedAdvice(null);
      return;
    }

    setIsTranslating(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          text: analysisResult.advice,
          targetLanguage: selectedLanguage
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setTranslatedAdvice(data.data.translatedText);
          toast.success(`Translated to ${languages.find(lang => lang.code === selectedLanguage)?.name}`);
        } else {
          throw new Error(data.error || 'Translation failed');
        }
      } else {
        throw new Error('Translation failed');
      }
    } catch (error) {
      console.error('Translation error:', error);
      toast.error('Failed to translate text');
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-deepGreen to-gradientLight p-4">
      <div className="max-w-6xl mx-auto">
                 {/* Header */}
         <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           className="relative mb-8"
         >
           {/* Back Button */}
           <button
             onClick={handleGoBack}
             className="absolute left-0 top-1/2 transform -translate-y-1/2 flex items-center gap-2 text-white hover:text-accentGreen transition-colors duration-300 bg-darkGreen/50 hover:bg-darkGreen/70 px-4 py-2 rounded-lg border border-accentGreen/20"
           >
             <FaArrowLeft className="text-lg" />
             <span className="font-medium">Back</span>
           </button>
           
           {/* Title */}
           <div className="text-center">
             <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
               Plant Disease Detection
             </h1>
             <p className="text-lg text-gray-200 max-w-2xl mx-auto">
               Upload a photo or capture an image of your plant to detect diseases and get expert treatment advice
             </p>
           </div>
         </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Image Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Tab Navigation */}
            <div className="flex bg-darkGreen/30 rounded-lg p-1 border border-accentGreen/20">
              <button
                onClick={() => setActiveTab('upload')}
                className={`flex-1 py-3 px-4 rounded-md font-medium transition-all duration-300 ${
                  activeTab === 'upload'
                    ? 'bg-accentGreen text-white shadow-md'
                    : 'text-gray-300 hover:text-white hover:bg-accentGreen/20'
                }`}
              >
                <FaUpload className="inline mr-2" />
                Upload Image
              </button>
              <button
                onClick={() => setActiveTab('camera')}
                className={`flex-1 py-3 px-4 rounded-md font-medium transition-all duration-300 ${
                  activeTab === 'camera'
                    ? 'bg-accentGreen text-white shadow-md'
                    : 'text-gray-300 hover:text-white hover:bg-accentGreen/20'
                }`}
              >
                <FaCamera className="inline mr-2" />
                Take Photo
              </button>
            </div>

            {/* Image Input Area */}
            <div className="bg-darkGreen/30 rounded-lg p-6 border border-accentGreen/20">
              {activeTab === 'upload' ? (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-accentGreen/40 rounded-lg p-8 text-center hover:border-accentGreen/60 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer block"
                    >
                      <FaUpload className="text-4xl text-accentGreen mx-auto mb-4" />
                      <p className="text-white text-lg mb-2">Click to upload image</p>
                      <p className="text-gray-300 text-sm">Supports JPG, PNG, GIF</p>
                    </label>
                  </div>
                </div>
                             ) : (
                 <div className="space-y-4">
                   {/* Camera Permissions Request */}
                   {!webcamRef.current && (
                     <div className="text-center p-6 bg-darkGreen/20 rounded-lg border border-accentGreen/20">
                       <FaCamera className="text-4xl text-accentGreen/50 mx-auto mb-4" />
                       <h3 className="text-white font-medium mb-2">Camera Access</h3>
                       <p className="text-gray-300 text-sm mb-4">
                         Click below to enable camera access for taking photos
                       </p>
                       <button
                         onClick={() => {
                           // This will trigger the webcam to start and request permissions
                           setCameraError(null);
                         }}
                         className="bg-accentGreen hover:bg-accentGreen/80 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                       >
                         Enable Camera
                       </button>
                     </div>
                   )}
                   
                   <div className="relative">
                     {cameraError ? (
                       <div className="w-full h-64 bg-darkGreen/20 rounded-lg border border-accentGreen/20 flex flex-col items-center justify-center text-center p-6">
                         <FaCamera className="text-4xl text-accentGreen/50 mb-4" />
                         <h3 className="text-white font-medium mb-2">Camera Access Required</h3>
                         <p className="text-gray-300 text-sm mb-4">
                           {cameraError === 'permission' 
                             ? 'Please allow camera access to use this feature'
                             : 'Camera is not available on this device'
                           }
                         </p>
                         <button
                           onClick={() => setCameraError(null)}
                           className="bg-accentGreen hover:bg-accentGreen/80 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                         >
                           Try Again
                         </button>
                       </div>
                     ) : (
                       <Webcam
                         ref={webcamRef}
                         audio={false}
                         screenshotFormat="image/jpeg"
                         videoConstraints={videoConstraints}
                         className="w-full rounded-lg border border-accentGreen/20"
                         onUserMediaError={(error) => {
                           console.error('Camera error:', error);
                           if (error.name === 'NotAllowedError') {
                             setCameraError('permission');
                           } else {
                             setCameraError('unavailable');
                           }
                         }}
                       />
                     )}
                     
                     {/* Camera Switch Button */}
                     <button
                       onClick={() => setCameraFacing(cameraFacing === 'environment' ? 'user' : 'environment')}
                       className="absolute top-4 right-4 bg-darkGreen/80 hover:bg-darkGreen text-white p-3 rounded-full shadow-lg transition-all duration-300 border border-accentGreen/30"
                       title={`Switch to ${cameraFacing === 'environment' ? 'Front' : 'Back'} Camera`}
                     >
                       <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                         <path fillRule="evenodd" d="M4 2a1 1 0 011-1h4.586a1 1 0 01.707.293l7.414 7.414a1 1 0 01.293.707V17a1 1 0 01-1 1H5a1 1 0 01-1-1V2z" clipRule="evenodd" />
                         <path fillRule="evenodd" d="M9 2a1 1 0 00-2 0v1a1 1 0 002 0V2z" clipRule="evenodd" />
                       </svg>
                     </button>
                     
                     {/* Camera Indicator */}
                     <div className="absolute top-4 left-4 bg-darkGreen/80 text-white px-3 py-1 rounded-full text-sm font-medium border border-accentGreen/30">
                       {cameraFacing === 'environment' ? '📷 Back' : '📱 Front'}
                     </div>
                     
                     {/* Capture Button */}
                     <button
                       onClick={capture}
                       className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-accentGreen hover:bg-accentGreen/80 text-white p-3 rounded-full shadow-lg transition-all duration-300"
                     >
                       <FaCamera className="text-xl" />
                     </button>
                   </div>
                  {webcamImage && (
                    <div className="text-center">
                      <p className="text-white mb-2">Captured Image:</p>
                      <img
                        src={webcamImage}
                        alt="Captured"
                        className="w-full max-w-md mx-auto rounded-lg border border-accentGreen/20"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Selected Image Display */}
              {selectedImage && (
                <div className="mt-6">
                  <h3 className="text-white font-medium mb-3">Selected Image:</h3>
                  <div className="relative">
                    <img
                      src={selectedImage}
                      alt="Selected"
                      className="w-full rounded-lg border border-accentGreen/20"
                    />
                    <button
                      onClick={resetAnalysis}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}

              {/* Analyze Button */}
              <button
                onClick={handleAnalyze}
                disabled={!selectedImage || isAnalyzing}
                className={`w-full mt-6 py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
                  selectedImage && !isAnalyzing
                    ? 'bg-accentGreen hover:bg-accentGreen/80 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <FaSpinner className="inline mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <FaLeaf className="inline mr-2" />
                    Analyze Plant Disease
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* Right Column - Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {isAnalyzing && (
              <div className="bg-darkGreen/30 rounded-lg p-8 border border-accentGreen/20 text-center">
                <FaSpinner className="text-6xl text-accentGreen mx-auto mb-4 animate-spin" />
                <h3 className="text-xl text-white font-medium mb-2">Analyzing Image</h3>
                <p className="text-gray-300">Our AI is examining your plant for diseases...</p>
              </div>
            )}

            {analysisResult && (
              <div className="space-y-6">
                {/* Disease Result */}
                <div className="bg-darkGreen/30 rounded-lg p-6 border border-accentGreen/20">
                  <div className="flex items-center mb-4">
                    <FaExclamationTriangle className="text-2xl text-red-400 mr-3" />
                    <h3 className="text-xl text-white font-medium">Detected Disease</h3>
                  </div>
                  <div className="bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-lg p-4 border border-red-500/30">
                    <p className="text-white font-bold text-xl text-center">
                      {analysisResult.disease}
                    </p>
                  </div>
                </div>

                                 {/* AI Advice */}
                 <div className="bg-darkGreen/30 rounded-lg p-6 border border-accentGreen/20">
                   <div className="flex items-center justify-between mb-4">
                     <div className="flex items-center">
                       <FaCheckCircle className="text-2xl text-green-400 mr-3" />
                       <h3 className="text-xl text-white font-medium">Treatment Advice</h3>
                     </div>
                     
                     {/* Language Selector */}
                     <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-2">
                       <FaLanguage className="text-green-400" />
                       <select
                         value={selectedLanguage}
                         onChange={(e) => {
                           setSelectedLanguage(e.target.value);
                           setTranslatedAdvice(null);
                         }}
                         className="bg-darkGreen/50 border border-accentGreen/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accentGreen/50"
                       >
                         {languages.map((lang) => (
                           <option key={lang.code} value={lang.code} className="bg-darkGreen text-white">
                             {lang.flag} {lang.name}
                           </option>
                         ))}
                       </select>
                       {selectedLanguage !== 'en' && (
                         <span className="text-xs text-green-300 bg-green-500/20 px-2 py-1 rounded-full">
                           Translation Available
                         </span>
                       )}
                     </div>
                       
                                               {selectedLanguage !== 'en' && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={handleTranslate}
                              disabled={isTranslating}
                              className="flex items-center gap-2 bg-accentGreen hover:bg-accentGreen/80 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isTranslating ? (
                                <FaSpinner className="animate-spin" />
                              ) : (
                                <FaGlobe />
                              )}
                              {isTranslating ? 'Translating...' : 'Translate'}
                            </button>
                            
                            {translatedAdvice && (
                              <button
                                onClick={() => setTranslatedAdvice(null)}
                                className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-300"
                                title="Show original English text"
                              >
                                <span className="text-xs">EN</span>
                              </button>
                            )}
                          </div>
                        )}
                     </div>
                   </div>
                   
                   <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg p-6 border border-green-500/30">
                     <div className="text-white max-w-none">
                                               {translatedAdvice ? (
                          <div>
                            <div className="mb-4 p-3 bg-accentGreen/20 rounded-lg border border-accentGreen/30">
                              <div className="flex items-center justify-between">
                                <p className="text-accentGreen text-sm font-medium">
                                  🌍 Translated to {languages.find(lang => lang.code === selectedLanguage)?.name}
                                </p>
                                <span className="text-xs text-green-300 bg-green-500/20 px-2 py-1 rounded-full">
                                  ✓ Translation Complete
                                </span>
                              </div>
                            </div>
                            {formatLLMResponse(translatedAdvice)}
                          </div>
                        ) : (
                          formatLLMResponse(analysisResult.advice)
                        )}
                     </div>
                   </div>
                 </div>

                {/* Analysis Info */}
                <div className="bg-darkGreen/30 rounded-lg p-4 border border-accentGreen/20">
                  <p className="text-gray-300 text-sm">
                    Analysis completed at: {new Date(analysisResult.timestamp).toLocaleString()}
                  </p>
                </div>

                {/* Reset Button */}
                <button
                  onClick={resetAnalysis}
                  className="w-full py-3 px-6 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-all duration-300"
                >
                  Analyze Another Image
                </button>
              </div>
            )}

            {!isAnalyzing && !analysisResult && (
              <div className="bg-darkGreen/30 rounded-lg p-8 border border-accentGreen/20 text-center">
                <FaLeaf className="text-6xl text-accentGreen mx-auto mb-4 opacity-50" />
                <h3 className="text-xl text-white font-medium mb-2">Ready to Analyze</h3>
                <p className="text-gray-300">
                  Upload an image or take a photo to start disease detection
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 bg-darkGreen/30 rounded-lg p-6 border border-accentGreen/20"
        >
          <h3 className="text-xl text-white font-medium mb-4 text-center">💡 Tips for Better Results</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-300">
            <div className="text-center">
              <div className="bg-accentGreen/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <span className="text-accentGreen text-lg">📸</span>
              </div>
              <p>Take clear, well-lit photos of the affected plant parts</p>
            </div>
            <div className="text-center">
              <div className="bg-accentGreen/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <span className="text-accentGreen text-lg">🔍</span>
              </div>
              <p>Focus on leaves, stems, and any visible symptoms</p>
            </div>
            <div className="text-center">
              <div className="bg-accentGreen/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <span className="text-accentGreen text-lg">🌱</span>
              </div>
              <p>Include healthy parts for comparison when possible</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DiseaseDetection;
