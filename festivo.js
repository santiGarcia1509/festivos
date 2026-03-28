const mongoose = require('mongoose');

const FestivoSchema = new mongoose.Schema({
    nombre: String,
    dia: Number,
    mes: Number,
    tipo: Number, // 1, 2, 3 o 4
    diasPascua: Number // puede ser null
});

module.exports = mongoose.model('Festivo', FestivoSchema);