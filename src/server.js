import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import { connectDB } from './lib/db.js';
import authRoute from './routes/auth.route.js';
import userRoute from './routes/users.route.js';
import chatRoute from './routes/chat.route.js';
import path from 'path'
const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173", "*"],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // allow frontend to send cookies
  })
);
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoute);
app.use('/api/users', userRoute)
app.use('/api/chat', chatRoute)

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB()
});
