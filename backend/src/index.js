import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import express from 'express';
import { dbConnect } from './config/dbConnect.js'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import todoRoutes from './routes/todoRoutes.js'
import columnRoutes from './routes/columnRoutes.js'
import verifyToken from './middleware/authMiddleware.js';

dbConnect();

//Middleware
const app = express();

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  'http://localhost:5173',
  'https://fullstack-kanban.netlify.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.log('Blocked CORS for origin:', origin);
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
}));

app.use('/api/auth', authRoutes);
app.use('/api/users', verifyToken, userRoutes);
app.use('/api', verifyToken, todoRoutes);
app.use('/api/columns', verifyToken, columnRoutes);

app.get('/api/auth/me', verifyToken, (req, res) => {
   res.set('Cache-Control', 'no-store');
  res.status(200).json({ _id: req.user.id, username: req.user.username });
});

//Start Server
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server is running with port http://localhost:${PORT}`)
});