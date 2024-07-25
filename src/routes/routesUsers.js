import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db/db.js';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

router.post('/register', async (req, res) => {
  let { usuNombre, usuEmail, usuPassword, usuTelefono, usuRol } = req.body;

  console.log(req.body);

  if (!usuNombre || !usuEmail || !usuPassword) {
    return res.status(400).send({
      status_code: 400,
      message: 'Todos los campos son requeridos',
    });
  }

  try {
    const [userExists] =
      await db`SELECT COUNT(1) FROM usuarios WHERE usu_email = ${usuEmail}`;
    if (userExists.count > 0) {
      return res.status(400).send({
        status_code: 400,
        message: 'El usuario ya existe',
      });
    }

    const hashedPassword = await bcrypt.hash(usuPassword, 10);

    const newUser = await db`
      INSERT INTO usuarios
        (usu_nombre, usu_email, usu_password, usu_telefono, usu_rol)
      VALUES
        (${usuNombre}, ${usuEmail}, ${hashedPassword}, ${usuTelefono}, ${usuRol || 1})`;

    res.status(201).json({
      status_code: 201,
      message: 'Usuario creado',
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Inicio de sesión de usuario
router.post('/login', async (req, res) => {
  let { usuEmail, usuPassword } = req.body;

  if (!usuEmail || !usuPassword) {
    return res.status(400).json({
      status_code: 400,
      message: 'Todos los campos son requeridos',
    });
  }

  try {
    const [user] = await db`
      SELECT
        usu_password, 
        usu_nombre, 
        usu_email
      FROM
        usuarios
      WHERE
        usu_email = ${usuEmail}`;
    if (!user?.usu_email) {
      return res.status(400).json({
        status_code: 400,
        message: 'Usuario o contraseña incorrectos',
      });
    }

    const validPassword = await bcrypt.compare(usuPassword, user.usu_password);
    if (!validPassword) {
      return res.status(400).json({
        status_code: 400,
        message: 'Contraseña incorrecta',
      });
    }

    const token = jwt.sign(
      { id: user.usuCodigo, name: user.usuNombre, email: user.usuEmail },
      JWT_SECRET,
      { expiresIn: '168h' }
    );

    res.status(200).json({
      status_code: 200,
      message: 'Inicio de sesión exitoso',
      token,
    });
  } catch (error) {
    throw new Error(error);
  }
});

export default router;
