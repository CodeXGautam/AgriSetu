import { useEffect, useState, useRef, useCallback } from "react"
import { useNavigate } from "react-router-dom"

const AgriNews = () => {
    const [newsData, setNewsData] = useState([]);
    const [language, setLanguage] = useState("en");
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const navigate = useNavigate();
    const observer = useRef();
    const lastNewsElementRef = useRef();

    const fetchNews = async (pageNum = 1, append = false) => {
        try {
            if (pageNum === 1) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }

            const url = `${process.env.REACT_APP_BACKEND_URI}/news/agriculture?language=${language}&page=${pageNum}`;
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
                if (append) {
                    setNewsData(prev => [...prev, ...output.data]);
                } else {
                    setNewsData(output.data);
                }
                
                // Check if we have more data using pagination info
                if (output.pagination && output.pagination.hasMore !== undefined) {
                    setHasMore(output.pagination.hasMore);
                } else {
                    // Fallback: check if we got fewer items than expected
                    setHasMore(output.data.length >= 10);
                }
            } else {
                if (!append) {
                    setNewsData([]);
                }
                setHasMore(false);
            }
        } catch (error) {
            console.error("Error fetching news:", error);
            if (!append) {
                setNewsData([]);
            }
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }

    useEffect(() => {
        setPage(1);
        setHasMore(true);
        fetchNews(1, false);
    }, [language]);

    const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
    };

    const handleBackClick = () => {
        navigate(-1); // Go back to previous page
    };

    // Infinite scroll observer
    const lastNewsElementRefCallback = useCallback(node => {
        if (loading || loadingMore) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                const nextPage = page + 1;
                setPage(nextPage);
                fetchNews(nextPage, true);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, loadingMore, hasMore, page]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-green-200">
            {/* Header with Back Button */}
            <div className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-green-200 sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={handleBackClick}
                            className="flex items-center text-green-700 hover:text-green-800 hover:bg-green-50 px-3 py-2 rounded-lg transition-all duration-200 group"
                        >
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span className="font-medium text-sm sm:text-base">
                                {language === "hi" ? "वापस" : "Back"}
                            </span>
                        </button>
                        
                        <div className="text-center flex-1">
                            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-green-800">
                                {language === "hi" ? "कृषि समाचार" : "Agriculture News"}
                            </h1>
                            <p className="hidden sm:block text-sm md:text-base text-green-600 mt-1">
                                {language === "hi" ? "नवीनतम कृषि समाचार और अपडेट" : "Latest agriculture news and updates"}
                            </p>
                        </div>

                        <div className="w-16 sm:w-20"></div> {/* Spacer for centering */}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                {/* Language Selector */}
                <div className="flex justify-center mb-8">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 border border-green-100">
                        <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-3 text-center">
                            {language === "hi" ? "🌐 भाषा चुनें" : "🌐 Select Language"}
                        </label>
                        <select
                            id="language"
                            value={language}
                            onChange={handleLanguageChange}
                            className="block w-full px-4 py-3 border-2 border-green-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-center font-medium transition-all duration-200 hover:border-green-300"
                        >
                            <option value="en">🇺🇸 English</option>
                            <option value="hi">🇮🇳 हिंदी</option>
                        </select>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-16 sm:py-20">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-16 w-16 sm:h-20 sm:w-20 border-4 border-green-200 border-t-green-600 mx-auto mb-4"></div>
                            <p className="text-green-600 text-lg font-medium">
                                {language === "hi" ? "समाचार लोड हो रहे हैं..." : "Loading news..."}
                            </p>
                        </div>
                    </div>
                )}

                {/* News Grid - Responsive Design */}
                {!loading && newsData.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                        {newsData.map((news, index) => (
                            <div 
                                key={index} 
                                ref={index === newsData.length - 1 ? lastNewsElementRefCallback : null}
                                className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group overflow-hidden border border-green-100"
                            >
                                {/* Image Section */}
                                <div className="relative overflow-hidden">
                                    {news.thumbnail ? (
                                        <img 
                                            src={news.thumbnail} 
                                            alt={news.title}
                                            className="w-full h-48 sm:h-56 lg:h-52 xl:h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/400x250/10B981/FFFFFF?text=Agriculture+News';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-48 sm:h-56 lg:h-52 xl:h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                                            <div className="text-center text-white">
                                                <svg className="w-16 h-16 mx-auto mb-2 opacity-80" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                                </svg>
                                                <p className="text-sm font-medium">Agriculture News</p>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Date Badge */}
                                    {news.date && (
                                        <div className="absolute top-3 right-3 bg-green-600/90 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-full">
                                            {news.date}
                                        </div>
                                    )}
                                </div>

                                {/* Content Section */}
                                <div className="p-4 sm:p-5 lg:p-4 xl:p-5">
                                    <h3 className="text-base sm:text-lg lg:text-base xl:text-lg font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-green-700 transition-colors duration-200">
                                        {news.title}
                                    </h3>
                                    
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                                        {news.snippet}
                                    </p>
                                    
                                    {/* Read More Button */}
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center text-xs text-gray-500">
                                            <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                            </svg>
                                            <span>Agriculture</span>
                                        </div>
                                        
                                        <a
                                            href={news.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-medium rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                                        >
                                            {language === "hi" ? "पढ़ें" : "Read"}
                                            <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Loading More Indicator */}
                {loadingMore && (
                    <div className="flex justify-center items-center py-8 sm:py-12">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-200 border-t-green-600 mx-auto mb-3"></div>
                            <span className="text-green-600 font-medium">
                                {language === "hi" ? "और समाचार लोड हो रहे हैं..." : "Loading more news..."}
                            </span>
                        </div>
                    </div>
                )}

                {/* No More News Indicator */}
                {!loading && !loadingMore && !hasMore && newsData.length > 0 && (
                    <div className="text-center py-12 sm:py-16">
                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg border border-green-200">
                            <div className="text-6xl mb-4">🎉</div>
                            <div className="text-gray-600 text-lg sm:text-xl font-medium">
                                {language === "hi" ? "सभी समाचार दिखाए गए हैं!" : "All news have been shown!"}
                            </div>
                            <p className="text-gray-500 text-sm sm:text-base mt-2">
                                {language === "hi" ? "आप सभी उपलब्ध समाचार देख चुके हैं" : "You've seen all available news"}
                            </p>
                        </div>
                    </div>
                )}

                {/* No News State */}
                {!loading && newsData.length === 0 && (
                    <div className="text-center py-16 sm:py-20">
                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 sm:p-12 shadow-lg border border-green-200">
                            <div className="text-6xl mb-4">📰</div>
                            <div className="text-gray-600 text-lg sm:text-xl font-medium mb-2">
                                {language === "hi" ? "कोई समाचार नहीं मिला" : "No news found"}
                            </div>
                            <p className="text-gray-500 text-sm sm:text-base">
                                {language === "hi" ? "कृपया बाद में पुनः प्रयास करें" : "Please try again later"}
                            </p>
                        </div>
                    </div>
                )}

                {/* Refresh Button */}
                <div className="flex justify-center mt-12 sm:mt-16">
                    <button
                        onClick={() => {
                            setPage(1);
                            setHasMore(true);
                            fetchNews(1, false);
                        }}
                        disabled={loading}
                        className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-2xl hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
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