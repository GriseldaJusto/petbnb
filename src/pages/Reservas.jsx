import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/style.css";
import "../styles/responsivo.css";

export default function Reservas() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    // Simular sessão
    const userSession = {
      tipo: "dono",
      nome: "Usuário",
      email: "usuario@email.com"
    };
    setSession(userSession);
    carregarReservas();
  }, []);

  const carregarReservas = () => {
    // Dados mockados
    const reservasMock = [
      {
        id: 1,
        hostName: "Ana Silva",
        checkin: "15/12/2024",
        checkout: "20/12/2024",
        days: 5,
        precoEstimado: 225,
        status: "Pendente",
        pet: "Rex (Golden Retriever)"
      },
      {
        id: 2,
        hostName: "Carlos Mendes",
        checkin: "22/12/2024",
        checkout: "25/12/2024",
        days: 3,
        precoEstimado: 180,
        status: "Aceita",
        pet: "Luna (SRD)"
      }
    ];
    setReservas(reservasMock);
  };

  const cancelarReserva = (id) => {
    if (window.confirm("Tem certeza que deseja cancelar esta reserva?")) {
      setReservas(reservas.map(reserva => 
        reserva.id === id ? { ...reserva, status: "Cancelada" } : reserva
      ));
      alert("Reserva cancelada com sucesso!");
    }
  };

  const renderizarStatus = (status) => {
    switch (status.toLowerCase()) {
      case "pendente":
        return <span className="status-pendente">Pendente</span>;
      case "aceita":
        return <span className="status-aceita">Aceita</span>;
      case "recusada":
        return <span className="status-recusada">Recusada</span>;
      case "cancelada":
        return <span className="status-cancelada">Cancelada</span>;
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <>
      <style>{`
        .reserva-status {
          padding: 0.3rem 0.8rem;
          border-radius: 15px;
          font-size: 0.8rem;
          font-weight: 600;
          display: inline-block;
          margin-left: 1rem;
        }
        .status-pendente { background: #fff3cd; color: #856404; }
        .status-aceita { background: #d4edda; color: #155724; }
        .status-recusada { background: #f8d7da; color: #721c24; }
        .status-cancelada { background: #e2e3e5; color: #383d41; }
        
        .reserva-card {
          margin-bottom: 1.5rem;
          border-left: 4px solid var(--accent);
          padding: 1rem;
          background: var(--card);
          border-radius: 8px;
        }
        
        .reserva-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
          flex-wrap: wrap;
        }
        
        .empty-state {
          text-align: center;
          padding: 3rem 2rem;
          color: var(--muted);
        }
        
        .empty-state .icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }
      `}</style>

      <header className="site-header">
        <div className="container header-inner">
          <Link className="brand" to="/">
            <img src="logoBranca.png" alt="Petbnb" className="logo" />
          </Link>

          <nav className="main-nav" aria-label="Navegação principal">
            <div className="nav-links">
              <Link to="/busca" className="nav-link">
                <span>🔍</span>
                Encontrar Hospedagem
              </Link>
              <Link to="/reserva" className="nav-link active">
                <span>📋</span>
                Minhas Reservas
              </Link>
            </div>

            <div className="user-menu">
              <Link to="/cadastro?tipo=anfitriao" className="host-link">
                <span>🏠</span>
                Seja um Anfitrião
              </Link>

              {session ? (
                <div className="user-dropdown">
                  <button className="user-toggle">
                    <div className="user-avatar">👤</div>
                    <span className="user-name">{session.nome}</span>
                    <span className="dropdown-arrow">▼</span>
                  </button>
                  <div className="dropdown-menu">
                    <Link to="/tutor" className="dropdown-item">
                      <span>⭐</span>
                      Minha Área
                    </Link>
                    <Link to="/reserva" className="dropdown-item">
                      <span>📋</span>
                      Minhas Reservas
                    </Link>
                    <div className="dropdown-divider"></div>
                    <a href="#" className="dropdown-item" onClick={() => navigate("/")}>
                      <span>🚪</span>
                      Sair
                    </a>
                  </div>
                </div>
              ) : (
                <div className="auth-links">
                  <Link to="/login" className="login-btn">Entrar</Link>
                  <Link to="/cadastro" className="signup-btn">Cadastrar</Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      <main className="container">
        <h1>Minhas Reservas</h1>
        <section id="reservas-list">
          {reservas.length === 0 ? (
            <div className="empty-state">
              <div className="icon">📋</div>
              <p>Nenhuma reserva encontrada</p>
              <Link to="/busca" className="btn btn-primary" style={{ marginTop: "1rem" }}>
                Buscar Anfitriões
              </Link>
            </div>
          ) : (
            reservas.map(reserva => (
              <div key={reserva.id} className="reserva-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <h3 style={{ margin: "0 0 0.5rem 0" }}>{reserva.hostName}</h3>
                    <div style={{ color: "var(--muted)", marginBottom: "0.5rem" }}>
                      🐾 {reserva.pet}
                    </div>
                    <div style={{ color: "var(--muted)", marginBottom: "0.5rem" }}>
                      📅 {reserva.checkin} → {reserva.checkout} ({reserva.days} diárias)
                    </div>
                    <div style={{ color: "var(--muted)", marginBottom: "0.5rem" }}>
                      💰 R$ {reserva.precoEstimado.toFixed(2)}
                    </div>
                    <div>
                      Status: {renderizarStatus(reserva.status)}
                    </div>
                  </div>
                  <div className="reserva-actions">
                    {reserva.status === "Pendente" && (
                      <button 
                        className="btn" 
                        onClick={() => cancelarReserva(reserva.id)}
                      >
                        Cancelar
                      </button>
                    )}
                    <button className="btn btn-primary">
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </section>
      </main>

      <footer className="site-footer">
        <div className="container">
          <p>Petbnb</p>
        </div>
      </footer>
    </>
  );
}