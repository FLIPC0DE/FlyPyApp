/*
  Warnings:

  - You are about to drop the `Curso` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Usuario` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."AnalyticsEvent" DROP CONSTRAINT "AnalyticsEvent_id_usuario_fkey";

-- DropForeignKey
ALTER TABLE "public"."CheckpointRespuesta" DROP CONSTRAINT "CheckpointRespuesta_id_usuario_fkey";

-- DropForeignKey
ALTER TABLE "public"."CuentaOAuth" DROP CONSTRAINT "CuentaOAuth_id_usuario_fkey";

-- DropForeignKey
ALTER TABLE "public"."Curso" DROP CONSTRAINT "Curso_id_creador_fkey";

-- DropForeignKey
ALTER TABLE "public"."CursoColaborador" DROP CONSTRAINT "CursoColaborador_id_curso_fkey";

-- DropForeignKey
ALTER TABLE "public"."CursoColaborador" DROP CONSTRAINT "CursoColaborador_id_usuario_fkey";

-- DropForeignKey
ALTER TABLE "public"."CursoColaborador" DROP CONSTRAINT "CursoColaborador_invitedById_fkey";

-- DropForeignKey
ALTER TABLE "public"."CursoMedia" DROP CONSTRAINT "CursoMedia_id_curso_fkey";

-- DropForeignKey
ALTER TABLE "public"."Inscripcion" DROP CONSTRAINT "Inscripcion_id_curso_fkey";

-- DropForeignKey
ALTER TABLE "public"."Inscripcion" DROP CONSTRAINT "Inscripcion_id_usuario_fkey";

-- DropForeignKey
ALTER TABLE "public"."Invitacion" DROP CONSTRAINT "Invitacion_id_creador_fkey";

-- DropForeignKey
ALTER TABLE "public"."Invitacion" DROP CONSTRAINT "Invitacion_id_curso_fkey";

-- DropForeignKey
ALTER TABLE "public"."Invitacion" DROP CONSTRAINT "Invitacion_id_usuario_fkey";

-- DropForeignKey
ALTER TABLE "public"."KeyEvent" DROP CONSTRAINT "KeyEvent_id_usuario_fkey";

-- DropForeignKey
ALTER TABLE "public"."Modulo" DROP CONSTRAINT "Modulo_id_curso_fkey";

-- DropForeignKey
ALTER TABLE "public"."Perfil" DROP CONSTRAINT "Perfil_id_usuario_fkey";

-- DropForeignKey
ALTER TABLE "public"."Session" DROP CONSTRAINT "Session_id_usuario_fkey";

-- DropForeignKey
ALTER TABLE "public"."SolicitudRol" DROP CONSTRAINT "SolicitudRol_id_usuario_fkey";

-- DropForeignKey
ALTER TABLE "public"."SolicitudRol" DROP CONSTRAINT "SolicitudRol_revisadoPorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Topico" DROP CONSTRAINT "Topico_id_curso_fkey";

-- DropForeignKey
ALTER TABLE "public"."Upload" DROP CONSTRAINT "Upload_id_usuario_fkey";

-- DropForeignKey
ALTER TABLE "public"."Usuario" DROP CONSTRAINT "Usuario_id_rol_fkey";

-- DropForeignKey
ALTER TABLE "public"."VerificationCode" DROP CONSTRAINT "VerificationCode_id_usuario_fkey";

-- DropTable
DROP TABLE "public"."Curso";

-- DropTable
DROP TABLE "public"."Usuario";

-- CreateTable
CREATE TABLE "usuario" (
    "id_usuario" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "rol_global" "RolTipo",
    "id_rol" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "curso" (
    "id_curso" SERIAL NOT NULL,
    "id_creador" INTEGER NOT NULL,
    "titulo_curso" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "descripcion" VARCHAR(1000),
    "fecha_inicio" TIMESTAMP(3),
    "fecha_fin" TIMESTAMP(3),
    "publicado" BOOLEAN NOT NULL DEFAULT false,
    "estado" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "curso_pkey" PRIMARY KEY ("id_curso")
);

-- CreateTable
CREATE TABLE "comentario" (
    "id_comentario" SERIAL NOT NULL,
    "contenido" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_curso" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,

    CONSTRAINT "comentario_pkey" PRIMARY KEY ("id_comentario")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "curso_slug_key" ON "curso"("slug");

-- AddForeignKey
ALTER TABLE "SolicitudRol" ADD CONSTRAINT "SolicitudRol_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolicitudRol" ADD CONSTRAINT "SolicitudRol_revisadoPorId_fkey" FOREIGN KEY ("revisadoPorId") REFERENCES "usuario"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "Rol"("id_rol") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Perfil" ADD CONSTRAINT "Perfil_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CuentaOAuth" ADD CONSTRAINT "CuentaOAuth_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "curso" ADD CONSTRAINT "curso_id_creador_fkey" FOREIGN KEY ("id_creador") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentario" ADD CONSTRAINT "comentario_id_curso_fkey" FOREIGN KEY ("id_curso") REFERENCES "curso"("id_curso") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentario" ADD CONSTRAINT "comentario_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Modulo" ADD CONSTRAINT "Modulo_id_curso_fkey" FOREIGN KEY ("id_curso") REFERENCES "curso"("id_curso") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscripcion" ADD CONSTRAINT "Inscripcion_id_curso_fkey" FOREIGN KEY ("id_curso") REFERENCES "curso"("id_curso") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscripcion" ADD CONSTRAINT "Inscripcion_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CursoColaborador" ADD CONSTRAINT "CursoColaborador_id_curso_fkey" FOREIGN KEY ("id_curso") REFERENCES "curso"("id_curso") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CursoColaborador" ADD CONSTRAINT "CursoColaborador_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CursoColaborador" ADD CONSTRAINT "CursoColaborador_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "usuario"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CursoMedia" ADD CONSTRAINT "CursoMedia_id_curso_fkey" FOREIGN KEY ("id_curso") REFERENCES "curso"("id_curso") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Topico" ADD CONSTRAINT "Topico_id_curso_fkey" FOREIGN KEY ("id_curso") REFERENCES "curso"("id_curso") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckpointRespuesta" ADD CONSTRAINT "CheckpointRespuesta_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitacion" ADD CONSTRAINT "Invitacion_id_curso_fkey" FOREIGN KEY ("id_curso") REFERENCES "curso"("id_curso") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitacion" ADD CONSTRAINT "Invitacion_id_creador_fkey" FOREIGN KEY ("id_creador") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitacion" ADD CONSTRAINT "Invitacion_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationCode" ADD CONSTRAINT "VerificationCode_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalyticsEvent" ADD CONSTRAINT "AnalyticsEvent_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KeyEvent" ADD CONSTRAINT "KeyEvent_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Upload" ADD CONSTRAINT "Upload_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;
