import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/react";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { FlyPyIcon, GithubIcon } from "@/assets/icons";
import { ThemeSwitch } from "@/context/theme-switch";
import { siteConfig } from "@/config/site";
import { AutenticacionContexto } from "@/context/AutenticacionContexto";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { link as linkStyles } from "@heroui/theme";

export const Navbar = () => {
  const { user, logout } = useContext(AutenticacionContexto)!;
  const navigate = useNavigate();

  return (
    <HeroUINavbar maxWidth="xl" position="sticky" isBordered>
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <Link
            className="flex justify-start items-center gap-2"
            color="foreground"
            href="/"
          >
            <FlyPyIcon className="text-3xl" />
            <p className="font-bold text-xl text-inherit bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
              PyFly
            </p>
          </Link>
        </NavbarBrand>
        <div className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <Link
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium",
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </Link>
            </NavbarItem>
          ))}
        </div>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <Link
            isExternal
            href="https://github.com/FLIPC0DE/FlyPyApp"
            title="GitHub"
            aria-label="GitHub"
          >
            <GithubIcon className="text-default-500" />
          </Link>
          <ThemeSwitch />
        </NavbarItem>

        {user
          ? (
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform"
                  color="primary"
                  name={user?.nombre ?? "Usuario"}
                  size="sm"
                  src={user?.avatar_url ?? ""}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Opciones de usuario" variant="flat">
                <DropdownItem key="profile" href="/profile">
                  Mi perfil
                </DropdownItem>
                <DropdownItem key="dashboard" href="/dashboard">
                  Dashboard
                </DropdownItem>
                <DropdownItem key="my-courses" href="/my-courses">
                  Mis cursos
                </DropdownItem>
                <DropdownItem key="progress" href="/progress">
                  Progreso
                </DropdownItem>
                <DropdownItem key="checkpoints" href="/checkpoints">
                  Checkpoints
                </DropdownItem>
                {["DOCENTE_EJECUTOR", "ADMINISTRADOR"].includes(
                    user.rol_global ?? "",
                  )
                  ? (
                    <DropdownItem key="analytics" href="/analytics">
                      Analytics
                    </DropdownItem>
                  )
                  : null}
                <DropdownItem key="settings" href="/settings">
                  Configuración
                </DropdownItem>
                <DropdownItem key="help" href="/help">
                  Ayuda
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  color="danger"
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                >
                  Cerrar sesión
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )
          : (
            <NavbarItem className="hidden md:flex gap-2">
              <Button as={Link} color="primary" href="/login" variant="flat">
                Iniciar Sesión
              </Button>
              <Button
                as={Link}
                color="primary"
                href="/register"
                variant="shadow"
              >
                Registrarse
              </Button>
            </NavbarItem>
          )}
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <Link isExternal href={siteConfig.links.github} aria-label="GitHub">
          <GithubIcon className="text-default-500" />
        </Link>
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={index === siteConfig.navMenuItems.length - 1
                  ? "danger"
                  : "foreground"}
                href={item.href}
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
