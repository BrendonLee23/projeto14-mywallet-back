import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";

const app = express();
app.use(cors());
app.use(express.json());

const mongoClient = new MongoClient("mongodb://localhost:27017/projeto-my-wallet");
let db;

mongoClient.connect()
    .then(() => db = mongoClient.db())
    .catch((err) => console.log(err.message));


app.get('/home', (req, res) => {
    res.send('SAlVE');
});

const PORT = 5000;
app.listen(PORT, () => console.log('listening on port ${PORT}'));