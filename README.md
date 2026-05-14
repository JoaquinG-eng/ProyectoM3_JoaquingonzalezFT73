# ChatVerse AI 🎮

Una Single Page Application (SPA) que permite conversar con personajes de videojuegos, anime y una maestra de inglés usando inteligencia artificial (Gemini 2.5 Flash de Google).

---

## Tabla de contenidos

- [Demo](#demo)
- [Tecnologías](#tecnologías)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Cómo correr el proyecto](#cómo-correr-el-proyecto)
- [Variables de entorno](#variables-de-entorno)
- [Modos de desarrollo](#modos-de-desarrollo)
- [Testing](#testing)
- [Decisiones técnicas](#decisiones-técnicas)
- [Flujo de la aplicación](#flujo-de-la-aplicación)
- [Personajes disponibles](#personajes-disponibles)
- [Deploy en Vercel](#deploy-en-vercel)

---

## Demo

🔗 [proyecto-m3-joaquin-gonzalez-ft-73.vercel.app](https://proyecto-m3-joaquin-gonzalez-ft-73.vercel.app)

---

## Tecnologías

| Tecnología | Uso |
|---|---|
| HTML + CSS + JavaScript | Base de la aplicación |
| Vite | Bundler, dev server y soporte para Vitest |
| Vercel | Hosting y Serverless Functions |
| Gemini 2.5 Flash API | Inteligencia artificial para los personajes |
| @google/generative-ai | SDK oficial de Google — usado solo en el servidor |
| Vitest | Testing unitario |

Sin frameworks de UI. Sin librerías de terceros en el frontend. Todo vanilla.

---

## Estructura del proyecto

```
/
├── index.html
├── package.json
├── vite.config.js
├── vercel.json
├── .env                     ← API key local (no se sube a git)
├── .env.example             ← Referencia de variables necesarias
├── .gitignore
│
├── api/
│   └── chat.js              ← Serverless Function (maneja la API key)
│
└── src/
    ├── app.js               ← Punto de entrada
    ├── router.js            ← Lógica de rutas (History API)
    │
    ├── data/
    │   └── characters.js    ← Definición de personajes
    │
    ├── state/
    │   └── chatState.js     ← Estado global del chat
    │
    ├── services/
    │   ├── chatServices.js      ← Fetch a /api/chat + modo mock
    │   └── characterService.js  ← Búsqueda de personaje y aplicación de tema
    │
    ├── components/
    │   ├── navbar.js            ← Barra de navegación
    │   ├── characterCards.js    ← Botones de selección de personaje
    │   ├── chatForm.js          ← Formulario de mensajes
    │   └── messagesContainer.js ← Contenedor del historial
    │
    ├── utils/
    │   ├── messages.js      ← Agregar y cargar mensajes en el DOM
    │   ├── storage.js       ← Persistencia con localStorage + cache en memoria
    │   ├── typing.js        ← Indicador "Escribiendo..."
    │   ├── contrast.js      ← Toggle de alto contraste
    │   └── character.js     ← Re-exporta getCurrentCharacter
    │
    ├── views/
    │   ├── home.js          ← Vista de inicio
    │   ├── chat.js          ← Vista del chat (lógica principal)
    │   ├── about.js         ← Vista sobre el proyecto
    │   └── notFound.js      ← Vista 404
    │
    ├── tests/
    │   ├── storage.test.js      ← Tests de localStorage y cache
    │   ├── chatState.test.js    ← Tests de estado y sessionStorage
    │   ├── chatServices.test.js ← Tests de la IA y fallback mock
    │   └── messages.test.js     ← Tests de renderizado de mensajes
    │
    └── styles/
        ├── main.css         ← Importa todos los módulos + reset
        ├── navbar.css
        ├── home.css
        ├── chat.css
        ├── about.css
        ├── notFound.css
        ├── themes.css       ← Temas visuales por personaje
        ├── accessibility.css
        └── responsive.css
```

---

## Cómo correr el proyecto

### 1. Clonar el repositorio

```bash
git clone https://github.com/JoaquinG-eng/ProyectoM3_JoaquingonzalezFT73
cd ProyectoM3_JoaquingonzalezFT73
```

### 2. Instalar dependencias

```bash
npm install
```
 ### 3. Crear el archivo de entorno

Copiar `.env.example` a `.env` y completar con la API key real:

```bash
cp .env.example .env
```

```env
GEMINI_API_KEY=tu_api_key_real_aqui
```

> Obtené tu API key gratis en: https://aistudio.google.com/app/apikey

### 4. Correr en desarrollo

```bash
vercel dev
```

Abrir `http://localhost:3000`

### 5. Build para producción

```bash
npm run build
```

---

## Variables de entorno

| Variable | Dónde se usa | Descripción |
|---|---|---|
| `GEMINI_API_KEY` | `api/chat.js` (servidor) | API key de Google Gemini |

La API key **nunca toca el frontend**. Solo existe en la Serverless Function del servidor.

Para agregarla en Vercel:

```bash
vercel env add GEMINI_API_KEY production
vercel env add GEMINI_API_KEY development
```

O desde el dashboard: `Settings → Environment Variables`

---

## Modos de desarrollo

### Con Vercel CLI — IA real

```bash
vercel dev
```

Ejecuta las Serverless Functions correctamente. Los personajes responden con Gemini AI con su personalidad definida y memoria del historial de conversación.

### Con Live Server — modo mock

Al abrir con Live Server, `/api/chat` no está disponible. En ese caso `chatServices.js` detecta el error automáticamente y responde con mensajes predefinidos por personaje. El historial se guarda y restaura igual que en el modo real.

| Funcionalidad | Vercel dev | Live Server |
|---|---|---|
| Respuestas de IA | ✅ | ❌ (mock) |
| Historial persistente | ✅ | ✅ |
| Cambio de personaje | ✅ | ✅ |
| Temas visuales | ✅ | ✅ |
| Alto contraste | ✅ | ✅ |

---

## Testing

```bash
# Correr los tests
npm test

# Interfaz visual
npm run test:ui

# Reporte de cobertura
npm run coverage
```

### Tests incluidos

| Archivo | Qué testea |
|---|---|
| `storage.test.js` | Guardado y lectura de conversaciones en localStorage, cache en memoria |
| `chatState.test.js` | Selección y restauración de personaje con sessionStorage |
| `chatServices.test.js` | Respuesta exitosa de la IA y fallback al modo mock |
| `messages.test.js` | Renderizado de mensajes en el DOM y persistencia en conversations |

### Reporte de cobertura

```
------------------|---------|----------|---------|---------|-------------------
File              | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
------------------|---------|----------|---------|---------|-------------------
All files         |      95 |    87.67 |     100 |   96.15 |                   
 services         |      80 |    72.22 |     100 |   83.33 |                   
  chatServices.js |      80 |    72.22 |     100 |   83.33 | 50,65,69          
 state            |     100 |      100 |     100 |     100 |                   
  chatState.js    |     100 |      100 |     100 |     100 |                   
 utils            |   97.75 |    91.83 |     100 |   98.71 |                   
  messages.js     |     100 |       80 |     100 |     100 | 13,21,38          
  storage.js      |     100 |      100 |     100 |     100 |                   
  tokenLimit.js   |   96.42 |    96.66 |     100 |   97.91 | 23                
------------------|---------|----------|---------|---------|-------------------

```

**100% de statements, funciones y líneas** cubiertas.

---

## Decisiones técnicas

### SPA con History API en lugar de hash routing

Se eligió History API (`window.history.pushState`) para tener rutas limpias como `/home`, `/chat`, `/about` en lugar de `/#/chat`. Esto requiere que el servidor redirija todas las rutas al `index.html`, lo cual se configura en `vercel.json`:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Vistas como funciones que retornan strings HTML

Todas las vistas (`renderHome`, `renderChat`, etc.) retornan strings HTML puros. El router los inyecta via `innerHTML`. Esta decisión simplifica el código al no necesitar un motor de templates ni un framework.

**Consecuencia importante:** los eventos se registran con `setTimeout(() => initChat(), 0)` dentro de `renderChat()` para esperar a que el DOM exista antes de buscar los elementos.

### El SDK de Gemini vive solo en el servidor

Se usa `@google/generative-ai` únicamente en la Serverless Function del servidor (`api/chat.js`), nunca en el frontend. Si se importara directamente en el browser, la API key quedaría expuesta en el bundle de JavaScript visible para cualquier usuario. En cambio:

- El frontend llama a `/api/chat` con `fetch`
- La Serverless Function importa el SDK y maneja la API key
- La API key nunca llega al browser

### Conteo y límite de tokens

Para controlar el consumo de la API se implementaron dos capas:

- **Local** — estimación aproximada (longitud del texto ÷ 4) sin llamar a Gemini
- **Producción** — `countTokens()` real de Gemini antes de cada request

Si el total supera los 5000 tokens, el historial se recorta agresivamente a los últimos 5 mensajes. El historial siempre se limita a los últimos 30 mensajes antes del conteo.

### Historial persistente con cache en memoria

Las conversaciones se guardan en `localStorage` para persistir entre recargas. Además, `storage.js` mantiene un `_cache` en memoria que evita leer el localStorage en cada operación. Esto resuelve el problema de desincronización al cambiar de personaje o navegar entre páginas dentro de la misma sesión.

El personaje seleccionado se guarda en `sessionStorage` para restaurarlo al volver a `/chat` desde otra página, y se limpia automáticamente al cerrar la pestaña.

```json
{
  "Mario": [
    { "text": "Hola", "sender": "user" },
    { "text": "¡Wahoo!", "sender": "ai" }
  ]
}
```

### Modo mock para desarrollo sin API

`chatServices.js` intenta llamar a `/api/chat` y, si falla (por ejemplo con Live Server), devuelve una respuesta aleatoria predefinida por personaje. Para teacher Meli, el primer mensaje siempre es la presentación y pregunta el nombre del estudiante.

### Temas visuales con imagen de fondo por personaje

Cada personaje tiene un `theme` que se aplica como clase CSS al `body`. Los temas incluyen una imagen de fondo animada con `::after` que representa el mundo de cada personaje. Al navegar fuera del chat el tema se limpia automáticamente.

### Accesibilidad — botón de alto contraste

Se incluyó un botón de alto contraste pensado principalmente para usuarios con daltonismo o baja visión. La preferencia se guarda en `localStorage` para que no haya que reactivarlo en cada visita.

### Estado global sin librerías

El estado del chat se maneja con un objeto JavaScript plano en `chatState.js`. Es suficiente para la escala de esta aplicación y evita agregar dependencias como Redux o Zustand.

### CSS modular sin preprocesadores

Los estilos están divididos por responsabilidad e importados desde `main.css` con `@import`. No se usa SASS ni CSS Modules para mantener el proyecto accesible y sin configuración extra.

---

## Flujo de la aplicación

```
Usuario abre la app
        ↓
app.js → router()
        ↓
router lee window.location.pathname
        ↓
Inyecta Navbar() + renderVista() en #app
        ↓
Registra listeners en [data-link]
        ↓
Usuario clickea un link → pushState → router()
        ↓
Usuario selecciona personaje en /chat
        ↓
setCharacter() → actualiza chatState + sessionStorage
applyTheme() → cambia imagen de fondo
loadConversation() → carga historial desde cache/localStorage
        ↓
Usuario envía mensaje
        ↓
addMessage() → DOM + localStorage
fetch("/api/chat") → Serverless Function
        ↓                         ↓ falla
countTokens() → recorte       respuesta mock por personaje
        ↓
Gemini 2.5 Flash responde
        ↓
Respuesta → addMessage() → DOM + localStorage
```

---

## Personajes disponibles

| Personaje | Tema | Personalidad |
|---|---|---|
| 🍄 Mario | Azul | Alegre, optimista, usa "¡Wahoo!" y "¡Mamma mia!" |
| 🍥 Naruto | Naranja | Energético, nunca se rinde, quiere ser Hokage |
| 🌌 Rosalina | Celeste | Calmada, sabia, habla del cosmos y las estrellas |
| 👩‍🏫 Teacher Meli | Beige/English | Maestra de inglés amable y divertida para chicos de 8 a 13 años. Siempre responde en inglés, corrige errores con gentileza y pregunta el nombre del estudiante al inicio |

---

## Deploy en Vercel

1. Subir el repositorio a GitHub
2. Importar el proyecto en Vercel
3. Agregar la variable de entorno `GEMINI_API_KEY` en el dashboard
4. Deploy automático — Vercel detecta Vite y configura el build solo

El archivo `vercel.json` ya tiene los rewrites necesarios para que las rutas de la SPA funcionen al recargar la página.

---

## Registro de uso de IA

El desarrollo fue asistido por **Claude (Anthropic)**. Su uso se concentró en debugging, validación de decisiones técnicas y generación de boilerplate. Las decisiones de arquitectura, diseño y funcionalidades fueron tomadas de forma independiente.

Los errores más relevantes resueltos con asistencia de IA:

- Router usando `appendChild` con strings HTML → migrado a `innerHTML`
- SDK de Gemini importado en el frontend → movido a Serverless Function
- `getElementById` ejecutándose al importar → convertido a función pura
- `setCharacter` duplicado en dos archivos → centralizado en `chatState.js`
- Rutas que rompían al recargar en Vercel → configurado `vercel.json` con rewrites
- Cache de `localStorage` que interfería entre tests → implementado `_clearCache()`

> El documento completo de uso de IA está en [`docs-ia.md`](./documentacion-con-IA.md)

---

## Autor

**Joaquín Gonzalez** — Proyecto M3 — FT73