import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load the .env file from src
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import connectDB from '../src/db/db.js';
import  app  from './app.js';


connectDB()
.then(async()=>{
    app.listen(process.env.PORT||4000, ()=>{
        console.log(`Server is running at port : ${process.env.PORT||4000}`);
    })
})
.catch((err)=>{
    console.log("Mongo DB connection failed !!", err)
})
