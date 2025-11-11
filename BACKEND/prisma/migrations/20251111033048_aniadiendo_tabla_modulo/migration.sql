-- AlterTable
ALTER TABLE "Topico" ADD COLUMN     "id_modulo" INTEGER;

-- CreateTable
CREATE TABLE "Modulo" (
    "id_modulo" SERIAL NOT NULL,
    "id_curso" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Modulo_pkey" PRIMARY KEY ("id_modulo")
);

-- AddForeignKey
ALTER TABLE "Modulo" ADD CONSTRAINT "Modulo_id_curso_fkey" FOREIGN KEY ("id_curso") REFERENCES "Curso"("id_curso") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Topico" ADD CONSTRAINT "Topico_id_modulo_fkey" FOREIGN KEY ("id_modulo") REFERENCES "Modulo"("id_modulo") ON DELETE SET NULL ON UPDATE CASCADE;
