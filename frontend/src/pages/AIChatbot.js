import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaRobot, FaUser, FaRegCopy, FaCheck, FaPlus, FaTrash, FaHistory, FaArrowLeft, FaSearch, FaMicrophone, FaBars, FaLanguage, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';

const AIChatbot = (props) => {
    const loggedIn = props.loggedIn;
    const setLoggedIn = props.setLoggedIn;
    const navigate = useNavigate();
    
    // Chat history state
    const [conversations, setConversations] = useState([]);
    const [conversationsLoading, setConversationsLoading] = useState(false);
    
    const [selectedLanguage, setSelectedLanguage] = useState('en-US');
    const [currentConversation, setCurrentConversation] = useState(null);
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'bot',
            content: selectedLanguage.startsWith('en') 
                ? "Namaste! I'm Kisaan Guru, your agricultural expert. How can I help you with farming today? Ask me anything about crops, soil, weather, or farming techniques! 🌱"
                : `नमस्ते! मैं किसान गुरु हूं, आपका कृषि विशेषज्ञ। आज मैं आपकी खेती में कैसे मदद कर सकता हूं? मुझसे फसलों, मिट्टी, मौसम या खेती की तकनीकों के बारे में कुछ भी पूछें! 🌱`,
            timestamp: new Date()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [copiedId, setCopiedId] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [speechRecognition, setSpeechRecognition] = useState(null);
    
    // Text-to-Speech state
    const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
    const [speechSynthesis, setSpeechSynthesis] = useState(null);
    const [currentUtterance, setCurrentUtterance] = useState(null);
    const [availableVoices, setAvailableVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState(null);
    
    // Location state
    const [userLocation, setUserLocation] = useState(null);
    const [locationPermission, setLocationPermission] = useState('prompt');
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Initialize speech synthesis
    useEffect(() => {
        if ('speechSynthesis' in window) {
            const synthesis = window.speechSynthesis;
            setSpeechSynthesis(synthesis);
            
            // Load available voices
            const loadVoices = () => {
                const voices = synthesis.getVoices();
                setAvailableVoices(voices);
                
                // Auto-select voice based on language
                const preferredVoice = voices.find(voice => 
                    voice.lang === selectedLanguage || 
                    voice.lang.startsWith(selectedLanguage.split('-')[0])
                ) || voices.find(voice => voice.lang.startsWith('en')) || voices[0];
                
                setSelectedVoice(preferredVoice);
            };
            
            // Load voices when they become available
            if (synthesis.getVoices().length > 0) {
                loadVoices();
            } else {
                synthesis.onvoiceschanged = loadVoices;
            }
        }
    }, [selectedLanguage]);

    // Function to speak text
    const speakText = (text) => {
        if (!speechSynthesis || !isVoiceEnabled || !selectedVoice) return;
        
        // Stop any current speech
        if (currentUtterance) {
            speechSynthesis.cancel();
        }
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = selectedVoice;
        utterance.rate = 0.9; // Slightly slower for better comprehension
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        
        utterance.onstart = () => {
            setCurrentUtterance(utterance);
        };
        
        utterance.onend = () => {
            setCurrentUtterance(null);
        };
        
        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event.error);
            setCurrentUtterance(null);
            toast.error('Speech synthesis failed. Please try again.');
        };
        
        speechSynthesis.speak(utterance);
    };

    // Function to stop speech
    const stopSpeech = () => {
        if (speechSynthesis) {
            speechSynthesis.cancel();
            setCurrentUtterance(null);
        }
    };

    // Toggle voice feature
    const toggleVoice = () => {
        if (!speechSynthesis) {
            toast.error('Speech synthesis is not supported in this browser');
            return;
        }
        
        setIsVoiceEnabled(!isVoiceEnabled);
        
        if (isVoiceEnabled) {
            stopSpeech();
            toast.success('Voice responses disabled');
        } else {
            toast.success('Voice responses enabled');
        }
    };

    // Request user location
    const requestLocation = () => {
        if (!navigator.geolocation) {
            toast.error('Geolocation is not supported by this browser');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ latitude, longitude });
                setLocationPermission('granted');
                
                // Reverse geocode to get city, state, country
                fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`)
                    .then(response => response.json())
                    .then(data => {
                        setUserLocation(prev => ({
                            ...prev,
                            city: data.city || data.locality,
                            state: data.principalSubdivision,
                            country: data.countryName
                        }));
                    })
                    .catch(error => {
                        console.log('Reverse geocoding failed, using coordinates only');
                    });
                
                toast.success('Location access granted! I can now provide location-specific farming advice.');
            },
            (error) => {
                console.error('Location error:', error);
                setLocationPermission('denied');
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        toast.error('Location access denied. I\'ll provide general farming advice.');
                        break;
                    case error.POSITION_UNAVAILABLE:
                        toast.error('Location information unavailable.');
                        break;
                    case error.TIMEOUT:
                        toast.error('Location request timed out.');
                        break;
                    default:
                        toast.error('Location error occurred.');
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000
            }
        );
    };

    // Load existing conversations from backend
    const loadConversations = async () => {
        try {
            setConversationsLoading(true);
            
            if (!loggedIn) {
                // For non-authenticated users, load from localStorage
                const localConversations = localStorage.getItem('kisaanChatConversations');
                if (localConversations) {
                    const parsed = JSON.parse(localConversations);
                    setConversations(parsed.map(conv => ({
                        ...conv,
                        timestamp: new Date(conv.timestamp),
                        isLocal: true
                    })));
                } else {
                    setConversations([]);
                }
                return;
            }

            // For authenticated users, load from backend
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/conversations`, {
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                const loadedConversations = data.data.map(conv => ({
                    id: conv._id,
                    title: conv.title,
                    timestamp: new Date(conv.createdAt),
                    messageCount: conv.messageCount || 0,
                    isLocal: false
                }));
                
                setConversations(loadedConversations);
            } else if (response.status === 401) {
                // User not authenticated, try localStorage
                const localConversations = localStorage.getItem('kisaanChatConversations');
                if (localConversations) {
                    const parsed = JSON.parse(localConversations);
                    setConversations(parsed.map(conv => ({
                        ...conv,
                        timestamp: new Date(conv.timestamp),
                        isLocal: true
                    })));
                } else {
                    setConversations([]);
                }
            } else {
                throw new Error('Failed to load conversations');
            }
        } catch (error) {
            console.error('Error loading conversations:', error);
            // Fallback to localStorage if backend fails
            try {
                const localConversations = localStorage.getItem('kisaanChatConversations');
                if (localConversations) {
                    const parsed = JSON.parse(localConversations);
                    setConversations(parsed.map(conv => ({
                        ...conv,
                        timestamp: new Date(conv.timestamp),
                        isLocal: true
                    })));
                }
            } catch (localError) {
                console.error('Local storage fallback failed:', localError);
                setConversations([]);
            }
        } finally {
            setConversationsLoading(false);
        }
    };

    useEffect(() => {
        scrollToBottom();
        // Request location when component mounts
        requestLocation();
        // Load existing conversations from backend
        loadConversations();
        
        // Cleanup function to stop speech when component unmounts
        return () => {
            if (speechSynthesis) {
                speechSynthesis.cancel();
            }
        };
    }, []);

    // Load conversations when user authentication status changes
    useEffect(() => {
        if (loggedIn) {
            // Migrate local conversations to backend if any exist
            migrateLocalConversations();
            loadConversations();
        }
    }, [loggedIn]);

    // Migrate local conversations to backend when user logs in
    const migrateLocalConversations = async () => {
        try {
            const localConversations = JSON.parse(localStorage.getItem('kisaanChatConversations') || '[]');
            if (localConversations.length === 0) return;

            for (const localConv of localConversations) {
                try {
                    // Create conversation in backend
                    const response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/conversations`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                        body: JSON.stringify({
                            title: localConv.title,
                            userLanguage: selectedLanguage.split('-')[0],
                            location: userLocation
                        }),
                    });

                    if (response.ok) {
                        const data = await response.json();
                        const backendConvId = data.data._id;

                        // Save all messages to backend
                        if (localConv.messages) {
                            for (const msg of localConv.messages) {
                                await fetch(`${process.env.REACT_APP_BACKEND_URI}/conversations/${backendConvId}/messages`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    credentials: 'include',
                                    body: JSON.stringify({
                                        role: msg.type === 'user' ? 'user' : 'assistant',
                                        content: msg.content,
                                        userLanguage: selectedLanguage.split('-')[0]
                                    }),
                                });
                            }
                        }
                    }
                } catch (error) {
                    console.error('Error migrating conversation:', localConv.id, error);
                }
            }

            // Clear local conversations after successful migration
            localStorage.removeItem('kisaanChatConversations');
            toast.success('Chat history migrated to your account successfully!');
        } catch (error) {
            console.error('Error migrating conversations:', error);
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const createNewConversation = async () => {
        try {
            const newConversationId = Date.now().toString();
            const newConversation = {
                id: newConversationId,
                title: "New conversation",
                timestamp: new Date(),
                messageCount: 1,
                isLocal: !loggedIn
            };
            
            if (loggedIn) {
                // For authenticated users, create in backend
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/conversations`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        title: "New conversation",
                        userLanguage: selectedLanguage.split('-')[0],
                        location: userLocation
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    newConversation.id = data.data._id;
                    newConversation.isLocal = false;
                    
                    // Save welcome message to backend
                    await saveMessageToBackend(newConversation.id, 'assistant', 
                        selectedLanguage.startsWith('en') 
                            ? "Namaste! I'm Kisaan Guru, your agricultural expert. How can I help you with farming today? Ask me anything about crops, soil, weather, or farming techniques! 🌱"
                            : `नमस्ते! मैं किसान गुरु हूं, आपका कृषि विशेषज्ञ। आज मैं आपकी खेती में कैसे मदद कर सकता हूं? मुझसे फसलों, मिट्टी, मौसम या खेती की तकनीकों के बारे में कुछ भी पूछें! 🌱`
                    );
                } else {
                    throw new Error('Failed to create conversation in backend');
                }
            } else {
                // For non-authenticated users, save to localStorage
                const welcomeMessage = {
                    id: 1,
                    type: 'bot',
                    content: selectedLanguage.startsWith('en') 
                        ? "Namaste! I'm Kisaan Guru, your agricultural expert. How can I help you with farming today? Ask me anything about crops, soil, weather, or farming techniques! 🌱"
                        : `नमस्ते! मैं किसान गुरु हूं, आपका कृषि विशेषज्ञ। आज मैं आपकी खेती में कैसे मदद कर सकता हूं? मुझसे फसलों, मिट्टी, मौसम या खेती की तकनीकों के बारे में कुछ भी पूछें! 🌱`,
                    timestamp: new Date()
                };
                
                // Save conversation to localStorage
                const localConversations = JSON.parse(localStorage.getItem('kisaanChatConversations') || '[]');
                const conversationToSave = {
                    ...newConversation,
                    messages: [welcomeMessage]
                };
                localConversations.unshift(conversationToSave);
                localStorage.setItem('kisaanChatConversations', JSON.stringify(localConversations));
            }
            
            setConversations(prev => [newConversation, ...prev]);
            setCurrentConversation(newConversation);
            
            const welcomeMessage = {
                id: 1,
                type: 'bot',
                content: selectedLanguage.startsWith('en') 
                    ? "Namaste! I'm Kisaan Guru, your agricultural expert. How can I help you with farming today? Ask me anything about crops, soil, weather, or farming techniques! 🌱"
                    : `नमस्ते! मैं किसान गुरु हूं, आपका कृषि विशेषज्ञ। आज मैं आपकी खेती में कैसे मदद कर सकता हूं? मुझसे फसलों, मिट्टी, मौसम या खेती की तकनीकों के बारे में कुछ भी पूछें! 🌱`,
                timestamp: new Date()
            };
            
            setMessages([welcomeMessage]);
            
        } catch (error) {
            console.error('Error creating conversation:', error);
            toast.error('Failed to create new conversation');
        }
    };

    // Helper function to save messages to backend or localStorage
    const saveMessageToBackend = async (conversationId, role, content) => {
        try {
            if (currentConversation?.isLocal) {
                // Save to localStorage for local conversations
                const localConversations = JSON.parse(localStorage.getItem('kisaanChatConversations') || '[]');
                const conversationIndex = localConversations.findIndex(conv => conv.id === conversationId);
                
                if (conversationIndex !== -1) {
                    const messageToSave = {
                        id: Date.now(),
                        type: role === 'user' ? 'user' : 'bot',
                        content: content,
                        timestamp: new Date()
                    };
                    
                    if (!localConversations[conversationIndex].messages) {
                        localConversations[conversationIndex].messages = [];
                    }
                    
                    localConversations[conversationIndex].messages.push(messageToSave);
                    localConversations[conversationIndex].messageCount = localConversations[conversationIndex].messages.length;
                    
                    localStorage.setItem('kisaanChatConversations', JSON.stringify(localConversations));
                }
            } else {
                // Save to backend for authenticated conversations
                await fetch(`${process.env.REACT_APP_BACKEND_URI}/conversations/${conversationId}/messages`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        role,
                        content,
                        userLanguage: selectedLanguage.split('-')[0]
                    }),
                });
            }
        } catch (error) {
            console.error('Error saving message:', error);
        }
    };

    const selectConversation = async (conversation) => {
        try {
            setCurrentConversation(conversation);
            
            if (conversation.isLocal) {
                // Load local conversation from localStorage
                const localConversations = JSON.parse(localStorage.getItem('kisaanChatConversations') || '[]');
                const localConv = localConversations.find(conv => conv.id === conversation.id);
                
                if (localConv && localConv.messages) {
                    const loadedMessages = localConv.messages.map((msg, index) => ({
                        id: index + 1,
                        type: msg.type,
                        content: msg.content,
                        timestamp: new Date(msg.timestamp)
                    }));
                    setMessages(loadedMessages);
                } else {
                    // Fallback to welcome message
                    setMessages([
                        {
                            id: 1,
                            type: 'bot',
                            content: selectedLanguage.startsWith('en') 
                                ? `Welcome back to: "${conversation.title}". How can I help you continue our discussion? 🌱`
                                : `"${conversation.title}" पर वापस आपका स्वागत है। मैं आपकी चर्चा जारी रखने में कैसे मदद कर सकता हूं? 🌱`,
                            timestamp: new Date()
                        }
                    ]);
                }
            } else {
                // Load conversation messages from backend
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/conversations/${conversation.id}`, {
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    const conversationData = data.data;
                    
                    // Convert backend messages to frontend format
                    const loadedMessages = conversationData.messages.map((msg, index) => ({
                        id: index + 1,
                        type: msg.role === 'user' ? 'user' : 'bot',
                        content: msg.content,
                        timestamp: new Date(msg.timestamp)
                    }));
                    
                    setMessages(loadedMessages);
                } else {
                    // Fallback to welcome message if loading fails
                    setMessages([
                        {
                            id: 1,
                            type: 'bot',
                            content: selectedLanguage.startsWith('en') 
                                ? `Welcome back to: "${conversation.title}". How can I help you continue our discussion? 🌱`
                                : `"${conversation.title}" पर वापस आपका स्वागत है। मैं आपकी चर्चा जारी रखने में कैसे मदद कर सकता हूं? 🌱`,
                            timestamp: new Date()
                        }
                    ]);
                }
            }
        } catch (error) {
            console.error('Error loading conversation:', error);
            // Fallback to welcome message
            setMessages([
                {
                    id: 1,
                    type: 'bot',
                    content: selectedLanguage.startsWith('en') 
                        ? `Welcome back to: "${conversation.title}". How can I help you continue our discussion? 🌱`
                        : `"${conversation.title}" पर वापस आपका स्वागत है। मैं आपकी चर्चा जारी रखने में कैसे मदद कर सकता हूं? 🌱`,
                    timestamp: new Date()
                }
            ]);
        }
    };

    const deleteConversation = async (conversationId) => {
        try {
            if (currentConversation?.isLocal) {
                // Delete from localStorage
                const localConversations = JSON.parse(localStorage.getItem('kisaanChatConversations') || '[]');
                const updatedConversations = localConversations.filter(conv => conv.id !== conversationId);
                localStorage.setItem('kisaanChatConversations', JSON.stringify(updatedConversations));
            } else {
                // Delete from backend
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/v1/conversations/${conversationId}`, {
                    method: 'DELETE',
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Failed to delete conversation from backend');
                }
            }

            // Remove from local state
            setConversations(prev => prev.filter(conv => conv.id !== conversationId));
            
            // If current conversation is deleted, clear it
            if (currentConversation?.id === conversationId) {
                setCurrentConversation(null);
                setMessages([
                    {
                        id: 1,
                        type: 'bot',
                        content: selectedLanguage.startsWith('en') 
                            ? "Namaste! I'm Kisaan Guru, your agricultural expert. How can I help you with farming today? Ask me anything about crops, soil, weather, or farming techniques! 🌱"
                            : `नमस्ते! मैं किसान गुरु हूं, आपका कृषि विशेषज्ञ। आज मैं आपकी खेती में कैसे मदद कर सकता हूं? मुझसे फसलों, मिट्टी, मौसम या खेती की तकनीकों के बारे में कुछ भी पूछें! 🌱`,
                        timestamp: new Date()
                    }
                ]);
            }
        } catch (error) {
            console.error('Error deleting conversation:', error);
            toast.error('Failed to delete conversation');
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
            
            if (currentConversation.isLocal) {
                // Update title in localStorage
                const localConversations = JSON.parse(localStorage.getItem('kisaanChatConversations') || '[]');
                const conversationIndex = localConversations.findIndex(conv => conv.id === currentConversation.id);
                if (conversationIndex !== -1) {
                    localConversations[conversationIndex].title = newTitle;
                    localStorage.setItem('kisaanChatConversations', JSON.stringify(localConversations));
                }
            }
            
            setConversations(prev => prev.map(conv => 
                conv.id === currentConversation.id 
                    ? { ...conv, title: newTitle }
                    : conv
            ));
        }

        setInputMessage('');
        setIsLoading(true);

        try {
            // Call the agricultural chatbot API
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/agricultural-chatbot`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    message: userMessage.content,
                    userLanguage: selectedLanguage.split('-')[0], // Convert 'en-US' to 'en' for backend
                    conversationHistory: messages.map(msg => ({
                        role: msg.type === 'user' ? 'user' : 'assistant',
                        content: msg.content
                    })),
                    location: userLocation // Include user location for location-based advice
                }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    const botMessage = {
                        id: Date.now() + 1,
                        type: 'bot',
                        content: data.data.response,
                        timestamp: new Date()
                    };
                    setMessages(prev => [...prev, botMessage]);
                    
                    // Speak the bot's response if voice is enabled
                    if (isVoiceEnabled) {
                        speakText(botMessage.content);
                    }
                    
                    // Save messages to backend if conversation exists
                    if (currentConversation) {
                        await saveMessageToBackend(currentConversation.id, 'user', userMessage.content);
                        await saveMessageToBackend(currentConversation.id, 'assistant', botMessage.content);
                        
                        // Update conversation message count
                        setConversations(prev => prev.map(conv => 
                            conv.id === currentConversation.id 
                                ? { ...conv, messageCount: conv.messageCount + 2 }
                                : conv
                        ));
                    }
                } else {
                    throw new Error(data.error || 'Chat failed');
                }
            } else {
                throw new Error('Chat request failed');
            }
        } catch (error) {
            console.error('Chat error:', error);
            toast.error('Failed to get response. Please try again.');
            
            // Add error message
            const errorMessage = {
                id: Date.now() + 1,
                type: 'bot',
                content: selectedLanguage.startsWith('en') 
                    ? "I'm sorry, I'm having trouble responding right now. Please try again in a moment."
                    : "माफ़ करें, मुझे अभी जवाब देने में समस्या हो रही है। कृपया कुछ देर बाद फिर से कोशिश करें।",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
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

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ctrl/Cmd + V to toggle voice
            if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
                e.preventDefault();
                toggleVoice();
            }
            
            // Escape to stop speech
            if (e.key === 'Escape' && currentUtterance) {
                e.preventDefault();
                stopSpeech();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [currentUtterance]);

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

    // Available languages for Web Speech API
    const languages = [
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

    // Auto-detect user's preferred language
    useEffect(() => {
        const userLang = navigator.language || navigator.userLanguage;
        
        // Try to find exact match first
        let supportedLang = languages.find(lang => lang.code === userLang);
        
        // If no exact match, try to find by base language
        if (!supportedLang) {
            const baseLang = userLang.split('-')[0];
            supportedLang = languages.find(lang => lang.code.startsWith(baseLang));
        }
        
        if (supportedLang && supportedLang.code !== 'en-US') {
            setSelectedLanguage(supportedLang.code);
        }
    }, []);

    // Update welcome message when language changes
    useEffect(() => {
        if (messages.length === 1 && messages[0].type === 'bot') {
            const welcomeMessage = {
                id: messages[0].id,
                type: 'bot',
                content: selectedLanguage.startsWith('en') 
                    ? "Namaste! I'm Kisaan Guru, your agricultural expert. How can I help you with farming today? Ask me anything about crops, soil, weather, or farming techniques! 🌱"
                    : `नमस्ते! मैं किसान गुरु हूं, आपका कृषि विशेषज्ञ। आज मैं आपकी खेती में कैसे मदद कर सकता हूं? मुझसे फसलों, मिट्टी, मौसम या खेती की तकनीकों के बारे में कुछ भी पूछें! 🌱`,
                timestamp: messages[0].timestamp
            };
            setMessages([welcomeMessage]);
        }
    }, [selectedLanguage]);

    const startRecording = () => {
        try {
            // Check if Web Speech API is supported
            if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
                toast.error('Speech recognition is not supported in this browser');
                return;
            }

            // Create speech recognition instance
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            
            // Configure recognition
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = selectedLanguage;
            
            // Set up event handlers
            recognition.onstart = () => {
                setIsRecording(true);
                setIsTranscribing(true);
                toast.success('Listening... Speak now!');
            };
            
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInputMessage(transcript);
                toast.success('Voice transcribed successfully!');
            };
            
            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                let errorMessage = 'Speech recognition failed';
                
                switch (event.error) {
                    case 'no-speech':
                        errorMessage = 'No speech detected. Please try again.';
                        break;
                    case 'audio-capture':
                        errorMessage = 'Microphone access denied. Please check permissions.';
                        break;
                    case 'not-allowed':
                        errorMessage = 'Microphone access denied. Please check permissions.';
                        break;
                    case 'network':
                        errorMessage = 'Network error occurred. Please try again.';
                        break;
                    default:
                        errorMessage = `Speech recognition error: ${event.error}`;
                }
                
                toast.error(errorMessage);
                setIsRecording(false);
                setIsTranscribing(false);
            };
            
            recognition.onend = () => {
                setIsRecording(false);
                setIsTranscribing(false);
            };
            
            // Store recognition instance and start
            setSpeechRecognition(recognition);
            recognition.start();
            
        } catch (error) {
            console.error('Error starting speech recognition:', error);
            toast.error('Failed to start speech recognition. Please try again.');
            setIsRecording(false);
            setIsTranscribing(false);
        }
    };

    const stopRecording = () => {
        if (speechRecognition && isRecording) {
            speechRecognition.stop();
            setIsRecording(false);
            setIsTranscribing(false);
        }
    };

    const handleMicrophoneToggle = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
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
                                    <h1 className="text-xl font-bold text-cream">Kisaan Guru</h1>
                                    <p className="text-cream/70 text-sm">
                                        {currentConversation ? currentConversation.title : 'New conversation'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            {/* Voice Controls */}
                            <div className="flex items-center gap-2">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={toggleVoice}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 border ${
                                        isVoiceEnabled 
                                            ? 'bg-accentGreen/20 text-accentGreen border-accentGreen/50' 
                                            : 'bg-darkGreen/50 text-cream/70 border-accentGreen/30 hover:bg-accentGreen/10 hover:text-cream'
                                    }`}
                                    title={isVoiceEnabled ? 'Disable voice responses (Ctrl+V)' : 'Enable voice responses (Ctrl+V)'}
                                >
                                    {isVoiceEnabled ? <FaVolumeUp size={16} /> : <FaVolumeMute size={16} />}
                                    <span className="text-sm font-medium hidden sm:inline">
                                        {isVoiceEnabled ? 'Voice ON' : 'Voice OFF'}
                                    </span>
                                </motion.button>
                                
                                {/* Voice Settings Dropdown */}
                                {isVoiceEnabled && availableVoices.length > 0 && (
                                    <div className="relative">
                                        <select
                                            value={selectedVoice ? `${selectedVoice.name}-${selectedVoice.lang}` : ''}
                                            onChange={(e) => {
                                                const [name, lang] = e.target.value.split('-');
                                                const voice = availableVoices.find(v => v.name === name && v.lang === lang);
                                                setSelectedVoice(voice);
                                                if (currentUtterance) {
                                                    stopSpeech();
                                                }
                                            }}
                                            className="bg-darkGreen/50 border border-accentGreen/30 rounded-lg px-3 py-2 text-cream text-sm focus:outline-none focus:border-accentGreen/50 max-w-48"
                                        >
                                            {availableVoices
                                                .filter(voice => voice.lang.startsWith(selectedLanguage.split('-')[0]) || voice.lang.startsWith('en'))
                                                .map((voice) => (
                                                    <option 
                                                        key={`${voice.name}-${voice.lang}`} 
                                                        value={`${voice.name}-${voice.lang}`}
                                                        className="bg-darkGreen text-cream"
                                                    >
                                                        {voice.name} ({voice.lang})
                                                    </option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                )}
                                
                                {/* Stop Speech Button */}
                                {currentUtterance && (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={stopSpeech}
                                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/20 text-red-400 border border-red-400/30 transition-all duration-200"
                                        title="Stop current speech"
                                    >
                                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                        <span className="text-sm font-medium hidden sm:inline">Stop</span>
                                    </motion.button>
                                )}
                            </div>
                            
                            {/* Language Selector */}
                            <div className="flex items-center gap-2">
                                <FaLanguage className="text-cream/70" />
                                <select
                                    value={selectedLanguage}
                                    onChange={(e) => setSelectedLanguage(e.target.value)}
                                    className="bg-darkGreen/50 border border-accentGreen/30 rounded-lg px-3 py-2 text-cream text-sm focus:outline-none focus:border-accentGreen/50"
                                >
                                    {languages.map((lang) => (
                                        <option key={lang.code} value={lang.code} className="bg-darkGreen text-cream">
                                            {lang.flag} {lang.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            {/* Location Indicator */}
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${
                                    locationPermission === 'granted' ? 'bg-green-400' : 
                                    locationPermission === 'denied' ? 'bg-red-400' : 'bg-yellow-400'
                                }`}></div>
                                <span className="text-cream/70 text-sm">
                                    {locationPermission === 'granted' && userLocation?.city 
                                        ? `${userLocation.city}${userLocation.state ? `, ${userLocation.state}` : ''}`
                                        : locationPermission === 'granted' 
                                        ? 'Location Active'
                                        : locationPermission === 'denied'
                                        ? 'Location Denied'
                                        : 'Getting Location...'
                                    }
                                </span>
                                {locationPermission === 'denied' && (
                                    <button
                                        onClick={requestLocation}
                                        className="text-cream/60 hover:text-cream px-2 py-1 rounded-lg hover:bg-accentGreen/20 transition-colors text-xs"
                                        title="Request location access"
                                    >
                                        Enable
                                    </button>
                                )}
                                <button
                                    onClick={requestLocation}
                                    className="text-cream/60 hover:text-cream p-1 rounded-lg hover:bg-accentGreen/20 transition-colors"
                                    title="Refresh location"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </button>
                            </div>
                            
                            <div className="text-3xl">🤖</div>
                            
                            {/* Help Tooltip */}
                            <div className="relative group">
                                <button className="text-cream/60 hover:text-cream p-2 rounded-lg hover:bg-accentGreen/20 transition-colors" title="Keyboard shortcuts">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </button>
                                <div className="absolute right-0 top-full mt-2 w-64 bg-darkGreen/95 border border-accentGreen/30 rounded-xl p-4 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                    <h3 className="text-cream font-semibold mb-2">Keyboard Shortcuts</h3>
                                    <div className="space-y-2 text-sm text-cream/80">
                                        <div className="flex justify-between">
                                            <span>Toggle Voice:</span>
                                            <kbd className="px-2 py-1 bg-accentGreen/20 rounded text-xs">Ctrl+V</kbd>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Stop Speech:</span>
                                            <kbd className="px-2 py-1 bg-accentGreen/20 rounded text-xs">Esc</kbd>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Send Message:</span>
                                            <kbd className="px-2 py-1 bg-accentGreen/20 rounded text-xs">Enter</kbd>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>New Line:</span>
                                            <kbd className="px-2 py-1 bg-accentGreen/20 rounded text-xs">Shift+Enter</kbd>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Location-based Advice Indicator */}
            {userLocation && locationPermission === 'granted' && (
                <div className="bg-gradient-to-r from-accentGreen/20 to-lightGreen/20 border-b border-accentGreen/30">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
                        <div className="flex items-center justify-center gap-2 text-sm text-cream/80">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span>
                                Providing location-specific farming advice for {userLocation.city || 'your area'}
                                {userLocation.state && `, ${userLocation.state}`}
                            </span>
                        </div>
                    </div>
                </div>
            )}

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
                                <div className="flex items-center gap-2">
                                    {loggedIn && conversations.some(conv => conv.isLocal) && (
                                        <button
                                            onClick={migrateLocalConversations}
                                            className="text-cream/60 hover:text-cream p-2 rounded-lg hover:bg-accentGreen/20 transition-colors"
                                            title="Sync local conversations to your account"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setSidebarOpen(false)}
                                        className="text-cream/60 hover:text-cream transition-colors p-1 rounded-lg hover:bg-accentGreen/20"
                                    >
                                        ×
                                    </button>
                                </div>
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
                            {conversationsLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="flex space-x-2">
                                        <div className="w-3 h-3 bg-accentGreen rounded-full animate-bounce"></div>
                                        <div className="w-3 h-3 bg-accentGreen rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-3 h-3 bg-accentGreen rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                </div>
                            ) : conversations.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="text-cream/60 text-sm mb-2">No conversations yet</div>
                                    <div className="text-cream/40 text-xs">Start a new chat to begin!</div>
                                </div>
                            ) : (
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
                                                        {conversation.isLocal && (
                                                            <span className="text-xs text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded-full">
                                                                Local
                                                            </span>
                                                        )}
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
                            )}
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
                                                } ${currentUtterance && message.type === 'bot' ? 'ring-2 ring-accentGreen/50' : ''}`}>
                                                    <div className="flex items-start justify-between space-x-3">
                                                        <div className="flex-1">
                                                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                                                {message.content}
                                                            </p>
                                                        </div>
                                                        {message.type === 'bot' && (
                                                            <div className="flex items-center gap-1">
                                                                {/* Play/Speak Button */}
                                                                {isVoiceEnabled && (
                                                                    <motion.button
                                                                        whileHover={{ scale: 1.1 }}
                                                                        whileTap={{ scale: 0.9 }}
                                                                        onClick={() => speakText(message.content)}
                                                                        className="flex-shrink-0 text-cream/60 hover:text-accentGreen transition-colors p-1 rounded-lg hover:bg-accentGreen/20"
                                                                        title="Listen to this message"
                                                                    >
                                                                        <FaVolumeUp size={14} />
                                                                    </motion.button>
                                                                )}
                                                                
                                                                {/* Copy Button */}
                                                                <button
                                                                    onClick={() => copyToClipboard(message.content, message.id)}
                                                                    className="flex-shrink-0 text-cream/60 hover:text-cream transition-colors p-1 rounded-lg hover:bg-accentGreen/20"
                                                                    title="Copy message"
                                                                >
                                                                    {copiedId === message.id ? <FaCheck size={14} /> : <FaRegCopy size={14} />}
                                                                </button>
                                                            </div>
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
                                            disabled={isTranscribing}
                                            className={`p-2 rounded-lg transition-all duration-200 ${
                                                isRecording 
                                                    ? 'bg-red-500/20 text-red-400 border border-red-400/30' 
                                                    : isTranscribing
                                                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-400/30'
                                                    : 'text-cream/60 hover:text-cream hover:bg-accentGreen/20'
                                            }`}
                                            title={isRecording ? 'Stop recording' : isTranscribing ? 'Transcribing...' : 'Start voice input'}
                                        >
                                            {isTranscribing ? (
                                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <FaMicrophone size={16} />
                                            )}
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
                            
                            {/* Voice Status and Quick Suggestions */}
                            <div className="mt-4 flex flex-wrap items-center gap-3">
                                {/* Voice Status Indicator */}
                                {isVoiceEnabled && (
                                    <div className="flex items-center gap-2 px-3 py-2 bg-accentGreen/10 border border-accentGreen/30 rounded-xl text-sm text-accentGreen">
                                        <FaVolumeUp size={14} />
                                        <span>Voice responses enabled</span>
                                        {currentUtterance && (
                                            <div className="w-3 h-3 bg-accentGreen rounded-full animate-pulse"></div>
                                        )}
                                    </div>
                                )}
                                
                                {/* Quick Suggestions */}
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
