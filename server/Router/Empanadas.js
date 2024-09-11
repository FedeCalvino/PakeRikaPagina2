import express from 'express';
import Empanada from '../models/Empanada.js'; // Importa el modelo Empanada

const router = express.Router(); // Crea una instancia de Router


// Ruta GET para obtener todas las empanadas
router.get('/', async (req, res) => {
    try {
        const arrayEmpanadasDb = await Empanada.find();
        console.log(arrayEmpanadasDb);
        res.json(arrayEmpanadasDb); 
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});


// Ruta POST para agregar una nueva empanada
router.post('/', async (req, res) => {
    try {
        const { nombre, numero, ingredientes } = req.body;  // Extraer datos del cuerpo de la solicitud

        // Validar que todos los campos estén presentes
        if (!nombre || !numero || !ingredientes) {
            return res.status(400).send('Todos los campos son obligatorios');
        }

        // Crear una nueva empanada usando el modelo
        const nuevaEmpanada = new Empanada({
            nombre,
            numero,
            ingredientes
        });
        console.log(nuevaEmpanada)
        // Guardar la nueva empanada en la base de datos
        const empanadaGuardada = await nuevaEmpanada.save();

        // Devolver la empanada guardada como respuesta
        res.status(201).json(empanadaGuardada); 
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;  
        const { nombre, numero, ingredientes } = req.body;

        // Validar que todos los campos estén presentes
        if (!nombre || !numero || !ingredientes) {
            return res.status(400).send('Todos los campos son obligatorios');
        }

        // Buscar y actualizar la empanada
        const empanadaActualizada = await Empanada.findByIdAndUpdate(
            id,  // El ID del documento que queremos actualizar
            { nombre, numero, ingredientes },  // Los nuevos datos
            { new: true }  // Esta opción devuelve el documento actualizado
        );

        // Si no se encuentra la empanada
        if (!empanadaActualizada) {
            return res.status(404).send('Empanada no encontrada');
        }

        // Responder con la empanada actualizada
        res.status(200).json(empanadaActualizada);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error del servidor');
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;  // Obtener el ID del documento de los parámetros de la URL

        // Buscar y eliminar la empanada
        const empanadaEliminada = await Empanada.findByIdAndDelete(id);

        // Si no se encuentra la empanada
        if (!empanadaEliminada) {
            return res.status(404).send('Empanada no encontrada');
        }

        // Responder con un mensaje de éxito
        res.status(200).send('Empanada eliminada con éxito');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error del servidor');
    }
});


export default router; // Exporta el enrutador
