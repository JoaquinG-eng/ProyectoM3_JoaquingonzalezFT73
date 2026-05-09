# Documentación de uso de IA — ChatVerse AI

## Herramienta utilizada

Durante el desarrollo del proyecto se utilizó **Claude (Anthropic)** como herramienta de asistencia. Su uso se concentró principalmente en la etapa de debugging y en la validación de decisiones técnicas puntuales.

---

## Proceso de desarrollo

El proyecto fue construido de forma incremental, armando primero la estructura base y luego agregando funcionalidades por capas. A lo largo del proceso surgieron varios errores técnicos que se fueron resolviendo a medida que aparecían.

---

## Errores encontrados durante el desarrollo

### Error 1 — Stack trace de Vite al iniciar

![Error de Vite con styles.css](ASSETS\imagen1.png)

Al levantar el proyecto por primera vez con Vite apareció un stack trace extenso relacionado con la transformación de módulos. El error apuntaba a un problema en la cadena de plugins de Vite al intentar procesar los archivos CSS.

La causa era que el `index.html` referenciaba el CSS con una ruta relativa (`./src/styles/main.css`) que Vite no podía resolver correctamente desde la raíz del servidor. El error se propagaba por toda la cadena de transformación generando un stack trace largo que dificultaba identificar el origen real.

---

### Error 2 — HTML con rutas incorrectas y hash routing

![HTML con rutas ./src y links con #](ASSETS\imagen2.png)

La versión inicial del `index.html` tenía dos problemas visibles:

El primero era que los links del CSS usaban rutas relativas con punto (`./src/styles/main.css`) que funcionaban con Live Server pero no con Vite, ya que cada herramienta resuelve las rutas de forma diferente.

El segundo era que la navegación usaba hash routing (`#/home`, `#/chat`) que genera URLs poco limpias y no aprovecha la History API del browser. Esto se reemplazó por rutas limpias (`/home`, `/chat`) manejadas con `window.history.pushState`.

---

### Error 3 — Diagnóstico del problema de CSS con Live Server

![Explicación del error de CSS](ASSETS\imagen3.png)

Al investigar por qué el CSS no cargaba, se identificó que el problema dependía de desde dónde estaba sirviendo Live Server. Si servía desde `/src` en lugar de la raíz del proyecto, la ruta `./src/styles/main.css` no tenía sentido.

La solución definitiva fue cambiar todas las rutas a absolutas usando `/` al inicio:

```html
<!-- ❌ antes -->
<link rel="stylesheet" href="./src/styles/main.css">

<!-- ✅ después -->
<link rel="stylesheet" href="/src/styles/main.css">
```

Esto garantiza que el servidor siempre busque desde la raíz, independientemente de dónde esté corriendo.

---

### Error 4 — Export no encontrado en characterService.js

![Error de getCurrentCharacter](ASSETS\imagen4.png)

```
Uncaught SyntaxError: The requested module '../services/characterService.js'
does not provide an export named 'getCurrentCharacter'
```

Este error aparecía porque `messages.js` importaba `getCurrentCharacter` desde `characterService.js`, pero el archivo no tenía esa función exportada correctamente. El archivo existía pero estaba incompleto.

Una vez identificado, se completó el archivo con los exports necesarios:

```javascript
export function getCurrentCharacter(name) {
  return characters.find(char => char.name === name) || null;
}

export function applyTheme(theme) {
  document.body.className = theme;
}
```

---

## Otros problemas resueltos durante el desarrollo

**Router con appendChild en lugar de innerHTML** — las vistas retornan strings HTML, no nodos DOM. Usar `appendChild` con un string no funciona; la solución fue `root.innerHTML = Navbar() + renderView()`.

**API key en el frontend** — se detectó que importar el SDK de Google directamente en el browser expone la API key en el bundle. Se movió toda la lógica a una Serverless Function en `/api/chat.js` que corre en el servidor de Vercel.

**Rutas que rompían al recargar en Vercel** — al navegar a `/chat` y recargar, Vercel devolvía 404 porque no conoce esas rutas. Se configuró `vercel.json` con rewrites para redirigir todo al `index.html`.

**getElementById antes de que existiera el DOM** — un componente accedía al DOM en el momento de importarse, antes de que el HTML estuviera renderizado. Se corrigió convirtiendo el componente en una función pura que solo retorna HTML.

---

## Reflexión

El uso de IA fue útil principalmente para acelerar el diagnóstico de errores y para contrastar decisiones técnicas. La arquitectura del proyecto, la elección de tecnologías, los personajes y el diseño visual fueron definidos de forma independiente.