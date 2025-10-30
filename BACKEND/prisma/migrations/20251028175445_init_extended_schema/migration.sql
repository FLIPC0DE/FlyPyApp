-- CreateEnum
CREATE TYPE "RolTipo" AS ENUM ('ADMINISTRADOR', 'ADMIN_AYUDANTE', 'DOCENTE_EJECUTOR', 'DOCENTE_EDITOR', 'ESTUDIANTE');

-- CreateEnum
CREATE TYPE "TopicoTipo" AS ENUM ('TEXTO_IMAGEN', 'TEXTO_VIDEO', 'TEXTO_SLIDES', 'TEXTO_AUDIO', 'PLAYGROUND', 'VIDEO_PLAYGROUND', 'IMAGE_PLAYGROUND');

-- CreateEnum
CREATE TYPE "CheckpointTipo" AS ENUM ('DIAGNOSTICO', 'EVALUATIVO');

-- CreateTable
CREATE TABLE "Rol" (
    "id_rol" SERIAL NOT NULL,
    "tipo" "RolTipo" NOT NULL,
    "nombre" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rol_pkey" PRIMARY KEY ("id_rol")
);

-- CreateTable
CREATE TABLE "SolicitudRol" (
    "id_solicitud" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "rol_solicitado" "RolTipo" NOT NULL,
    "codigo_ingresado" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "motivo" TEXT,
    "revisadoPorId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SolicitudRol_pkey" PRIMARY KEY ("id_solicitud")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id_usuario" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "rol_global" "RolTipo",
    "id_rol" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "Perfil" (
    "id_usuario" INTEGER NOT NULL,
    "avatar_url" TEXT,
    "institucion" TEXT,
    "carrera" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Perfil_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "CuentaOAuth" (
    "id" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "proveedor" TEXT NOT NULL,
    "sub" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nombre" TEXT,
    "ultima_sesion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CuentaOAuth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Curso" (
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

    CONSTRAINT "Curso_pkey" PRIMARY KEY ("id_curso")
);

-- CreateTable
CREATE TABLE "Inscripcion" (
    "id_inscripcion" SERIAL NOT NULL,
    "id_curso" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "fecha_inscripcion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" TEXT NOT NULL DEFAULT 'active',
    "progress" DOUBLE PRECISION DEFAULT 0.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Inscripcion_pkey" PRIMARY KEY ("id_inscripcion")
);

-- CreateTable
CREATE TABLE "CursoColaborador" (
    "id" SERIAL NOT NULL,
    "id_curso" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "rol" TEXT NOT NULL,
    "invitedById" INTEGER,
    "accepted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CursoColaborador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CursoMedia" (
    "id" SERIAL NOT NULL,
    "id_curso" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "publicId" TEXT,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CursoMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Topico" (
    "id_topico" SERIAL NOT NULL,
    "id_curso" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" VARCHAR(1000),
    "orden" INTEGER NOT NULL DEFAULT 0,
    "tipo" "TopicoTipo" NOT NULL,
    "disponibleDesde" TIMESTAMP(3),
    "disponibleHasta" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Topico_pkey" PRIMARY KEY ("id_topico")
);

-- CreateTable
CREATE TABLE "Contenido" (
    "id_contenido" SERIAL NOT NULL,
    "id_topico" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "titulo" TEXT,
    "cuerpo" TEXT,
    "mediaUrl" TEXT,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contenido_pkey" PRIMARY KEY ("id_contenido")
);

-- CreateTable
CREATE TABLE "PlaygroundSnippet" (
    "id_snippet" SERIAL NOT NULL,
    "id_topico" INTEGER NOT NULL,
    "nombre" TEXT,
    "lenguaje" TEXT NOT NULL DEFAULT 'python',
    "codigo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlaygroundSnippet_pkey" PRIMARY KEY ("id_snippet")
);

-- CreateTable
CREATE TABLE "Checkpoint" (
    "id_checkpoint" SERIAL NOT NULL,
    "id_topico" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "tipo" "CheckpointTipo" NOT NULL,
    "fecha_inicio" TIMESTAMP(3),
    "fecha_fin" TIMESTAMP(3),
    "tiempo_limite" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Checkpoint_pkey" PRIMARY KEY ("id_checkpoint")
);

-- CreateTable
CREATE TABLE "CheckpointPregunta" (
    "id_pregunta" SERIAL NOT NULL,
    "id_checkpoint" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "enunciado" TEXT NOT NULL,
    "meta" JSONB,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "expectedAnswer" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CheckpointPregunta_pkey" PRIMARY KEY ("id_pregunta")
);

-- CreateTable
CREATE TABLE "CheckpointRespuesta" (
    "id_respuesta" SERIAL NOT NULL,
    "id_pregunta" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "respuesta" TEXT NOT NULL,
    "calificacion" DOUBLE PRECISION,
    "feedback" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CheckpointRespuesta_pkey" PRIMARY KEY ("id_respuesta")
);

-- CreateTable
CREATE TABLE "Invitacion" (
    "id_invitacion" SERIAL NOT NULL,
    "id_curso" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "id_creador" INTEGER NOT NULL,
    "id_usuario" INTEGER,
    "rol_solicitado" TEXT,
    "token" TEXT NOT NULL,
    "accepted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "Invitacion_pkey" PRIMARY KEY ("id_invitacion")
);

-- CreateTable
CREATE TABLE "VerificationCode" (
    "id_code" SERIAL NOT NULL,
    "id_usuario" INTEGER,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "consumed" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerificationCode_pkey" PRIMARY KEY ("id_code")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "token_jti" TEXT NOT NULL,
    "user_agent" TEXT,
    "ip_address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalyticsEvent" (
    "id_event" SERIAL NOT NULL,
    "id_usuario" INTEGER,
    "id_curso" INTEGER,
    "id_topico" INTEGER,
    "tipo_evento" TEXT NOT NULL,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnalyticsEvent_pkey" PRIMARY KEY ("id_event")
);

-- CreateTable
CREATE TABLE "KeyEvent" (
    "id" SERIAL NOT NULL,
    "id_usuario" INTEGER,
    "id_topico" INTEGER,
    "evento" TEXT NOT NULL,
    "key" TEXT,
    "interval_ms" INTEGER,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KeyEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Upload" (
    "id" SERIAL NOT NULL,
    "id_usuario" INTEGER,
    "url" TEXT NOT NULL,
    "publicId" TEXT,
    "type" TEXT NOT NULL,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Upload_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppLog" (
    "id" SERIAL NOT NULL,
    "nivel" TEXT NOT NULL,
    "mensaje" TEXT NOT NULL,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AppLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Rol_tipo_key" ON "Rol"("tipo");

-- CreateIndex
CREATE INDEX "SolicitudRol_id_usuario_idx" ON "SolicitudRol"("id_usuario");

-- CreateIndex
CREATE INDEX "SolicitudRol_rol_solicitado_idx" ON "SolicitudRol"("rol_solicitado");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CuentaOAuth_proveedor_email_key" ON "CuentaOAuth"("proveedor", "email");

-- CreateIndex
CREATE UNIQUE INDEX "Curso_slug_key" ON "Curso"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Inscripcion_id_curso_id_usuario_key" ON "Inscripcion"("id_curso", "id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "CursoColaborador_id_curso_id_usuario_key" ON "CursoColaborador"("id_curso", "id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "Invitacion_token_key" ON "Invitacion"("token");

-- CreateIndex
CREATE INDEX "VerificationCode_email_idx" ON "VerificationCode"("email");

-- CreateIndex
CREATE INDEX "VerificationCode_code_idx" ON "VerificationCode"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_jti_key" ON "Session"("token_jti");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_id_usuario_id_topico_idx" ON "AnalyticsEvent"("id_usuario", "id_topico");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_tipo_evento_idx" ON "AnalyticsEvent"("tipo_evento");

-- CreateIndex
CREATE INDEX "KeyEvent_id_usuario_id_topico_idx" ON "KeyEvent"("id_usuario", "id_topico");

-- AddForeignKey
ALTER TABLE "SolicitudRol" ADD CONSTRAINT "SolicitudRol_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolicitudRol" ADD CONSTRAINT "SolicitudRol_revisadoPorId_fkey" FOREIGN KEY ("revisadoPorId") REFERENCES "Usuario"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "Rol"("id_rol") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Perfil" ADD CONSTRAINT "Perfil_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CuentaOAuth" ADD CONSTRAINT "CuentaOAuth_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Curso" ADD CONSTRAINT "Curso_id_creador_fkey" FOREIGN KEY ("id_creador") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscripcion" ADD CONSTRAINT "Inscripcion_id_curso_fkey" FOREIGN KEY ("id_curso") REFERENCES "Curso"("id_curso") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscripcion" ADD CONSTRAINT "Inscripcion_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CursoColaborador" ADD CONSTRAINT "CursoColaborador_id_curso_fkey" FOREIGN KEY ("id_curso") REFERENCES "Curso"("id_curso") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CursoColaborador" ADD CONSTRAINT "CursoColaborador_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CursoColaborador" ADD CONSTRAINT "CursoColaborador_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "Usuario"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CursoMedia" ADD CONSTRAINT "CursoMedia_id_curso_fkey" FOREIGN KEY ("id_curso") REFERENCES "Curso"("id_curso") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Topico" ADD CONSTRAINT "Topico_id_curso_fkey" FOREIGN KEY ("id_curso") REFERENCES "Curso"("id_curso") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contenido" ADD CONSTRAINT "Contenido_id_topico_fkey" FOREIGN KEY ("id_topico") REFERENCES "Topico"("id_topico") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaygroundSnippet" ADD CONSTRAINT "PlaygroundSnippet_id_topico_fkey" FOREIGN KEY ("id_topico") REFERENCES "Topico"("id_topico") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Checkpoint" ADD CONSTRAINT "Checkpoint_id_topico_fkey" FOREIGN KEY ("id_topico") REFERENCES "Topico"("id_topico") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckpointPregunta" ADD CONSTRAINT "CheckpointPregunta_id_checkpoint_fkey" FOREIGN KEY ("id_checkpoint") REFERENCES "Checkpoint"("id_checkpoint") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckpointRespuesta" ADD CONSTRAINT "CheckpointRespuesta_id_pregunta_fkey" FOREIGN KEY ("id_pregunta") REFERENCES "CheckpointPregunta"("id_pregunta") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckpointRespuesta" ADD CONSTRAINT "CheckpointRespuesta_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitacion" ADD CONSTRAINT "Invitacion_id_curso_fkey" FOREIGN KEY ("id_curso") REFERENCES "Curso"("id_curso") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitacion" ADD CONSTRAINT "Invitacion_id_creador_fkey" FOREIGN KEY ("id_creador") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitacion" ADD CONSTRAINT "Invitacion_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationCode" ADD CONSTRAINT "VerificationCode_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalyticsEvent" ADD CONSTRAINT "AnalyticsEvent_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KeyEvent" ADD CONSTRAINT "KeyEvent_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Upload" ADD CONSTRAINT "Upload_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;
