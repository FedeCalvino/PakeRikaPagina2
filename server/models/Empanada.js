import mongoose from 'mongoose';

// Corrección del nombre del constructor Schema
const Schema = mongoose.Schema;

const EmpanadaSchema = new Schema({
    nombre: { type: String, required: true },
    numero: { type: Number, required: true },  // Usar Number en lugar de Int32
    ingredientes: { type: String, required: true }
});

const Empanada = mongoose.model('Empanada', EmpanadaSchema);

export default Empanada;