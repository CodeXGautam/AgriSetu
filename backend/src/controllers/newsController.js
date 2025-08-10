

export const getAgricultureNews = async (req, res) => {
    try {
        const { language = 'en' } = req.query;
        
        // Get the API key from constants
        const apiKey = process.env.NEWS_API_KEY;
        
        if (!apiKey || apiKey === 'your_serpapi_key_here') {
            return res.status(500).json({
                success: false,
                message: 'News API key not configured. Please set NEWS_API_KEY in your environment variables or update constants.js'
            });
        }

        const url = `https://serpapi.com/search.json?engine=google_news&q=agriculture&gl=in&hl=${language}&api_key=${apiKey}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`News API responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.news_results) {
            return res.status(200).json({
                success: true,
                data: data.news_results,
                message: 'News fetched successfully'
            });
        } else {
            return res.status(200).json({
                success: true,
                data: [],
                message: 'No news found'
            });
        }
        
    } catch (error) {
        console.error('Error fetching news:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch news',
            error: error.message
        });
    }
};
