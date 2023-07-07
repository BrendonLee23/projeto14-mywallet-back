import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();


const mongoClient = new MongoClient(process.env.DATABASE_URL);
let db;

mongoClient.connect()
    .then(() => db = mongoClient.db())
    .catch((err) => console.log(err.message));


app.get('/home', (req, res) => {
    res.send('SAlVE');
});

app.post('/home', (req, res) => {
    res.send('SAlVE');
});

const PORT = 5000;
app.listen(PORT, () => console.log('listening on port ${PORT}'));

