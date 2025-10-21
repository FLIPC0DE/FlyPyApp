import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const iniciarSesion = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.usuario.findUnique({ where: { email } });
    //console.log(user.email,user.password);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    //console.log(user.email);
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(401).json({ message: "Contraseña incorrecta"});
    
    const token = jwt.sign(
      { id: user.id_usuario, nombre:user.nombre, email: user.email, id_rol: user.id_rol },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login exitoso", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
