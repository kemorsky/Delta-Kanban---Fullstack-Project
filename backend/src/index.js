import express from 'express';
import dotenv from 'dotenv'
import { dbConnect } from './config/dbConnect.js'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import todoRoutes from './routes/todoRoutes.js'
import columnRoutes from './routes/columnRoutes.js'

dbConnect();
dotenv.config();

const app = express();

//Middleware
app.use(express.json());

app.use((req, res, next) => { // TODO: make Authorization header work with CORS
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  if (req.method === "OPTIONS") {
    // Send a quick response for OPTIONS request
    return res.sendStatus(200);
  }
  
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api', todoRoutes);
app.use('/api/columns', columnRoutes);

//Start Server
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server is running with port http://localhost:${PORT}`)
});





