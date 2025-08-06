import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Load the .env file from the root directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import express from 'express';
import { dbConnect } from './config/dbConnect.js'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import todoRoutes from './routes/todoRoutes.js'
import columnRoutes from './routes/columnRoutes.js'
import verifyToken from './middleware/authMiddleware.js';

dbConnect();

const app = express();

//Middleware
app.use(express.json());

app.use((req, res, next) => { // TODO: make Authorization header work with CORS
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  if (req.method === "OPTIONS") {
    // Send a quick response for OPTIONS request
    return res.sendStatus(200);
  }
  
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/users', verifyToken, userRoutes);
app.use('/api', verifyToken, todoRoutes);
app.use('/api/columns', verifyToken, columnRoutes);

//Start Server
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server is running with port http://localhost:${PORT}`)
});





