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
const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

try{
    await mongoClient.connect();
    db = mongoClient.db("batepapoUol");
} catch (err) {
    console.log(err);
};

const participantShema = joi.object({
    name: joi.string().required().empty(),
    lastStatus: joi.number()
});

const messageShema= joi.object({
    from: joi.string().required().empty(),
    to: joi.string().required().empty(),
    text: joi.string().required().empty(),
    type: joi.string().required().valid("message", "private_message"),
    time: joi.string().required().empty(),
});

app.listen(5000, ()=>{
    console.log("Server running in port 5000")
});