# Arquitectura de Autenticación y Roles - FlyPy

## 📋 Resumen

Se ha implementado una arquitectura limpia y profesional para manejo de autenticación y roles, respetando completamente la estructura existente.

## 🏗️ Estructura Implementada

### 1. **Services Layer** (`/src/services/`)
Separación de Concerns: Toda la lógica de API está centralizada en servicios.

- `auth.service.ts` - Operaciones de autenticación (login, register, logout)
- `usuario.service.ts` - Operaciones de usuario (perfil, roles, dashboard)

**Uso:**
```typescript
import { UsuarioService } from "@/services/usuario.service";
const data = await UsuarioService.actualizarRol("ESTUDIANTE");
```

### 2. **Context Layer** (`/src/context/`)
Estado global de autenticación mejorado.

- `AutenticacionContexto.tsx` - Mejorado con:
  - Validación de expiración de token
  - Helpers: `tieneRol()`, `tieneAlgunRol()`
  - Estado de loading

**Uso:**
```typescript
import { useAuth } from "@/hooks/useAuth";
const { user, tieneRol, tieneAlgunRol } = useAuth();
if (tieneRol("ADMINISTRADOR")) { ... }
```

### 3. **Middleware Layer** (`/src/layouts/rutaProtegida.tsx`)
Protección de rutas mejorada.

- Validación de token y expiración
- Validación de roles
- Redirección suave al login si token inválido
- Nueva prop: `usarDashboardLayout` para páginas con sidebar

**Uso:**
```typescript
<RutaProtegida 
  rolesPermitidos={["ESTUDIANTE", "DOCENTE_EJECUTOR"]}
  usarDashboardLayout={true}
>
  <MyCoursesPage />
</RutaProtegida>
```

### 4. **Layout Dinámico** (`/src/layouts/DashboardLayout.tsx`)
Layout que se adapta según el rol del usuario.

- Muestra sidebar automáticamente para roles específicos
- Envuelve vistas existentes sin modificarlas
- Mantiene la UI/UX actual

### 5. **Configuración Centralizada** (`/src/config/roles.config.ts`)
Configuración centralizada de roles y permisos.

- `ROLES` - Constantes de roles
- `PERMISOS_POR_ROL` - Permisos por rol
- `RUTAS_POR_ROL` - Roles permitidos por ruta
- Helpers: `tienePermiso()`, `obtenerRolesPermitidos()`

**Uso:**
```typescript
import { obtenerRolesPermitidos } from "@/config/roles.config";
rolesPermitidos={obtenerRolesPermitidos("/my-courses")}
```

## 🔄 Cambios Realizados

### ✅ Mejoras sin romper código existente:

1. **Services creados** - Lógica de API separada
2. **Context mejorado** - Validación de token y helpers
3. **Middleware mejorado** - Validación robusta y redirección suave
4. **Layout dinámico** - DashboardLayout para páginas con sidebar
5. **Config centralizada** - Roles y permisos en un solo lugar
6. **Hook personalizado** - `useAuth()` para facilitar uso

### 📝 Archivos Modificados (sin romper funcionalidad):

- `AutenticacionContexto.tsx` - Mejorado con validación
- `rutaProtegida.tsx` - Mejorado con validación de expiración
- `App.tsx` - Usa configuración centralizada de roles
- `my-courses.tsx` - Ajustado para usar DashboardLayout
- `seleccionarRol.tsx` - Usa servicio en lugar de fetch directo

### 🆕 Archivos Nuevos:

- `services/auth.service.ts`
- `services/usuario.service.ts`
- `layouts/DashboardLayout.tsx`
- `config/roles.config.ts`
- `hooks/useAuth.ts`

## 🎯 Cómo Usar

### Para proteger una ruta:
```typescript
<Route
  path="/mi-ruta"
  element={
    <RutaProtegida 
      rolesPermitidos={["ESTUDIANTE", "DOCENTE_EJECUTOR"]}
      usarDashboardLayout={true} // Opcional: para sidebar
    >
      <MiComponente />
    </RutaProtegida>
  }
/>
```

### Para verificar roles en componentes:
```typescript
import { useAuth } from "@/hooks/useAuth";
import { tienePermiso } from "@/config/roles.config";

const { user, tieneRol } = useAuth();

if (tieneRol("ADMINISTRADOR")) {
  // Mostrar opciones de admin
}

if (tienePermiso(user?.rol_global, "puedeCrearCurso")) {
  // Mostrar botón crear curso
}
```

### Para hacer llamadas API:
```typescript
import { UsuarioService } from "@/services/usuario.service";

try {
  const perfil = await UsuarioService.obtenerPerfil();
  const dashboard = await UsuarioService.obtenerDashboard();
} catch (error) {
  // Manejo de errores (token inválido, etc.)
}
```

## 🔒 Seguridad

- ✅ Validación de expiración de token
- ✅ Redirección automática al login si token inválido
- ✅ Validación de roles antes de renderizar
- ✅ Manejo de errores 401 (token inválido)

## 📌 Notas Importantes

1. **No se eliminó ningún componente existente** - Todo se mantiene funcionando
2. **UI/UX idéntica** - La interfaz se mantiene igual
3. **Backward compatible** - El código antiguo sigue funcionando
4. **Extensible** - Fácil agregar nuevos roles o permisos

