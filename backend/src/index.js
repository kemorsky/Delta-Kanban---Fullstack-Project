import express from 'express';
import dotenv from 'dotenv'
import { dbConnect } from './config/dbConnect.js'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import todoRoutes from './routes/todoRoutes.js'

dbConnect();
dotenv.config();

const app = express();

//Middleware
app.use(express.json());

app.use((req, res, next) => { // TODO: make Authorization header work with CORS
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/todos', todoRoutes);

//Start Server
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server is running with port http://localhost:${PORT}`)
});





