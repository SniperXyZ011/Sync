import express from 'express';
import dotenv from 'dotenv';
import connetDB from './config/database.js';
import userRoute from './routes/userRoute.js';
import messageRoute from './routes/messageRoute.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
dotenv.config();


const app = express();
const port = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/user", userRoute, () => {
    console.log("this was called");
});
app.use("/api/v1/message", messageRoute, () => {
    console.log("this was called");
})

app.listen(port, () => {
    connetDB();
    console.log(`Server is running on port ${port}`);
});