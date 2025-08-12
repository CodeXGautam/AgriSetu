import fetch from 'node-fetch';

// Translation endpoint using multiple translation services for reliability
export const translateText = async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;

    if (!text || !targetLanguage) {
      return res.status(400).json({
        success: false,
        error: 'Text and target language are required'
      });
    }

    // Try multiple translation services for better reliability
    let translatedText = null;
    let error = null;

    // Service 1: LibreTranslate (free)
    try {
      const response = await fetch('https://libretranslate.de/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: 'en',
          target: targetLanguage,
          format: 'text'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.translatedText) {
          translatedText = data.translatedText;
        }
      }
    } catch (e) {
      console.log('LibreTranslate failed, trying next service...');
    }

    // Service 2: MyMemory (free alternative)
    if (!translatedText) {
      try {
        const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLanguage}`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.responseData && data.responseData.translatedText) {
            translatedText = data.responseData.translatedText;
          }
        }
      } catch (e) {
        console.log('MyMemory failed, trying next service...');
      }
    }

    // Service 3: Lingva (free alternative)
    if (!translatedText) {
      try {
        const response = await fetch(`https://lingva.ml/api/v1/en/${targetLanguage}/${encodeURIComponent(text)}`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.translation) {
            translatedText = data.translation;
          }
        }
      } catch (e) {
        console.log('Lingva failed...');
      }
    }

    if (translatedText) {
      res.status(200).json({
        success: true,
        data: {
          translatedText: translatedText,
          sourceLanguage: 'en',
          targetLanguage: targetLanguage,
          confidence: 0.9
        }
      });
    } else {
      throw new Error('All translation services failed');
    }

  } catch (error) {
    console.error('Translation error:', error);
    
    // Fallback: Return original text with error message
    res.status(500).json({
      success: false,
      error: 'Translation service unavailable',
      message: 'Please try again later or use the English version',
      fallbackText: req.body.text
    });
  }
};

// Get supported languages
export const getSupportedLanguages = async (req, res) => {
  try {
    const response = await fetch('https://libretranslate.de/languages');
    
    if (!response.ok) {
      throw new Error('Failed to fetch languages');
    }

    const languages = await response.json();

    res.status(200).json({
      success: true,
      data: languages
    });

  } catch (error) {
    console.error('Language fetch error:', error);
    
    // Return a basic list of supported languages as fallback
    const fallbackLanguages = [
      { code: 'en', name: 'English' },
      { code: 'hi', name: 'Hindi' },
      { code: 'bn', name: 'Bengali' },
      { code: 'te', name: 'Telugu' },
      { code: 'ta', name: 'Tamil' },
      { code: 'mr', name: 'Marathi' },
      { code: 'gu', name: 'Gujarati' },
      { code: 'kn', name: 'Kannada' },
      { code: 'ml', name: 'Malayalam' },
      { code: 'pa', name: 'Punjabi' },
      { code: 'es', name: 'Spanish' },
      { code: 'fr', name: 'French' },
      { code: 'de', name: 'German' },
      { code: 'zh', name: 'Chinese' },
      { code: 'ja', name: 'Japanese' },
      { code: 'ko', name: 'Korean' },
      { code: 'ar', name: 'Arabic' }
    ];

    res.status(200).json({
      success: true,
      data: fallbackLanguages
    });
  }
};
