import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/style.css";
import "../styles/responsivo.css";

export default function Header() {
  const [open, setOpen] = useState(false);
  const { session, logout } = useAuth();

  return (
    <header className="site-header">
      <div className="container header-inner">
        {/* Logo */}
        <Link className="brand" to="/">
          <img src="/logoBranca.png" alt="Petbnb" className="logo" />
        </Link>

        {/* Botão mobile */}
        <button
          className="menu-toggle"
          aria-label="Abrir menu"
          onClick={() => setOpen((s) => !s)}
        >
          
        </button>

        {/* Navegação */}
        <nav className={`main-nav ${open ? "show" : ""}`} aria-label="Navegação principal">
          <div className="nav-container">
            {/* Links comuns */}
            <div className="nav-links">
              <Link to="/busca" className="nav-link">
                 Encontrar Hospedagem
              </Link>
            </div>

            {/* Se usuário estiver logado */}
            {session ? (
              <div className="user-menu">
                {/* Dropdown do usuário */}
                <div className="user-dropdown">
                  <div className="user-toggle">
                    <div className="user-avatar">
                      {session.nome ? session.nome[0].toUpperCase() : session.email[0].toUpperCase()}
                    </div>
                    <span className="user-name">
                      {session.nome || session.email}
                    </span>
                    <span className="dropdown-arrow">▼</span>
                  </div>
                  
                  <div className="dropdown-menu">
                    {/* Se for tutor/dono */}
                    {(session.tipo === "dono" || session.tipo === "tutor") && (
                      <>
                        <Link to="/tutor" className="dropdown-item">
                           Minha Área (Tutor)
                        </Link>
                        <Link to="/tutor#pets" className="dropdown-item">
                           Meus Pets
                        </Link>
                        <Link to="/tutor#reservas" className="dropdown-item">
                           Minhas Reservas
                        </Link>
                        <div className="dropdown-divider"></div>
                      </>
                    )}

                    {/* Se for anfitrião */}
                    {session.tipo === "anfitriao" && (
                      <>
                        <Link to="/anfitriao/dashboard" className="dropdown-item">
                           Dashboard Anfitrião
                        </Link>
                        <div className="dropdown-divider"></div>
                      </>
                    )}

                    <Link to="/configuracoes" className="dropdown-item">
                       Configurações
                    </Link>
                    <button 
                      className="dropdown-item" 
                      onClick={() => {
                        logout();
                        window.location.href = "/";
                      }}
                      style={{ background: "none", border: "none", width: "100%", textAlign: "left" }}
                    >
                       Sair
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Se não estiver logado */
              <div className="user-menu">
                <Link
                  to="/seja-anfitriao"
                  className="host-link"
                  id="become-host-link"
                >
                   Seja um Anfitrião
                </Link>

                <div className="auth-links">
                  <Link to="/login" className="login-btn">Entrar</Link>
                  <Link to="/cadastro" className="signup-btn">Cadastrar</Link>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
