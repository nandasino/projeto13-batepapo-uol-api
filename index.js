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

app.post("/participants", async (req, res)=>{
    const body = req.body;
    const validation = participantShema.validate(body, {abortEarly: false});

    if(validation.error){
        const errors = validation.error.details.map((detail)=>detail.message);
        res.status(422).send(errors);
        console.log(errors);
        return;
    }

    try {
        const participantUsed = await db.collection("participants").findOne({name: body.name});

        if(participantUsed){
            res.sendStatus(409);
            return;
        }

        await db.collection("participants").insertOne({
            name: body.name,
            lastStatus: Date.now()
        })

        await db.collection("message").insertOne({
            from: body.name, 
            to: 'Todos', 
            text: 'entra na sala...', 
            type: 'status', 
            time: dayjs().format('HH:MM:SS')
        })

        res.send(201);
      } catch (err) {
        res.status(500).send(err);
      }
})

app.listen(5000, ()=>{
    console.log("Server running in port 5000")
});