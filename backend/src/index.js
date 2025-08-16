import express from 'express';
import serverless from 'serverless-http';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { dbConnect } from './config/dbConnect.js'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import todoRoutes from './routes/todoRoutes.js'
import columnRoutes from './routes/columnRoutes.js'
import verifyToken from './middleware/authMiddleware.js';

await dbConnect();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

//Middleware
const app = express();

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  'http://localhost:5173',
  'https://fullstack-kanban-delta.vercel.app',
  'https://fullstack-kanban-backend.vercel.app',
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

app.options('*', cors());

app.use((req, res, next) => {
  console.log('Incoming URL:', req.url);
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/users', verifyToken, userRoutes);
app.use('/api', verifyToken, todoRoutes);
app.use('/api', verifyToken, columnRoutes);

app.get('/api/auth/me', verifyToken, (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.status(200).json({ _id: req.user.id, username: req.user.username });
});

export const handler = serverless(app);

// Start Server
// const PORT = process.env.PORT || 3001;

// app.listen(PORT, () => {
//     console.log(`Server is running with port http://localhost:${PORT}`)
// });

// if (process.env.NODE_ENV !== "production") {
//   const PORT = process.env.PORT || 3001;
//   app.listen(PORT, () => {
//     console.log(`Server running locally on http://localhost:${PORT}`);
//   });
// }

export default app;