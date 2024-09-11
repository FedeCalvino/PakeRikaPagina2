import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Empanadas from './Router/Empanadas.js';
import cors from 'cors';

dotenv.config(); // Carga las variables de entorno

const app = express();

const port = 3019;


app.use(cors());

const User = "Conecction";
const Pass = "12345";
const Url = `mongodb+srv://${User}:${Pass}@pakerika.wamla.mongodb.net/Empanada?retryWrites=true&w=majority&appName=PakeRika`;

mongoose.connect(Url, {
})
.then(() => {console.log('Database connected successfully')})
.catch(error => console.error('Database connection error:', error));

app.use(express.json()); // Para que Express pueda manejar JSON

app.use('/empanadas', Empanadas); // Usa el enrutador en tu aplicación

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
app.use((req,res,next)=>{
    res.status(404).render("404",{
        titulo:"404",
        descripcion:"error"
    })
})
