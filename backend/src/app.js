import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { registerUser, loginUser, refreshAccessToken, logoutUser,getCurrentUser, googleAuthCode } from './controllers/userController.js';
import { getAgricultureNews } from './controllers/newsController.js';
import { getWeatherInfo } from './controllers/weatherController.js';
import { analyzePlantDisease, agriculturalChatbot } from './controllers/chatmodelController.js';
import { uploadImage, deleteImage } from './controllers/imageController.js';
import { translateText, getSupportedLanguages } from './controllers/translationController.js';
import { 
  createConversation, 
  getUserConversations, 
  getConversation, 
  addMessage, 
  updateConversationTitle, 
  deleteConversation, 
  clearAllConversations 
} from './controllers/chatController.js';
import { acknowledgeSpeechRecognition, getSpeechLanguages } from './controllers/whisperController.js';
import { verifyJwt } from './middleware/auth.middleware.js';
import { upload, uploadMemory } from './middleware/multer.js';
import { addItems, addtocart, getallItems, increaseCartItemQuantity ,decreaseCartItemQuantity, getCartItemsWithDetails} from './controllers/marketController.js';
import { getCropRecommendations, getCropDetails, saveCropSelection } from './controllers/cropRecommendationController.js';
import { getCropPricingAnalytics, getCropPriceTrends } from './controllers/analyticsController.js';

const app = express();

app.use(cors({
  origin:['http://localhost:3000','https://img.favpng.com/22/20/12/crop-clip-art-png-favpng-nqpSRgidPzwXf1UYKddBUx5uM.jpg'],
  credentials: true,
  exposedHeaders: ['set-cookie']
}));


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Expose-Headers', 'set-cookie');
  next();
});

app.use(cookieParser());           
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/api/v1/register', registerUser);
app.post('/api/v1/login', loginUser);
app.post('/api/v1/refresh-token', refreshAccessToken);
app.get('/api/v1/getUser',verifyJwt, getCurrentUser);
app.get('/api/v1/logout',verifyJwt, logoutUser);
app.post('/api/v1/auth/google-auth-code', googleAuthCode);

// News routes
app.get('/api/v1/news/agriculture', getAgricultureNews);

// Weather routes
app.post('/api/v1/weather', getWeatherInfo);

// Disease detection routes
app.post('/api/v1/disease-detection', analyzePlantDisease);

// Agricultural chatbot routes
app.post('/api/v1/agricultural-chatbot', agriculturalChatbot);

// Image upload routes
app.post('/api/v1/upload-image', uploadMemory.single('image'), uploadImage);
app.delete('/api/v1/delete-image/:public_id', deleteImage);

// Translation routes
app.post('/api/v1/translate', translateText);
app.get('/api/v1/languages', getSupportedLanguages);

// Chat routes
app.post('/api/v1/conversations', verifyJwt, createConversation);
app.get('/api/v1/conversations', verifyJwt, getUserConversations);
app.get('/api/v1/conversations/:conversationId', verifyJwt, getConversation);
app.post('/api/v1/conversations/:conversationId/messages', verifyJwt, addMessage);
app.put('/api/v1/conversations/:conversationId/title', verifyJwt, updateConversationTitle);
app.delete('/api/v1/conversations/:conversationId', verifyJwt, deleteConversation);
app.delete('/api/v1/conversations', verifyJwt, clearAllConversations);

// Web Speech API routes
app.post('/api/v1/speech/recognize', acknowledgeSpeechRecognition);
app.get('/api/v1/speech/languages', getSpeechLanguages);


//marketplace routes 
app.post('/api/v1/market/additem', addItems);
app.get('/api/v1/market/getallitems', getallItems);
app.post('/api/v1/market/addtocart', verifyJwt, addtocart);
app.put('/api/v1/market/increasequantity', verifyJwt, increaseCartItemQuantity);
app.put('/api/v1/market/decreasequantity', verifyJwt, decreaseCartItemQuantity);
app.get('/api/v1/market/cart-details', verifyJwt, getCartItemsWithDetails);

// Crop recommendation routes
app.post('/api/v1/crop-recommendations', verifyJwt, getCropRecommendations);
app.get('/api/v1/crops/:cropName', getCropDetails);
app.post('/api/v1/crop-selection', verifyJwt, saveCropSelection);

// Analytics routes
app.post('/api/v1/analytics/crop-pricing', verifyJwt, getCropPricingAnalytics);
app.post('/api/v1/analytics/crop-trends', verifyJwt, getCropPriceTrends);

export default app;