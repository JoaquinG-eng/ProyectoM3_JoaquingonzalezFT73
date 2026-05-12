export function renderHome() {
  return `
    <section class="home-page">

      <div class="hero-card">
        <h1 class="hero-title">ChatVerse AI</h1>
        <p class="hero-text">
          Conversa con personajes legendarios usando inteligencia artificial.
        </p>
        <a href="/chat" data-link class="start-btn">Comenzar Chat</a>
      </div>

      <div class="home-characters">

        <div class="home-character">
          <h3>teacher Meli👩‍🏫🦋</h3>
          <p>your sweet teacher.</p>
          <p>tu dulce Maestra.</p>
        </div>

        <div class="home-character">
          <h3>🍥 Naruto</h3>
          <p>El ninja prodigio de la aldea de la hoja.</p>
        </div>

        <div class="home-character">
          <h3>🌌 Rosalina</h3>
          <p>La guardiana estelar del universo Mario.</p>
        </div>

        <div class="home-character">
          <h3>🍄 Mario Bros</h3>
          <p>El héroe clásico del Reino Champiñón.</p>
        </div>

      </div>

    </section>
  `;
}