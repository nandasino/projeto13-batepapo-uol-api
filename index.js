import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import joi from 'joi';
import dayjs from 'dayjs';

const app = express();

//configs
dotenv.config();
app.use(cors());
app.use(express.json());

app.listen(500, ()=>{
    console.log("Server running in port 5000")
});