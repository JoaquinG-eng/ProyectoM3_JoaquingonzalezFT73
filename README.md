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

> [link de Vercel](proyecto-m3-joaquin-gonzalez-ft-73.vercel.app)

---

## Tecnologías

| Tecnología | Uso |
|---|---|
| HTML + CSS + JavaScript vanilla | Base de la aplicación |
| Vite | Bundler y dev server |
| Vercel | Hosting y Serverless Functions |
| Gemini 2.5 Flash API | Inteligencia artificial para los personajes |

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
git clone https://github.com/JoaquinG-eng/ProyectoM3_JoaquingonzalezFT73
cd ProyectoM3_JoaquingonzalezFT73
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

### Accesibilidad — botón de alto contraste

Se incluyó un botón de alto contraste pensado principalmente para usuarios con daltonismo o baja visión. Al activarlo, el fondo pasa a negro puro y todos los elementos de UI reciben bordes blancos bien definidos, eliminando la dependencia del color para distinguir componentes. La preferencia se guarda en `localStorage` para que no haya que reactivarlo en cada visita.

Además, el CSS incluye la media query `@media (prefers-contrast: more)` que detecta automáticamente si el sistema operativo del usuario tiene activado el modo de alto contraste, sin necesidad de tocar el botón.

```css
@media (prefers-contrast: more) {
  body { filter: contrast(1.1); }
}
```

### Manejo de errores del chat

Cuando la llamada a la IA falla (sin conexión, API key inválida, error de Gemini), el error no se muestra como un `alert` ni se rompe la UI. En cambio, se inyecta un mensaje dentro del chat con el mismo formato que una respuesta normal, indicando que hubo un problema. Esto mantiene la experiencia consistente y el usuario puede simplemente volver a intentar.

En el servidor (`api/chat.js`) también se validan los datos entrantes antes de llamar a Gemini, devolviendo códigos HTTP descriptivos (`400` si faltan datos, `500` si falla la API) para que el frontend pueda manejarlos correctamente.

```javascript
// Si algo falla, el usuario ve esto en el chat en lugar de una pantalla rota
addMessage("Error al conectar con la IA. Revisá la consola.", "ai", characterName, conversations, false);
```

### Historial guardado por nombre de personaje en lugar de ID

Los personajes no tienen un campo `id` numérico — se identifican por `name` ("Mario", "Naruto", etc.). Se eligió este esquema deliberadamente porque los nombres son estables y legibles, lo que hace que el objeto en `localStorage` sea fácil de inspeccionar y depurar:

```json
{
  "Mario":   [{ "text": "Hola", "sender": "user" }, { "text": "¡Wahoo!", "sender": "ai" }],
  "Naruto":  [{ "text": "¡Dattebayo!", "sender": "ai" }],
  "Rosalina": [],
  "Peach":   []
}
```

Si se usara un ID numérico (`1`, `2`, `3`), el objeto sería menos legible y habría que mantener un mapeo adicional entre IDs y nombres. Dado que los nombres de personaje no cambian, usar el nombre como clave es suficiente y más simple.

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
Testing
El proyecto cuenta con tests unitarios escritos con Vitest. Se testean las capas de lógica pura: servicios, estado y utilidades.
bashnpm test          # corre los tests en modo watch
npm run coverage  # genera el reporte de cobertura
Archivos testeados
ArchivoTestsstate/chatState.js4services/chatServices.js3utils/storage.js4utils/messages.js8Total19 tests
Reporte de cobertura
------------------|---------|----------|---------|---------|
File              | % Stmts | % Branch | % Funcs | % Lines |
------------------|---------|----------|---------|---------|
All files         |  100.00 |    86.66 |  100.00 |  100.00 |
 services         |  100.00 |    80.00 |  100.00 |  100.00 |
  chatServices.js |  100.00 |    80.00 |  100.00 |  100.00 |
 state            |  100.00 |   100.00 |  100.00 |  100.00 |
  chatState.js    |  100.00 |   100.00 |  100.00 |  100.00 |
 utils            |  100.00 |    84.21 |  100.00 |  100.00 |
  messages.js     |  100.00 |    80.00 |  100.00 |  100.00 |
  storage.js      |  100.00 |   100.00 |  100.00 |  100.00 |
------------------|---------|----------|---------|---------|
100% de statements, funciones y líneas cubiertas. Las ramas no cubiertas (13.34%) corresponden a condiciones de red que no se pueden simular en tests unitarios, como respuestas HTTP inesperadas de la API de Gemini.git

## Autor

Joaquín González — Proyecto M3