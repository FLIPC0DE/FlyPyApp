import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';


const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

export const registrarUsuario = async (req, res) => {
    try {
      const { nombre, email, password, id_rol } = req.body;

      if (!password) {
          return res.status(400).json({ error: "La contraseña es requerida." });
      }

      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  
      const user = await prisma.usuario.create({
        data: {
          nombre,
          email,
          password: hashedPassword,
          id_rol: Number(id_rol)
        },
      });

      res.status(201).json({ 
          message: "Usuario registrado exitosamente", 
          userId: user.id,
          email: user.email
      });
  
      // res.json(user);

    } catch (error) {

      if (error.code === 'P2002') {
          return res.status(409).json({ error: "El email ya está registrado." });
      }

      console.error("Error al registrar usuario:", error);
      res.status(500).json({ error: "Error al registrar usuario", detalle: error.message });
      
    }
  };