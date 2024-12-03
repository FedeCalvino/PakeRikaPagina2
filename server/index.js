import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Articulos from './Router/Articulos.js';
import Validacion from './Router/Validacion.js';
import cors from 'cors';

dotenv.config(); // Carga las variables de entorno

const app = express();

const port = 3079;
const API_KEY = 'AIzaSyBM0sHfeIbIpxU9GIngLxl0x86zNCAXdWk';

app.use(cors());

const User = "Conecction";
const Pass = "12345";
const Url = `mongodb+srv://${User}:${Pass}@pakerika.wamla.mongodb.net/Empanada?retryWrites=true&w=majority&appName=PakeRika`;

app.use(express.json());

async function connectAndListCollections() {
  try {
    await mongoose.connect(Url);
    console.log('Conectada a la base de datos correctamente');
  } catch (error) {
    console.error('Error en la conexión a la base de datos o al obtener colecciones:', error);
  }
}

connectAndListCollections();

const Articulo = mongoose.model('Articulo', new mongoose.Schema({
    Nombre : { type: String },
    Categoria : { type: String },
    Precio : { type: String },
}), 'Articulos');


app.get('/articulosAll', async (req, res) => {
    try {
        const articulos = await Articulo.find(); 
        console.log("Articulos desde el backend:", articulos);  // Agrega este log
        res.json(articulos); 
    } catch (error) {
        console.error('Error al obtener articulos:', error);  // Agrega un log de errores
        res.status(500).json({ message: error.message }); 
    }
});

app.get('/ordenesAll', async (req, res) => {
    try {
        const articulos = await Orden.find(); 
        console.log("serverr")
        res.json(articulos); 
    } catch (error) {
        console.error('Error al obtener articulos:', error);  // Agrega un log de errores
        res.status(500).json({ message: error.message }); 
    }
});

const Orden = mongoose.model('Orden', new mongoose.Schema({
    Dia: { type: Date },
    Pago: { type: String },
    Hora: { type: String },
    Articulos: [{
        Nombre : { type: String },
        Categoria : { type: String },
        Precio : { type: String },
        cantidad: { type : Number }
    }],
    Total: { type: Number }
}), 'Ordenes');

app.post('/SaveOrder', async (req, res) => {
    console.log(req.body)
    try {
        
        const { Dia, Pago, Hora, Articulos, Total } = req.body;

        
        const nuevaOrden = new Orden({
            Dia,
            Pago,
            Hora,
            Articulos,
            Total
        });
        console.log("nuevaOrden",nuevaOrden)
        // Guardar la orden en la base de datos
        const ordenGuardada = await nuevaOrden.save();

        // Enviar respuesta exitosa
        res.status(201).json(ordenGuardada);
    } catch (error) {
        console.error('Error al guardar la orden:', error); // Log de error
        res.status(500).json({ message: 'Error al guardar la orden', error: error.message });
    }
});

app.post('/SaveEmp', async (req, res) => {
    try {
        const { Nombre, Precio, Categoria } = req.body;  // Extraer datos del cuerpo de la solicitud

        // Validar que todos los campos estén presentes
        if (!Nombre || !Precio || !Categoria) {
            return res.status(400).send('Todos los campos son obligatorios');
        }

        // Crear un nuevo artículo usando el modelo
        const nuevoArticulo = new Articulo({
            Nombre,
            Precio,
            Categoria
        });

        // Guardar el nuevo artículo en la base de datos
        const articuloGuardado = await nuevoArticulo.save();

        // Devolver el artículo guardado como respuesta
        res.status(201).json(articuloGuardado); 
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});




app.listen(port, () => {
  console.log(`Servidor funcionando en el puerto ${port}`);
});

// Middleware para manejar rutas no encontradas (404)
app.use((req, res, next) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});
