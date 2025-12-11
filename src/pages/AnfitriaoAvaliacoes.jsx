import { Link } from "react-router-dom";
import "../styles/style.css";

export default function AnfitriaoAvaliacoes() {
  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <Link className="brand" to="/">
            <img src="logoBranca.png" alt="Petbnb" className="logo" />
          </Link>

          <nav className="main-nav">
            <Link to="/anfitriao-dashboard">📊 Dashboard</Link>
            <Link to="/reserva">📅 Reservas</Link>
            <Link to="/anfitriao-avaliacoes" style={{ background: "rgba(33, 158, 188, 0.1)", color: "var(--accent)" }}>
              ⭐ Avaliações
            </Link>
            <Link to="/">🚪 Sair</Link>
          </nav>
        </div>
      </header>

      <main className="container">
        <section className="card">
          <h2>⭐ Avaliações</h2>
          <p>Esta funcionalidade estará disponível em breve.</p>
          <Link to="/reserva" className="btn btn-primary">
            📅 Voltar para Reservas
          </Link>
        </section>
      </main>
    </>
  );
}