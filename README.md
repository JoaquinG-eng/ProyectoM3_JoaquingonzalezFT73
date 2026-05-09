# ChatVerse AI 🎮

Una Single Page Application (SPA) que permite conversar con personajes de videojuegos y anime usando inteligencia artificial (Gemini 2.0 Flash de Google).

---

## Tabla de contenidos

- [Demo](#demo)
- [Tecnologías](#tecnologías)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Cómo correr el proyecto](#cómo-correr-el-proyecto)
- [Variables de entorno](#variables-de-entorno)
- [Decisiones técnicas](#decisiones-técnicas)
- [Flujo de la aplicación](#flujo-de-la-aplicación)
- [Personajes disponibles](#personajes-disponibles)
- [Deploy en Vercel](#deploy-en-vercel)

---

## Demo

># ChatVerse AI 🎮

Una Single Page Application (SPA) que permite conversar con personajes de videojuegos y anime usando inteligencia artificial (Gemini 2.0 Flash de Google).

---

## Tabla de contenidos

- [Demo](#demo)
- [Tecnologías](#tecnologías)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Cómo correr el proyecto](#cómo-correr-el-proyecto)
- [Variables de entorno](#variables-de-entorno)
- [Decisiones técnicas](#decisiones-técnicas)
- [Flujo de la aplicación](#flujo-de-la-aplicación)
- [Personajes disponibles](#personajes-disponibles)
- [Deploy en Vercel](#deploy-en-vercel)

---

## Demo

> [link de Vercel](https://proyecto-m3-joaquin-gonzalez-ft-73-oiidzgysi.vercel.app)

---

## Tecnologías

| Tecnología | Uso |
|---|---|
| HTML + CSS + JavaScript vanilla | Base de la aplicación |
| Vite | Bundler y dev server |
| Vercel | Hosting y Serverless Functions |
| Gemini 2.0 Flash API | Inteligencia artificial para los personajes |

Sin frameworks de UI. Sin librerías de terceros en el frontend. Todo vanilla.

---

## Estructura del proyecto

```
/
├── index.html
├── package.json
├── vercel.json
├── .env.local               ← API key local (no se sube a git)
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
    │   ├── chatServices.js      ← Fetch a /api/chat
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
    │   ├── storage.js       ← Persistencia con localStorage
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
git clone https://github.com/tu-usuario/tu-repo.git
cd tu-repo
```

### 2. Instalar dependencias

```bash
npm install
```

Solo se instala Vite. No hay dependencias de frontend.

### 3. Crear el archivo de entorno

Crear un archivo `.env.local` en la raíz:

```bash
GEMINI_API_KEY=tu_api_key_real_aqui
```

> Obtené tu API key en: https://aistudio.google.com/app/apikey

### 4. Correr en desarrollo

```bash
npm run dev
```

Abrir `http://localhost:5173`

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

En Vercel, agregarla en: `Dashboard → Settings → Environment Variables`

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

### La API key vive solo en el servidor

Se decidió no usar `@google/generative-ai` en el frontend porque expone la API key en el bundle de JavaScript que cualquier usuario puede ver. En cambio:

- El frontend llama a `/api/chat` (Serverless Function de Vercel)
- La Serverless Function tiene la API key como variable de entorno del servidor
- La API key nunca llega al browser

### Estado global sin librerías

El estado del chat se maneja con un objeto JavaScript plano en `chatState.js`. Es suficiente para la escala de esta aplicación y evita agregar dependencias como Redux o Zustand.

### CSS modular sin preprocesadores

Los estilos están divididos por responsabilidad (navbar, chat, home, themes, etc.) e importados desde `main.css` con `@import`. Vite procesa esto correctamente en build. No se usa SASS ni CSS Modules para mantener el proyecto accesible y sin configuración extra.

### Persistencia con localStorage

Las conversaciones se guardan en `localStorage` para que persistan entre recargas de página. El esquema es un objeto donde cada clave es el nombre del personaje:

```json
{
  "Mario": [
    { "text": "Hola", "sender": "user" },
    { "text": "¡Wahoo!", "sender": "ai" }
  ]
}
```

### Temas visuales por personaje

Cada personaje tiene un `theme` que se aplica como clase CSS al `body`. Los temas cambian el gradiente de fondo y el color del borde del contenedor de mensajes, creando una identidad visual por personaje.

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
setCharacter() actualiza chatState
applyTheme() cambia el fondo
loadConversation() carga historial
        ↓
Usuario envía mensaje
        ↓
addMessage() → DOM
fetch("/api/chat") → Serverless Function
        ↓
Serverless Function → Gemini API
        ↓
Respuesta → addMessage() → DOM
saveConversations() → localStorage
```

---

## Personajes disponibles

| Personaje | Tema | Personalidad |
|---|---|---|
| 🍄 Mario | Azul | Alegre, optimista, usa "¡Wahoo!" y "¡Mamma mia!" |
| 🍥 Naruto | Naranja | Energético, nunca se rinde, quiere ser Hokage |
| 🌌 Rosalina | Celeste | Calmada, sabia, habla del cosmos y las estrellas |
| 🍑 Peach | Rosa | Amable, dulce, elegante, menciona el Reino Champiñón |

---

## Deploy en Vercel

1. Subir el repositorio a GitHub
2. Importar el proyecto en Vercel
3. Agregar la variable de entorno `GEMINI_API_KEY` en el dashboard
4. Deploy automático — Vercel detecta Vite y configura el build solo

El archivo `vercel.json` ya tiene los rewrites necesarios para que las rutas de la SPA funcionen al recargar la página.

---

## Autor

Joaquín González — Proyecto M3

---

## Tecnologías

| Tecnología | Uso |
|---|---|
| HTML + CSS + JavaScript vanilla | Base de la aplicación |
| Vite | Bundler y dev server |
| Vercel | Hosting y Serverless Functions |
| Gemini 2.0 Flash API | Inteligencia artificial para los personajes |

Sin frameworks de UI. Sin librerías de terceros en el frontend. Todo vanilla.

---

## Estructura del proyecto

```
/
├── index.html
├── package.json
├── vercel.json
├── .env.local               ← API key local (no se sube a git)
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
    │   ├── chatServices.js      ← Fetch a /api/chat
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
    │   ├── storage.js       ← Persistencia con localStorage
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
git clone https://github.com/tu-usuario/tu-repo.git
cd tu-repo
```

### 2. Instalar dependencias

```bash
npm install
```

Solo se instala Vite. No hay dependencias de frontend.

### 3. Crear el archivo de entorno

Crear un archivo `.env.local` en la raíz:

```bash
GEMINI_API_KEY=tu_api_key_real_aqui
```

> Obtené tu API key en: https://aistudio.google.com/app/apikey

### 4. Correr en desarrollo

```bash
npm run dev
```

Abrir `http://localhost:5173`

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

En Vercel, agregarla en: `Dashboard → Settings → Environment Variables`

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

### La API key vive solo en el servidor

Se decidió no usar `@google/generative-ai` en el frontend porque expone la API key en el bundle de JavaScript que cualquier usuario puede ver. En cambio:

- El frontend llama a `/api/chat` (Serverless Function de Vercel)
- La Serverless Function tiene la API key como variable de entorno del servidor
- La API key nunca llega al browser

### Estado global sin librerías

El estado del chat se maneja con un objeto JavaScript plano en `chatState.js`. Es suficiente para la escala de esta aplicación y evita agregar dependencias como Redux o Zustand.

### CSS modular sin preprocesadores

Los estilos están divididos por responsabilidad (navbar, chat, home, themes, etc.) e importados desde `main.css` con `@import`. Vite procesa esto correctamente en build. No se usa SASS ni CSS Modules para mantener el proyecto accesible y sin configuración extra.

### Persistencia con localStorage

Las conversaciones se guardan en `localStorage` para que persistan entre recargas de página. El esquema es un objeto donde cada clave es el nombre del personaje:

```json
{
  "Mario": [
    { "text": "Hola", "sender": "user" },
    { "text": "¡Wahoo!", "sender": "ai" }
  ]
}
```

### Temas visuales por personaje

Cada personaje tiene un `theme` que se aplica como clase CSS al `body`. Los temas cambian el gradiente de fondo y el color del borde del contenedor de mensajes, creando una identidad visual por personaje.

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
setCharacter() actualiza chatState
applyTheme() cambia el fondo
loadConversation() carga historial
        ↓
Usuario envía mensaje
        ↓
addMessage() → DOM
fetch("/api/chat") → Serverless Function
        ↓
Serverless Function → Gemini API
        ↓
Respuesta → addMessage() → DOM
saveConversations() → localStorage
```

---

## Personajes disponibles

| Personaje | Tema | Personalidad |
|---|---|---|
| 🍄 Mario | Azul | Alegre, optimista, usa "¡Wahoo!" y "¡Mamma mia!" |
| 🍥 Naruto | Naranja | Energético, nunca se rinde, quiere ser Hokage |
| 🌌 Rosalina | Celeste | Calmada, sabia, habla del cosmos y las estrellas |
| 🍑 Peach | Rosa | Amable, dulce, elegante, menciona el Reino Champiñón |

---

## Deploy en Vercel

1. Subir el repositorio a GitHub
2. Importar el proyecto en Vercel
3. Agregar la variable de entorno `GEMINI_API_KEY` en el dashboard
4. Deploy automático — Vercel detecta Vite y configura el build solo

El archivo `vercel.json` ya tiene los rewrites necesarios para que las rutas de la SPA funcionen al recargar la página.

---

## Autor

Joaquín González — Proyecto M3