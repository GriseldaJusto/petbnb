import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/style.css";
import "../styles/responsivo.css";

export default function Layout({ children, showBackButton = true, title = null }) {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    // Simular verificação de sessão
    const userSession = localStorage.getItem("session");
    if (userSession) {
      const parsedSession = JSON.parse(userSession);
      setSession(parsedSession);
      setIsHost(parsedSession.tipo === "anfitriao");
    }
  }, []);

  const handleLogout = () => {
    if (window.confirm("Deseja sair da sua conta?")) {
      localStorage.removeItem("session");
      setSession(null);
      setIsHost(false);
      navigate("/");
    }
  };

  const renderUserMenu = () => {
    if (session) {
      return (
        <div className="user-dropdown">
          <button className="user-toggle">
            <div className="user-avatar">👤</div>
            <span className="user-name">{session.nome}</span>
            <span className="dropdown-arrow">▼</span>
          </button>
          <div className="dropdown-menu">
            <Link to={isHost ? "/anfitriao-dashboard" : "/tutor"} className="dropdown-item">
               Minha Área
            </Link>
            <Link to="/reserva" className="dropdown-item">
               Minhas Reservas
            </Link>
            <div className="dropdown-divider"></div>
            <a href="#" className="dropdown-item" onClick={handleLogout}>
               Sair
            </a>
          </div>
        </div>
      );
    } else {
      return (
        <div className="auth-links">
          <Link to="/login" className="login-btn">Entrar</Link>
          <Link to="/cadastro" className="signup-btn">Cadastrar</Link>
        </div>
      );
    }
  };

  return (
    <>
      {/* Cabeçalho */}
      <header className="site-header">
        <div className="container header-inner">
          <Link className="brand" to="/">
            <img src="/logoBranca.png" alt="Petbnb" className="logo" />
          </Link>

          <nav className="main-nav" aria-label="Navegação principal">
            <div className="nav-container">
              {isHost ? (
                <div className="host-header-nav">
                  <Link to="/anfitriao-dashboard" className="host-nav-link">
                     Dashboard
                  </Link>
                  <Link to="/reserva" className="nav-link">
                     Reservas
                  </Link>
                  <Link to="/anfitriao-avaliacoes" className="nav-link">
                     Avaliações
                  </Link>
                </div>
              ) : (
                <div className="nav-links">
                  <Link to="/busca" className="nav-link">
                     Encontrar Hospedagem
                  </Link>
                  <Link to="/reserva" className="nav-link">
                     Minhas Reservas
                  </Link>
                </div>
              )}

              <div className="user-menu">
                {!isHost && (
                  <Link to="/cadastro?tipo=anfitriao" className="host-link">
                     Seja um Anfitrião
                  </Link>
                )}
                {renderUserMenu()}
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Botões de navegação */}
      <div className="container" style={{ marginTop: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button
          className="btn"
          onClick={() => navigate(-1)}
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          ← Voltar
        </button>
        
        <Link to="/" className="btn" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
           Home
        </Link>
      </div>

      {/* Título da página */}
      {title && (
        <div className="container" style={{ marginTop: "1rem" }}>
          <h1>{title}</h1>
        </div>
      )}

      {/* Conteúdo principal */}
      <main>
        {children}
      </main>

      {/* Rodapé */}
      <footer className="site-footer">
        <div className="container">
          <p>© 2025 Petbnb - Conectando donos e anfitriões </p>
        </div>
      </footer>
    </>
  );
}
