/*
  Warnings:

  - Added the required column `descripcion` to the `Curso` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titulo_curso` to the `Curso` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Curso" ADD COLUMN     "descripcion" VARCHAR(255) NOT NULL,
ADD COLUMN     "titulo_curso" TEXT NOT NULL;
