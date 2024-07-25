import express from 'express';
import db from '../db/db.js';

const router = express.Router();

async function buscar(req, res) {
    const consulta = await db`SELECT * FROM usuarios`;

    res.json(consulta);
}

// Lista de conductores (dummy data)
// const drivers = [
//     { id: 1, name: 'Driver One', vehicle: 'Moto A' },
//     { id: 2, name: 'Driver Two', vehicle: 'Moto B' }
// ];

// // Obtener todos los conductores
router.get('/', buscar);

// // Obtener un conductor por ID
// router.get('/:id', (req, res) => {
//     const driver = drivers.find(d => d.id === parseInt(req.params.id));
//     if (!driver) return res.status(404).send('Conductor no encontrado');
//     res.json(driver);
// });

export default router;
