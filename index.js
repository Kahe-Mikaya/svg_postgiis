import * as Estados from './controllers/Estados.js';
import * as Municipios from './controllers/Municipios.js'
import express from 'express';
import cors from 'cors';
import pg from 'pg';

const { Client } = pg;
const app = express();
const port = 3000;
app.use(cors({
    origin: '*'
}));

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgis',
    password: 'postgres',
    port: 5432
});

async function conectar() { 
    await client.connect();
}
conectar();

app.get('/mapa/:municipio', async (req, res) => {
    const municipio = req.params.municipio;
    console.log('Requisitando mapa para:', municipio);  // Adicionar log para depuração

    try {
        const svgContent = await Municipios.gerarSVG(municipio,client);
        res.setHeader('Content-Type', 'image/svg+xml');
        res.send(svgContent);
    } catch (err) {
        console.error('Erro ao gerar mapa:', err);
        res.status(500).send('Erro ao gerar o mapa');
    }
});

app.get('/municipios/:estado', async(req,res)=>{
    try{ 
        console.log(req.params);
        const municipios = await Municipios.retornar_municipios(client,req.params.estado);
        res.send(municipios)   

    }catch (err) {
        console.error('Erro ao gerar mapa:', err);
        res.status(500).send('Erro ao gerar o mapa');
    }
})

app.get('/estados', async(req,res)=>{
    try{
        
        const estados = await Estados.retornar_nomesEstados(client);
        res.send(estados)
        

    }catch (err) {
        console.error('Erro ao gerar mapa:', err);
        res.status(500).send('Erro ao gerar o mapa');
    }
})

app.get('/estado/:nome', async function (req, res) {
    const estado = req.params.nome
    try {
        const svgContent = await Estados.gerarSVGEstado(estado,client);
        console.log(svgContent)
        res.setHeader('Content-Type', 'image/svg+xml');
        res.send(svgContent);
    } catch (err) {
        console.error('Erro ao gerar mapa:', err);
        res.status(500).send('Erro ao gerar o mapa');
    }
    
})


app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
