import express from 'express';
import fetch from 'node-fetch';


const router = express.Router(); // Crea una instancia de Router

const API_KEY = 'AIzaSyBM0sHfeIbIpxU9GIngLxl0x86zNCAXdWk'; 
// Ruta GET para obtener todas las direcc
router.get('/Direcc', async (req, res) => {
    const input = req.query.input;
    console.log(input)
    try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&types=address&key=${API_KEY}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la dirección' });
    }
});
export default router; 