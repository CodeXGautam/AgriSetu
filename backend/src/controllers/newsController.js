

export const getAgricultureNews = async (req, res) => {
    try {
        const { language = 'en', page = 1 } = req.query;
        const pageSize = 10; // Number of items per page
        const startIndex = (page - 1) * pageSize;
        
        // Get the API key from environment variables
        const apiKey = process.env.NEWS_API_KEY;
        
        if (!apiKey || apiKey === 'your_serpapi_key_here') {
            return res.status(500).json({
                success: false,
                message: 'News API key not configured. Please set NEWS_API_KEY in your environment variables or update constants.js'
            });
        }

        const url = `https://serpapi.com/search.json?engine=google_news&q=agriculture&gl=in&hl=${language}&api_key=${apiKey}&start=${startIndex}&num=${pageSize}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`News API responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.news_results) {
            return res.status(200).json({
                success: true,
                data: data.news_results,
                pagination: {
                    currentPage: parseInt(page),
                    pageSize: pageSize,
                    totalResults: data.search_information?.total_results || 0,
                    hasMore: data.news_results.length === pageSize
                },
                message: 'News fetched successfully'
            });
        } else {
            return res.status(200).json({
                success: true,
                data: [],
                pagination: {
                    currentPage: parseInt(page),
                    pageSize: pageSize,
                    totalResults: 0,
                    hasMore: false
                },
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
