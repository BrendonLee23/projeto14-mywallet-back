import express from "express";
import cors from "cors";
import router from "./src/routes/index.routes.js";

// criação do App

const app = express();

// Configurações

app.use(cors());
app.use(express.json());
app.use(router)


// Liga informações do servidor para escutar requisições

const port = process.env.PORT || 5000
app.listen(port, () => {
	console.log(`Servidor rodando na porta ${port}`)
})
