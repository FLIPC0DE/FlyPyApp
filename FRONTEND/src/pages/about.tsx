import DefaultLayout from "@/layouts/default";
import { subtitle, title } from "@/components/primitives";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { TeamMember } from "@/components/team-member";
import {
    CloudinaryIcon,
    MonacoIcon,
    NodeIcon,
    PostgreSQLIcon,
    PrismaIcon,
    PyodideIcon,
    ReactIcon,
    TailwindIcon,
} from "@/assets/icons";

export default function AboutPage() {
    return (
        <DefaultLayout>
            {/* Hero Section */}
            <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
                <div className="inline-block max-w-2xl text-center">
                    <h1 className={title({ size: "lg" })}>
                        Sobre&nbsp;
                        <span
                            className={title({ color: "primary", size: "lg" })}
                        >
                            PyFly
                        </span>
                    </h1>
                    <p className={subtitle({ class: "mt-4" })}>
                        Una plataforma educativa innovadora diseñada para
                        revolucionar la enseñanza y el aprendizaje de Python en
                        entornos universitarios.
                    </p>
                </div>
            </section>

            {/* Misión y Visión */}
            <section className="py-8 md:py-10">
                <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                    <Card>
                        <CardBody className="gap-3 p-8">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-4xl">🎯</span>
                                <h2 className="text-2xl font-bold">
                                    Nuestra Misión
                                </h2>
                            </div>
                            <p className="text-default-600 text-lg">
                                Proporcionar una experiencia de aprendizaje
                                interactiva y efectiva que permita a estudiantes
                                universitarios dominar Python a través de
                                práctica constante, feedback inmediato y
                                análisis de progreso personalizado.
                            </p>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardBody className="gap-3 p-8">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-4xl">🚀</span>
                                <h2 className="text-2xl font-bold">
                                    Nuestra Visión
                                </h2>
                            </div>
                            <p className="text-default-600 text-lg">
                                Ser la plataforma líder en educación Python
                                universitaria, empoderando a docentes con
                                herramientas avanzadas de análisis y a
                                estudiantes con experiencias de aprendizaje
                                gamificadas y efectivas.
                            </p>
                        </CardBody>
                    </Card>
                </div>
            </section>

            {/* Características Clave */}
            <section className="py-8 md:py-10">
                <div className="text-center mb-8">
                    <h2 className={title({ size: "md" })}>
                        ¿Qué hace especial a&nbsp;
                        <span
                            className={title({ color: "primary", size: "md" })}
                        >
                            PyFly
                        </span>?
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {features.map((feature, index) => (
                        <Card
                            key={index}
                            className="border-2 border-transparent hover:border-primary transition-colors"
                        >
                            <CardBody className="gap-3 p-6">
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl">
                                        {feature.icon}
                                    </span>
                                    <h3 className="text-xl font-semibold">
                                        {feature.title}
                                    </h3>
                                </div>
                                <p className="text-default-600">
                                    {feature.description}
                                </p>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Tecnología */}
            <section className="py-8 md:py-10">
                <div className="text-center mb-10">
                    <h2 className={title({ size: "md" })}>Stack Tecnológico</h2>
                    <p className="text-default-600 mt-3 text-lg">
                        Construido con las mejores herramientas modernas
                    </p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
                    {technologies.map((tech, index) => {
                        const Icon = tech.icon;
                        return (
                            <Card
                                key={index}
                                className="group bg-content1 border border-divider hover:border-primary/50 hover:shadow-lg transition-all duration-300"
                            >
                                <CardBody className="p-5">
                                    <div className="flex items-center gap-4">
                                        {/* Icono con fondo adaptativo muy sutil */}
                                        <div className="w-14 h-14 flex-shrink-0 rounded-xl flex items-center justify-center p-2.5 bg-gradient-to-br from-content2/50 to-content3/30 group-hover:from-content2/70 group-hover:to-content3/50 group-hover:scale-110 transition-all duration-300">
                                            <Icon className="w-full h-full" />
                                        </div>

                                        {/* Texto */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors truncate">
                                                {tech.name}
                                            </h3>
                                            <p className="text-xs text-default-500 mt-0.5">
                                                {tech.purpose}
                                            </p>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        );
                    })}
                </div>
            </section>

            {/* Equipo */}
            <section className="py-8 md:py-10">
                <div className="text-center mb-8">
                    <h2 className={title({ size: "md" })}>Nuestro Equipo</h2>
                    <p className="text-default-600 mt-2">
                        4 desarrolladores comprometidos con la excelencia
                        educativa
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    {team.map((member, index) => (
                        <TeamMember
                            key={index}
                            github={member.github}
                            role={member.role}
                        />
                    ))}
                </div>
            </section>

            {/* Proyecto */}
            <section className="py-8 md:py-10">
                <Card className="bg-gradient-to-br from-success/10 to-primary/10 border-none">
                    <CardBody className="p-8 md:p-12 text-center gap-4">
                        <h2 className={title({ size: "md" })}>
                            Sobre el Proyecto
                        </h2>
                        <div className="max-w-3xl mx-auto space-y-4 text-default-600">
                            <p className="text-lg">
                                <strong>PyFly</strong>{" "}
                                es un proyecto universitario desarrollado con
                                metodología Scrum durante 12 semanas (89 días).
                            </p>
                            <div className="grid md:grid-cols-3 gap-4 mt-6">
                                <div>
                                    <p className="text-3xl font-bold text-primary">
                                        12
                                    </p>
                                    <p className="text-sm">
                                        Semanas de desarrollo
                                    </p>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-success">
                                        8
                                    </p>
                                    <p className="text-sm">
                                        Épicas implementadas
                                    </p>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-warning">
                                        84
                                    </p>
                                    <p className="text-sm">
                                        User Stories completadas
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </section>

            {/* CTA */}
            <section className="py-8 md:py-10">
                <div className="text-center">
                    <h2 className={title({ size: "md", class: "mb-4" })}>
                        ¿Listo para comenzar?
                    </h2>
                    <p className="text-default-600 mb-6">
                        Únete a PyFly y transforma tu experiencia de aprendizaje
                    </p>
                    <div className="flex gap-3 justify-center">
                        <Button
                            as={Link}
                            color="primary"
                            size="lg"
                            variant="shadow"
                            href="/register"
                        >
                            Crear Cuenta Gratis
                        </Button>
                        <Button
                            as={Link}
                            variant="bordered"
                            size="lg"
                            href="/courses"
                        >
                            Ver Cursos
                        </Button>
                    </div>
                </div>
            </section>
        </DefaultLayout>
    );
}

// Datos del contenido
const features = [
    {
        icon: "🎮",
        title: "Playground Interactivo",
        description:
            "Ejecuta Python en el navegador con Pyodide, sin instalación necesaria.",
    },
    {
        icon: "📊",
        title: "Sistema de Checkpoints",
        description:
            "Evaluaciones diagnósticas y calificadas con feedback visual inmediato.",
    },
    {
        icon: "📈",
        title: "Analytics Avanzado",
        description:
            "Métricas detalladas de progreso, tiempo y patrones de aprendizaje.",
    },
    {
        icon: "🎯",
        title: "Contenido Multimedia",
        description:
            "Combina texto, video, audio, slides y código en tus lecciones.",
    },
    {
        icon: "🗺️",
        title: "Mapa de Progreso",
        description:
            "Visualización tipo Duolingo para seguir tu avance en el curso.",
    },
    {
        icon: "👥",
        title: "Colaboración Docente",
        description:
            "Sistema de roles para administradores y editores de cursos.",
    },
];

const technologies = [
    { name: "React", purpose: "Frontend UI", icon: ReactIcon },
    { name: "Tailwind CSS", purpose: "Estilos", icon: TailwindIcon },
    { name: "Pyodide", purpose: "Python en navegador", icon: PyodideIcon },
    { name: "Monaco Editor", purpose: "Editor de código", icon: MonacoIcon },
    { name: "Node.js", purpose: "Backend API", icon: NodeIcon },
    { name: "PostgreSQL", purpose: "Base de datos", icon: PostgreSQLIcon },
    { name: "Prisma", purpose: "ORM", icon: PrismaIcon },
    { name: "Cloudinary", purpose: "Multimedia", icon: CloudinaryIcon },
];

const team = [
    { github: "TOMOKI977", role: "Full Stack Developer" },
    { github: "wwwsamuelwww", role: "Frontend Developer" },
    { github: "Madeline1602", role: "Backend Developer" },
    { github: "JonatanZambrana", role: "DevOps Engineer" },
];
