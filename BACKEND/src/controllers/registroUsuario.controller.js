import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const registrarUsuario = async (req, res) => {
    try {
      const { nombre, email, password, id_rol } = req.body;
  
      const user = await prisma.usuario.create({
        data: {
          nombre,
          email,
          password,
          id_rol: Number(id_rol) // 👈 aquí lo convertimos
        },
      });
  
      res.json(user);
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      res.status(500).json({ error: "Error al registrar usuario", detalle: error.message });
    }
  };