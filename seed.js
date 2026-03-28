const mongoose = require('mongoose');
require('dotenv').config();
const Festivo = require('./api-festivos/models/festivo.js');

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('Conectado a MongoDB');

        await Festivo.deleteMany(); // limpiar datos

        const festivos = [
            // Tipo 1 (fijos)
            { nombre: "Año nuevo", dia: 1, mes: 1, tipo: 1 },
            { nombre: "Día del Trabajo", dia: 1, mes: 5, tipo: 1 },
            { nombre: "Independencia Colombia", dia: 20, mes: 7, tipo: 1 },
            { nombre: "Batalla de Boyacá", dia: 7, mes: 8, tipo: 1 },
            { nombre: "Inmaculada Concepción", dia: 8, mes: 12, tipo: 1 },
            { nombre: "Navidad", dia: 25, mes: 12, tipo: 1 },

            // Tipo 2 (puente festivo)
            { nombre: "Santos Reyes", dia: 6, mes: 1, tipo: 2 },
            { nombre: "San José", dia: 19, mes: 3, tipo: 2 },
            { nombre: "San Pedro y San Pablo", dia: 29, mes: 6, tipo: 2 },
            { nombre: "Asunción de la Virgen", dia: 15, mes: 8, tipo: 2 },
            { nombre: "Día de la Raza", dia: 12, mes: 10, tipo: 2 },
            { nombre: "Todos los santos", dia: 1, mes: 11, tipo: 2 },
            { nombre: "Independencia de Cartagena", dia: 11, mes: 11, tipo: 2 },

            // Tipo 3 (pascua)
            { nombre: "Jueves Santo", tipo: 3, diasPascua: -3 },
            { nombre: "Viernes Santo", tipo: 3, diasPascua: -2 },
            { nombre: "Domingo de Pascua", tipo: 3, diasPascua: 0 },

            // Tipo 4 (pascua + puente)
            { nombre: "Ascensión del Señor", tipo: 4, diasPascua: 40 },
            { nombre: "Corpus Christi", tipo: 4, diasPascua: 61 },
            { nombre: "Sagrado Corazón", tipo: 4, diasPascua: 68 }
        ];

        await Festivo.insertMany(festivos);

        console.log('Festivos insertados 🚀');
        process.exit();
    })
    .catch(err => console.log(err));