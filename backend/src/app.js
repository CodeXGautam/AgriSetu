import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { registerUser, loginUser, refreshAccessToken, logoutUser,getCurrentUser, googleAuthCode } from './controllers/userController.js';
import { verifyJwt } from './middleware/auth.middleware.js';
import { uploadResume, uploadAvatar } from './controllers/userController.js';
import { upload } from './middleware/multer.js';

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




export default app;