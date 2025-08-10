import { useEffect, useState } from "react"

const AgriNews = () => {
    const [newsData, setNewsData] = useState([]);
    const [language, setLanguage] = useState("en");
    const [loading, setLoading] = useState(false);

    const fetchNews = async () => {
        try {
            setLoading(true);
            const url = `${process.env.REACT_APP_BACKEND_URI}/news/agriculture?language=${language}`;
            const response = await fetch(url, {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const output = await response.json();
            
            if (output.success && output.data) {
                setNewsData(output.data);
            } else {
                setNewsData([]);
            }
        } catch (error) {
            console.error("Error fetching news:", error);
            setNewsData([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchNews();
    }, [language]);

    const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-green-800 mb-4">
                        {language === "hi" ? "कृषि समाचार" : "Agriculture News"}
                    </h1>
                    <p className="text-lg text-green-600">
                        {language === "hi" ? "नवीनतम कृषि समाचार और अपडेट" : "Latest agriculture news and updates"}
                    </p>
                </div>

                {/* Language Selector */}
                <div className="flex justify-center mb-8">
                    <div className="bg-white rounded-lg shadow-md p-4">
                        <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                            {language === "hi" ? "भाषा चुनें" : "Select Language"}
                        </label>
                        <select
                            id="language"
                            value={language}
                            onChange={handleLanguageChange}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        >
                            <option value="en">English</option>
                            <option value="hi">हिंदी</option>
                        </select>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                    </div>
                )}

                {/* News Grid */}
                {!loading && newsData.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {newsData.map((news, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                                {news.thumbnail && (
                                    <img 
                                        src={news.thumbnail} 
                                        alt={news.title}
                                        className="w-full h-48 object-cover"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/400x200?text=Agriculture+News';
                                        }}
                                    />
                                )}
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-3">
                                        {news.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                        {news.snippet}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-500">
                                            {news.date}
                                        </span>
                                        <a
                                            href={news.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors duration-200"
                                        >
                                            {language === "hi" ? "पढ़ें" : "Read More"}
                                            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* No News State */}
                {!loading && newsData.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-500 text-lg">
                            {language === "hi" ? "कोई समाचार नहीं मिला" : "No news found"}
                        </div>
                    </div>
                )}

                {/* Refresh Button */}
                <div className="flex justify-center mt-8">
                    <button
                        onClick={fetchNews}
                        disabled={loading}
                        className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {language === "hi" ? "लोड हो रहा है..." : "Loading..."}
                            </span>
                        ) : (
                            <span className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                {language === "hi" ? "ताज़ा करें" : "Refresh News"}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AgriNews;