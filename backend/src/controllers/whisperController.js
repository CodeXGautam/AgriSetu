
// Web Speech API endpoint - Frontend handles speech recognition
export const acknowledgeSpeechRecognition = async (req, res) => {
  try {
    // This endpoint is kept for compatibility but speech recognition is handled by frontend
    res.status(200).json({
      success: true,
      message: 'Speech recognition handled by frontend using Web Speech API',
      data: {
        supported: true,
        method: 'Web Speech API'
      }
    });
  } catch (error) {
    console.error('Speech recognition error:', error);
    res.status(500).json({
      success: false,
      error: 'Speech recognition service unavailable'
    });
  }
};

// Get supported languages for Web Speech API
export const getSpeechLanguages = async (req, res) => {
  try {
    // Web Speech API supports these languages
    const supportedLanguages = [
      { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
      { code: 'en-IN', name: 'English (India)', flag: '🇮🇳' },
      { code: 'hi-IN', name: 'हिंदी (India)', flag: '🇮🇳' },
      { code: 'bn-IN', name: 'বাংলা (India)', flag: '🇧🇩' },
      { code: 'te-IN', name: 'తెలుగు (India)', flag: '🇮🇳' },
      { code: 'ta-IN', name: 'தமிழ் (India)', flag: '🇮🇳' },
      { code: 'mr-IN', name: 'मराठी (India)', flag: '🇮🇳' },
      { code: 'gu-IN', name: 'ગુજરાતી (India)', flag: '🇮🇳' },
      { code: 'kn-IN', name: 'ಕನ್ನಡ (India)', flag: '🇮🇳' },
      { code: 'ml-IN', name: 'മലയാളം (India)', flag: '🇮🇳' },
      { code: 'pa-IN', name: 'ਪੰਜਾਬੀ (India)', flag: '🇮🇳' },
      { code: 'es-ES', name: 'Español (Spain)', flag: '🇪🇸' },
      { code: 'es-MX', name: 'Español (Mexico)', flag: '🇲🇽' },
      { code: 'fr-FR', name: 'Français (France)', flag: '🇫🇷' },
      { code: 'de-DE', name: 'Deutsch (Germany)', flag: '🇩🇪' },
      { code: 'zh-CN', name: '中文 (China)', flag: '🇨🇳' },
      { code: 'ja-JP', name: '日本語 (Japan)', flag: '🇯🇵' },
      { code: 'ko-KR', name: '한국어 (Korea)', flag: '🇰🇷' },
      { code: 'ar-SA', name: 'العربية (Saudi Arabia)', flag: '🇸🇦' }
    ];

    res.status(200).json({
      success: true,
      data: supportedLanguages
    });

  } catch (error) {
    console.error('Get languages error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch supported languages'
    });
  }
};
