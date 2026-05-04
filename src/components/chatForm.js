export function renderChatForm() {
  return `
  <form
    id="chat-form"
    class="chat-form"
  >

    <input
      id="chat-input"
      class="chat-input"
      type="text"
      placeholder="Escribe un mensaje..."
    >

    <button type="submit">
      Enviar
    </button>

    <button
      type="button"
      id="clear-chat"
      class="clear-btn"
    >
      Limpiar
    </button>

    <button
      type="button"
      id="contrast-btn"
      class="contrast-btn"
    >
      Contraste
    </button>


  </form>
  `;
}