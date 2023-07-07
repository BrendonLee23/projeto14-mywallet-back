import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('SAlVE');
});

const PORT = 5000
app.listen(PORT, () => console.log('listening on port ${PORT}'));