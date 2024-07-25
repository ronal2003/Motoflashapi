import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

const users = []; // Simulando una base de datos en memoria

// Secret para JWT
const JWT_SECRET = 'secret_key_for_jwt'; // Cambia esto por una clave más segura y almacénala en variables de entorno

// Registro de usuario
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    // Validar que los campos no estén vacíos
    if (!name || !email || !password) {
        return res.status(400).send('Todos los campos son requeridos');
    }

    // Verificar si el usuario ya existe
    const userExists = users.find(u => u.email === email);
    if (userExists) {
        return res.status(400).send('El usuario ya existe');
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el nuevo usuario
    const newUser = {
        id: users.length + 1,
        name,
        email,
        password: hashedPassword
    };

    // Guardar el usuario
    users.push(newUser);

    res.status(201).send('Usuario registrado con éxito');
});

// Inicio de sesión de usuario
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Validar que los campos no estén vacíos
    if (!email || !password) {
        return res.status(400).send('Todos los campos son requeridos');
    }

    // Buscar el usuario
    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(400).send('Usuario no encontrado');
    }

    // Verificar la contraseña
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.status(400).send('Contraseña incorrecta');
    }

    // Crear y asignar un token
    const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Inicio de sesión exitoso', token });
});

// export default router;
