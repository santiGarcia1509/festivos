const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const Festivo = require('./models/Festivo');

const app = express();

app.use(express.json());

/* 🔥 FUNCIÓN PARA CALCULAR PASCUA */
function calcularPascua(anio) {
    const a = anio % 19;
    const b = anio % 4;
    const c = anio % 7;
    const d = (19 * a + 24) % 30;

    const dias = d + ((2 * b + 4 * c + 6 * d + 5) % 7);

    const fecha = new Date(anio, 2, 15); // marzo
    fecha.setDate(fecha.getDate() + dias + 7);

    return fecha;
}

/* 🔥 CONEXIÓN A MONGODB */
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB conectado 🔥'))
    .catch(err => console.log(err));

/* 🔹 RUTA BASE */
app.get('/', (req, res) => {
    res.send('API Festivos funcionando 🚀');
});

/* 🔹 VALIDAR FESTIVO */
app.get('/:anio/:mes/:dia', async (req, res) => {
    const { anio, mes, dia } = req.params;

    // ❗ VALIDAR FECHA INVÁLIDA
    const fechaInput = new Date(anio, mes - 1, dia);

    if (
        fechaInput.getFullYear() != anio ||
        fechaInput.getMonth() != mes - 1 ||
        fechaInput.getDate() != dia
    ) {
        return res.status(400).json({
            error: "Fecha inválida"
        });
    }

    const festivos = await Festivo.find();
    const pascua = calcularPascua(parseInt(anio));

    for (let festivo of festivos) {
        let fechaFestivo;

        // Tipo 1: fijo
        if (festivo.tipo === 1) {
            fechaFestivo = new Date(anio, festivo.mes - 1, festivo.dia);
        }

        // Tipo 2: mover al lunes
        if (festivo.tipo === 2) {
            fechaFestivo = new Date(anio, festivo.mes - 1, festivo.dia);
            while (fechaFestivo.getDay() !== 1) {
                fechaFestivo.setDate(fechaFestivo.getDate() + 1);
            }
        }

        // Tipo 3: basado en pascua
        if (festivo.tipo === 3) {
            fechaFestivo = new Date(pascua);
            fechaFestivo.setDate(fechaFestivo.getDate() + festivo.diasPascua);
        }

        // Tipo 4: pascua + mover al lunes
        if (festivo.tipo === 4) {
            fechaFestivo = new Date(pascua);
            fechaFestivo.setDate(fechaFestivo.getDate() + festivo.diasPascua);

            while (fechaFestivo.getDay() !== 1) {
                fechaFestivo.setDate(fechaFestivo.getDate() + 1);
            }
        }

        // 🔥 COMPARACIÓN
        if (
            fechaFestivo.getFullYear() === fechaInput.getFullYear() &&
            fechaFestivo.getMonth() === fechaInput.getMonth() &&
            fechaFestivo.getDate() === fechaInput.getDate()
        ) {
            return res.json({
                fecha: `${dia}-${mes}-${anio}`,
                esFestivo: true,
                nombre: festivo.nombre
            });
        }
    }

    // 🔚 SI NO ES FESTIVO
    return res.json({
        fecha: `${dia}-${mes}-${anio}`,
        esFestivo: false
    });
});

/* 🔹 SERVIDOR */
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});