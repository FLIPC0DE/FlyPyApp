import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const registrarCurso = async (req, res) => {
  try {
    const { idUsuario, fechaInicio, fechaFin, descripcion, tituloCurso  } = req.body;
    console.log(idUsuario, fechaInicio, fechaFin, descripcion, tituloCurso  );

    // Crear el curso
    const nuevoCurso = await prisma.curso.create({
      data: {
        id_usuario: parseInt(idUsuario),
        fecha_inicio: new Date(fechaInicio), // "YYYY-MM-DD"
        fecha_fin: new Date(fechaFin),
        descripcion: descripcion,
        titulo_curso: tituloCurso,
      },
      include: {
        usuario: true, // opcional: para traer los datos del usuario
      },
    });

    res.status(201).json({
      message: 'Curso registrado exitosamente',
      curso: nuevoCurso,
    });
  } catch (error) {
    console.error('Error al registrar curso:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
