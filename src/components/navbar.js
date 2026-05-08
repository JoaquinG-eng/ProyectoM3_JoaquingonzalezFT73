// Los links tienen data-link para que el router los intercepte
export function Navbar() {
  return `
    <nav class="navbar">
      <a href="/home"  data-link class="nav-link">Home</a>
      <a href="/chat"  data-link class="nav-link">Chat</a>
      <a href="/about" data-link class="nav-link">About</a>
    </nav>
  `;
}