import { tv } from "tailwind-variants";

export const title = tv({
  base: "tracking-tight inline font-semibold",
  variants: {
    color: {
      primary: "from-[#0B8F6B] to-[#21A179]", // Verde PyFly
      secondary: "from-[#054036] to-[#0B8F6B]", // Verde oscuro
      success: "from-[#16A34A] to-[#22C55E]", // Verde éxito
      warning: "from-[#F59E0B] to-[#FBBF24]", // Amarillo/Naranja
      danger: "from-[#DC2626] to-[#E02424]", // Rojo
      accent: "from-[#FFB020] to-[#F59E0B]", // Naranja accent
      foreground: "from-foreground to-foreground/70",
    },
    size: {
      sm: "text-2xl lg:text-3xl",
      md: "text-3xl lg:text-4xl",
      lg: "text-4xl lg:text-5xl",
      xl: "text-5xl lg:text-6xl",
    },
    fullWidth: {
      true: "w-full block",
    },
  },
  defaultVariants: {
    size: "md",
  },
  compoundVariants: [
    {
      color: [
        "primary",
        "secondary",
        "success",
        "warning",
        "danger",
        "accent",
        "foreground",
      ],
      class: "bg-clip-text text-transparent bg-gradient-to-br",
    },
  ],
});

export const subtitle = tv({
  base: "w-full md:w-1/2 my-2 text-lg lg:text-xl text-default-600 block max-w-full",
  variants: {
    fullWidth: {
      true: "!w-full",
    },
  },
  defaultVariants: {
    fullWidth: true,
  },
});

// Nuevo: Estilos para bloques de código
export const codeBlock = tv({
  base: "font-mono rounded-lg p-4 overflow-x-auto",
  variants: {
    variant: {
      default: "bg-content2 text-foreground",
      bordered: "bg-content1 border-2 border-divider",
      flat: "bg-content2/50",
    },
    size: {
      sm: "text-xs p-2",
      md: "text-sm p-4",
      lg: "text-base p-6",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

// Nuevo: Estilos para cards de contenido
export const contentCard = tv({
  base: "rounded-xl shadow-small",
  variants: {
    variant: {
      default: "bg-content1",
      bordered: "bg-content1 border-2 border-divider",
      shadow: "bg-content1 shadow-medium",
    },
    padding: {
      none: "p-0",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    },
  },
  defaultVariants: {
    variant: "default",
    padding: "md",
  },
});