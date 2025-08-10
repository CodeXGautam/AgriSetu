import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaRobot, FaUser, FaRegCopy, FaCheck, FaPlus, FaTrash, FaHistory, FaArrowLeft, FaSearch, FaMicrophone, FaCamera, FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import Sidebar from "../Components/Sidebar";

const AIChatbot = (props) => {
    const loggedIn = props.loggedIn;
    const setLoggedIn = props.setLoggedIn;
    const navigate = useNavigate();
    
    // Chat history state
    const [conversations, setConversations] = useState([
        {
            id: 1,
            title: "Weather advice for crops",
            timestamp: new Date(Date.now() - 86400000), // 1 day ago
            messageCount: 4
        },
        {
            id: 2,
            title: "Pest control methods",
            timestamp: new Date(Date.now() - 172800000), // 2 days ago
            messageCount: 6
        },
        {
            id: 3,
            title: "Soil health tips",
            timestamp: new Date(Date.now() - 259200000), // 3 days ago
            messageCount: 8
        }
    ]);
    
    const [currentConversation, setCurrentConversation] = useState(null);
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'bot',
            content: "Hello! I'm your AI agriculture assistant. I can help you with farming advice, crop recommendations, pest control, weather analysis, and much more. How can I assist you today? 🌱",
            timestamp: new Date()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [copiedId, setCopiedId] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const createNewConversation = () => {
        const newConversation = {
            id: Date.now(),
            title: "New conversation",
            timestamp: new Date(),
            messageCount: 1
        };
        setConversations(prev => [newConversation, ...prev]);
        setCurrentConversation(newConversation);
        setMessages([
            {
                id: 1,
                type: 'bot',
                content: "Hello! I'm your AI agriculture assistant. I can help you with farming advice, crop recommendations, pest control, weather analysis, and much more. How can I assist you today? 🌱",
                timestamp: new Date()
            }
        ]);
    };

    const selectConversation = (conversation) => {
        setCurrentConversation(conversation);
        // In a real app, you would load the messages for this conversation from the backend
        setMessages([
            {
                id: 1,
                type: 'bot',
                content: `Welcome back to: "${conversation.title}". How can I help you continue our discussion? 🌱`,
                timestamp: new Date()
            }
        ]);
    };

    const deleteConversation = (conversationId) => {
        setConversations(prev => prev.filter(conv => conv.id !== conversationId));
        if (currentConversation?.id === conversationId) {
            setCurrentConversation(null);
            setMessages([
                {
                    id: 1,
                    type: 'bot',
                    content: "Hello! I'm your AI agriculture assistant. I can help you with farming advice, crop recommendations, pest control, weather analysis, and much more. How can I assist you today? 🌱",
                    timestamp: new Date()
                }
            ]);
        }
    };

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const userMessage = {
            id: Date.now(),
            type: 'user',
            content: inputMessage.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        
        // Update conversation title if it's the first user message
        if (currentConversation && messages.length === 1) {
            const newTitle = inputMessage.trim().length > 30 
                ? inputMessage.trim().substring(0, 30) + '...' 
                : inputMessage.trim();
            setConversations(prev => prev.map(conv => 
                conv.id === currentConversation.id 
                    ? { ...conv, title: newTitle }
                    : conv
            ));
        }

        setInputMessage('');
        setIsLoading(true);

        // Simulate AI response (replace with actual API call)
        setTimeout(() => {
            const botResponse = generateBotResponse(inputMessage.trim());
            const botMessage = {
                id: Date.now() + 1,
                type: 'bot',
                content: botResponse,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMessage]);
            
            // Update conversation message count
            if (currentConversation) {
                setConversations(prev => prev.map(conv => 
                    conv.id === currentConversation.id 
                        ? { ...conv, messageCount: conv.messageCount + 2 }
                        : conv
                ));
            }
            
            setIsLoading(false);
        }, 1500);
    };

    const generateBotResponse = (userInput) => {
        const input = userInput.toLowerCase();
        
        if (input.includes('weather') || input.includes('climate')) {
            return "Based on current weather patterns, I recommend monitoring soil moisture levels and adjusting irrigation schedules accordingly. Consider using weather-resistant crop varieties for better yield. Would you like specific recommendations for your region? 🌤️";
        }
        
        if (input.includes('pest') || input.includes('disease') || input.includes('insect')) {
            return "For pest and disease management, I suggest implementing integrated pest management (IPM) strategies. This includes crop rotation, biological controls, and minimal chemical intervention. Regular monitoring is key to early detection. 🐛";
        }
        
        if (input.includes('fertilizer') || input.includes('nutrient') || input.includes('soil')) {
            return "Soil health is crucial for crop success. I recommend soil testing to determine nutrient deficiencies. Organic fertilizers like compost and manure can improve soil structure. Consider crop-specific nutrient requirements for optimal growth. 🌱";
        }
        
        if (input.includes('crop') || input.includes('plant') || input.includes('harvest')) {
            return "Crop selection should be based on your climate, soil type, and market demand. I can help you choose crops that are well-suited for your growing conditions. What's your primary growing season and soil type? 🌾";
        }
        
        if (input.includes('irrigation') || input.includes('water') || input.includes('drip')) {
            return "Efficient irrigation is essential for water conservation and crop health. Drip irrigation systems can reduce water waste by 30-50%. Consider soil moisture sensors for precise watering schedules. 💧";
        }
        
        if (input.includes('organic') || input.includes('sustainable') || input.includes('natural')) {
            return "Organic farming practices focus on soil health, biodiversity, and natural pest control. Crop rotation, cover cropping, and composting are excellent sustainable practices. These methods can improve long-term soil fertility. 🌿";
        }
        
        if (input.includes('market') || input.includes('price') || input.includes('sell')) {
            return "Market analysis is important for profitable farming. I recommend researching local market demands, building relationships with buyers, and considering value-added products. Diversification can help manage market risks. 📊";
        }
        
        if (input.includes('technology') || input.includes('ai') || input.includes('digital')) {
            return "Modern farming technology includes precision agriculture tools, IoT sensors, and AI-powered crop monitoring. These technologies can optimize resource use and improve yields. Would you like to learn about specific tech solutions? 🤖";
        }
        
        return "I understand you're asking about agriculture. I can help with weather analysis, pest management, soil health, crop selection, irrigation, organic farming, market strategies, and agricultural technology. Could you please be more specific about what you'd like to know? 🌾";
    };

    const copyToClipboard = async (text, messageId) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedId(messageId);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatTimestamp = (timestamp) => {
        const now = new Date();
        const diff = now - timestamp;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        
        if (days === 0) return 'Today';
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days} days ago`;
        return timestamp.toLocaleDateString();
    };

    const filteredConversations = conversations.filter(conversation =>
        conversation.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleMicrophoneToggle = () => {
        setIsRecording(!isRecording);
        // TODO: Integrate microphone API here
        console.log('Microphone toggled:', !isRecording);
    };

    const handleCameraToggle = () => {
        setIsCameraActive(!isCameraActive);
        // TODO: Integrate camera API here
        console.log('Camera toggled:', !isCameraActive);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-deepGreen via-darkGreen to-gradientLight">
            {/* Top Navigation Bar */}
            <div className="bg-gradient-to-r from-deepGreen/95 to-darkGreen/95 backdrop-blur-sm border-b border-accentGreen/20 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate(-1)}
                                className="flex items-center gap-2 text-cream/90 hover:text-cream bg-darkGreen/50 hover:bg-accentGreen/20 px-4 py-2 rounded-xl transition-all duration-200 border border-accentGreen/30 hover:border-accentGreen/50 shadow-md"
                            >
                                <FaArrowLeft size={16} />
                                <span className="font-medium">Back</span>
                            </motion.button>
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-accentGreen to-lightGreen rounded-xl flex items-center justify-center shadow-lg">
                                    <FaRobot size={20} className="text-white" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-cream">AI Agriculture Assistant</h1>
                                    <p className="text-cream/70 text-sm">
                                        {currentConversation ? currentConversation.title : 'New conversation'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="text-3xl">🤖</div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex gap-6 h-[calc(100vh-120px)]">
                    {/* Chat History Sidebar */}
                    <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 ease-in-out bg-darkGreen/80 backdrop-blur-sm rounded-2xl border border-accentGreen/20 shadow-xl flex flex-col overflow-hidden`}>
                        {/* Search Bar */}
                        <div className="p-4 border-b border-accentGreen/20">
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cream/60" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search conversations..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-darkGreen/50 border border-accentGreen/30 rounded-xl text-cream placeholder-cream/60 focus:outline-none focus:border-accentGreen focus:ring-1 focus:ring-accentGreen/20 transition-all duration-200"
                                />
                            </div>
                        </div>
                        <div className="p-6 border-b border-accentGreen/20">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-cream">Chat History</h2>
                                <button
                                    onClick={() => setSidebarOpen(false)}
                                    className="text-cream/60 hover:text-cream transition-colors p-1 rounded-lg hover:bg-accentGreen/20"
                                >
                                    ×
                                </button>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={createNewConversation}
                                className="w-full bg-gradient-to-r from-accentGreen to-lightGreen hover:from-lightGreen hover:to-accentGreen text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all duration-200 shadow-lg"
                            >
                                <FaPlus size={14} />
                                New Chat
                            </motion.button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-2">
                            <AnimatePresence>
                                {filteredConversations.map((conversation) => (
                                    <motion.div
                                        key={conversation.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.2 }}
                                        className={`rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                                            currentConversation?.id === conversation.id
                                                ? 'bg-gradient-to-r from-accentGreen/20 to-lightGreen/20 border border-accentGreen/40 shadow-md'
                                                : 'hover:bg-darkGreen/60 border border-transparent hover:border-accentGreen/30 hover:shadow-md'
                                        }`}
                                        onClick={() => selectConversation(conversation)}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-sm font-semibold text-cream truncate">
                                                    {conversation.title}
                                                </h3>
                                                <div className="flex items-center gap-3 mt-2">
                                                    <span className="text-xs text-cream/60 bg-darkGreen/50 px-2 py-1 rounded-full">
                                                        {formatTimestamp(conversation.timestamp)}
                                                    </span>
                                                    <span className="text-xs text-cream/50">
                                                        {conversation.messageCount} messages
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteConversation(conversation.id);
                                                }}
                                                className="text-cream/40 hover:text-red-400 transition-colors ml-2 p-1 rounded-lg hover:bg-red-500/10"
                                            >
                                                <FaTrash size={12} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Main Chat Area */}
                    <div className="flex-1 flex flex-col bg-darkGreen/80 backdrop-blur-sm rounded-2xl border border-accentGreen/20 shadow-xl overflow-hidden">
                        {/* Sidebar Toggle Button (when sidebar is closed) */}
                        {!sidebarOpen && (
                            <div className="absolute top-4 left-4 z-10">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSidebarOpen(true)}
                                    className="flex items-center gap-2 text-cream/90 hover:text-cream bg-darkGreen/70 hover:bg-accentGreen/20 px-3 py-2 rounded-xl transition-all duration-200 border border-accentGreen/30 hover:border-accentGreen/50 shadow-lg backdrop-blur-sm"
                                >
                                    <FaBars size={16} />
                                    <span className="text-sm font-medium">History</span>
                                </motion.button>
                            </div>
                        )}
                        
                        {/* Messages Container */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            <AnimatePresence>
                                {messages.map((message) => (
                                    <motion.div
                                        key={message.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`flex items-start space-x-3 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                            {/* Avatar */}
                                            <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${
                                                message.type === 'user' 
                                                    ? 'bg-gradient-to-br from-accentGreen to-lightGreen text-white' 
                                                    : 'bg-gradient-to-br from-deepGreen to-darkGreen text-white border border-accentGreen/30'
                                            }`}>
                                                {message.type === 'user' ? <FaUser size={18} /> : <FaRobot size={18} />}
                                            </div>

                                            {/* Message Content */}
                                            <div className={`flex-1 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                                                <div className={`inline-block p-5 rounded-2xl shadow-lg ${
                                                    message.type === 'user'
                                                        ? 'bg-gradient-to-r from-accentGreen to-lightGreen text-white rounded-br-lg'
                                                        : 'bg-darkGreen/60 border border-accentGreen/20 text-cream rounded-bl-lg backdrop-blur-sm'
                                                }`}>
                                                    <div className="flex items-start justify-between space-x-3">
                                                        <div className="flex-1">
                                                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                                                {message.content}
                                                            </p>
                                                        </div>
                                                        {message.type === 'bot' && (
                                                            <button
                                                                onClick={() => copyToClipboard(message.content, message.id)}
                                                                className="flex-shrink-0 text-cream/60 hover:text-cream transition-colors p-1 rounded-lg hover:bg-accentGreen/20"
                                                            >
                                                                {copiedId === message.id ? <FaCheck size={14} /> : <FaRegCopy size={14} />}
                                                            </button>
                                                        )}
                                                    </div>
                                                    <div className={`text-xs mt-3 ${message.type === 'user' ? 'text-white/70' : 'text-cream/60'}`}>
                                                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {/* Loading Indicator */}
                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex justify-start"
                                >
                                    <div className="flex items-start space-x-3 max-w-[85%]">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-deepGreen to-darkGreen flex items-center justify-center shadow-lg border border-accentGreen/30">
                                            <FaRobot size={18} className="text-white" />
                                        </div>
                                        <div className="bg-darkGreen/60 border border-accentGreen/20 rounded-2xl rounded-bl-lg p-5 backdrop-blur-sm">
                                            <div className="flex space-x-2">
                                                <div className="w-3 h-3 bg-accentGreen rounded-full animate-bounce"></div>
                                                <div className="w-3 h-3 bg-accentGreen rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                <div className="w-3 h-3 bg-accentGreen rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-6 border-t border-accentGreen/20 bg-darkGreen/60 backdrop-blur-sm">
                            <div className="flex items-end space-x-4">
                                <div className="flex-1 relative">
                                    <textarea
                                        ref={inputRef}
                                        value={inputMessage}
                                        onChange={(e) => setInputMessage(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Ask me anything about agriculture, farming, crops, weather, pests, or farming technology..."
                                        className="w-full p-4 pr-32 bg-darkGreen/50 border border-accentGreen/30 rounded-2xl text-cream placeholder-cream/60 resize-none focus:outline-none focus:border-accentGreen focus:ring-2 focus:ring-accentGreen/20 transition-all duration-200 backdrop-blur-sm shadow-lg"
                                        rows="1"
                                        style={{ minHeight: '56px', maxHeight: '140px' }}
                                    />
                                    
                                    {/* Input Action Buttons */}
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                                        {/* Microphone Button */}
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={handleMicrophoneToggle}
                                            className={`p-2 rounded-lg transition-all duration-200 ${
                                                isRecording 
                                                    ? 'bg-red-500/20 text-red-400 border border-red-400/30' 
                                                    : 'text-cream/60 hover:text-cream hover:bg-accentGreen/20'
                                            }`}
                                        >
                                            <FaMicrophone size={16} />
                                        </motion.button>
                                        
                                        {/* Camera Button */}
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={handleCameraToggle}
                                            className={`p-2 rounded-lg transition-all duration-200 ${
                                                isCameraActive 
                                                    ? 'bg-blue-500/20 text-blue-400 border border-blue-400/30' 
                                                    : 'text-cream/60 hover:text-cream hover:bg-accentGreen/20'
                                            }`}
                                        >
                                            <FaCamera size={16} />
                                        </motion.button>
                                    </div>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleSendMessage}
                                    disabled={!inputMessage.trim() || isLoading}
                                    className="flex-shrink-0 w-14 h-14 bg-gradient-to-r from-accentGreen to-lightGreen hover:from-lightGreen hover:to-accentGreen disabled:from-accentGreen/50 disabled:to-lightGreen/50 disabled:cursor-not-allowed rounded-2xl flex items-center justify-center transition-all duration-200 shadow-lg"
                                >
                                    <FaPaperPlane size={18} className="text-white" />
                                </motion.button>
                            </div>
                            
                            {/* Quick Suggestions */}
                            <div className="mt-4 flex flex-wrap gap-3">
                                {[
                                    "Weather advice for crops",
                                    "Pest control methods",
                                    "Soil health tips",
                                    "Crop recommendations"
                                ].map((suggestion, index) => (
                                    <motion.button
                                        key={index}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setInputMessage(suggestion)}
                                        className="px-4 py-2 bg-darkGreen/50 border border-accentGreen/30 rounded-xl text-sm text-cream/80 hover:bg-accentGreen/20 hover:text-cream hover:border-accentGreen/50 transition-all duration-200 backdrop-blur-sm shadow-md"
                                    >
                                        {suggestion}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIChatbot;
