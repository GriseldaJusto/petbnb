import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/style.css";
import "../styles/responsivo.css";

export default function Home() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
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
    }
  };

  return (
    <>
      <style>{`
        .hero-section {
          padding: 2rem 0 3rem;
          text-align: center;
        }
        
        .hero-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: var(--text);
        }
        
        .hero-subtitle {
          font-size: 1.2rem;
          color: var(--muted);
          margin-bottom: 2rem;
        }
        
        .categories-section {
          padding: 2rem 0;
        }
        
        .section-title {
          font-size: 1.8rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          color: var(--text);
        }
        
        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }
        
        .category-card {
          background: var(--card);
          border-radius: 12px;
          padding: 1.5rem;
          text-align: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
        }
        
        .category-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.12);
        }
        
        .category-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }
        
        .category-name {
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: var(--text);
        }
        
        .category-desc {
          color: var(--muted);
          font-size: 0.9rem;
        }
        
        .featured-section {
          padding: 2rem 0;
          background: var(--bg);
          border-radius: 20px;
          margin: 2rem 0;
        }
        
        .hosts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }
        
        .host-card {
          background: var(--card);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          transition: transform 0.3s ease;
        }
        
        .host-card:hover {
          transform: scale(1.02);
        }
        
        .host-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }
        
        .host-info {
          padding: 1.2rem;
        }
        
        .host-name {
          font-weight: 600;
          margin-bottom: 0.3rem;
        }
        
        .host-location {
          color: var(--muted);
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }
        
        .host-price {
          font-weight: 700;
          color: var(--accent);
          font-size: 1.1rem;
        }
        
        .host-rating {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          margin-top: 0.5rem;
          font-size: 0.9rem;
        }
        
        .how-it-works {
          padding: 3rem 0;
        }
        
        .steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }
        
        .step-card {
          text-align: center;
          padding: 1.5rem;
        }
        
        .step-number {
          width: 50px;
          height: 50px;
          background: var(--accent);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          margin: 0 auto 1rem;
        }
        
        .step-title {
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: var(--text);
        }
        
        .step-desc {
          color: var(--muted);
          font-size: 0.9rem;
        }
        
        .testimonials-section {
          padding: 3rem 0;
        }
        
        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        
        .testimonial-card {
          background: var(--card);
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.06);
        }
        
        .testimonial-text {
          font-style: italic;
          margin-bottom: 1rem;
          color: var(--text);
        }
        
        .testimonial-author {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }
        
        .author-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--brand);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          color: white;
        }
        
        .author-info h4 {
          margin: 0;
          font-weight: 600;
        }
        
        .author-info p {
          margin: 0;
          color: var(--muted);
          font-size: 0.9rem;
        }

        /* Estilos para interface do anfitrião */
        .host-welcome {
          background: linear-gradient(135deg, var(--brand), #ffd88a);
          color: white;
          padding: 2rem;
          border-radius: 20px;
          margin-bottom: 2rem;
          text-align: center;
        }
        
        .host-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin: 2rem 0;
        }
        
        .stat-card {
          background: var(--card);
          padding: 1.5rem;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
        
        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          color: var(--accent);
          margin: 0;
        }
        
        .stat-label {
          color: var(--muted);
          margin: 0.5rem 0 0 0;
          font-size: 0.9rem;
        }
        
        .quick-actions {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
          margin: 2rem 0;
        }
        
        .action-card {
          background: var(--card);
          padding: 1.5rem;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.06);
          transition: transform 0.3s ease;
          cursor: pointer;
          border: 2px solid transparent;
        }
        
        .action-card:hover {
          transform: translateY(-5px);
          border-color: var(--accent);
        }
        
        .action-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }
        
        .upcoming-bookings {
          margin-top: 2rem;
        }
        
        .booking-card {
          background: var(--card);
          padding: 1.2rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          border-left: 4px solid var(--accent);
        }
        
        .booking-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        
        .booking-pet {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .pet-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--brand);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          color: white;
        }
        
        .empty-state {
          text-align: center;
          padding: 2rem;
          color: var(--muted);
        }
        
        .empty-state .icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }
        
        /* Header específico para anfitriões */
        .host-header-nav {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        
        .host-nav-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          color: var(--text);
          font-weight: 500;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        
        .host-nav-link:hover {
          background: rgba(33, 158, 188, 0.1);
          color: var(--accent);
        }
        
        .host-nav-link.active {
          background: var(--accent);
          color: white;
        }
      `}</style>

      <header className="site-header">
        <div className="container header-inner">
          <Link className="brand" to="/">
            <img src="logoBranca.png" alt="Petbnb" className="logo" />
          </Link>

          <nav className="main-nav" aria-label="Navegação principal">
            <div className="nav-container">
              {isHost ? (
                <div className="host-header-nav">
                  <Link to="/anfitriao-dashboard" className="host-nav-link active">
                     Meu Dashboard
                  </Link>
                  <Link to="/reserva" className="nav-link active">
                     Reservas
                  </Link>
                  <Link to="/anfitriao-avaliacoes" className="nav-link active">
                     Avaliações
                  </Link>
                </div>
              ) : (
                <div className="nav-links">
                  <Link to="/busca" className="nav-link active">
                     Encontrar Hospedagem
                  </Link>
                </div>
              )}

              <div className="user-menu">
                {!isHost && (
                  <Link to="/seja-anfitriao" className="host-link">
                     Seja um Anfitrião
                  </Link>
                )}
                
                {session ? (
                  <div className="user-dropdown">
                    <button className="user-toggle">
                      <div className="user-avatar"></div>
                      <span className="user-name">{session.nome}</span>
                      <span className="dropdown-arrow"></span>
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
                ) : (
                  <div className="auth-links">
                    <Link to="/login" className="login-btn">Entrar</Link>
                    <Link to="/cadastro" className="signup-btn">Cadastrar</Link>
                  </div>
                )}
              </div>
            </div>
          </nav>
        </div>
      </header>

      <main className="container">
        {isHost ? (
          <div id="host-content">
            <section className="host-welcome">
              <h1 style={{ margin: "0 0 0.5rem 0", color: "white" }}>
                Bem-vindo de volta, <span id="host-greeting-name">{session?.nome}</span>! 
              </h1>
              <p style={{ margin: 0, opacity: 0.9, fontSize: "1.1rem" }}>
                Você está proporcionando um lar temporário incrível para pets
              </p>
            </section>

            <section className="host-stats-grid">
              <div className="stat-card">
                <div className="stat-number" id="quick-pending">0</div>
                <div className="stat-label">Reservas Pendentes</div>
              </div>
              <div className="stat-card">
                <div className="stat-number" id="quick-upcoming">0</div>
                <div className="stat-label">Próximas Hospedagens</div>
              </div>
              <div className="stat-card">
                <div className="stat-number" id="quick-rating">0.0</div>
                <div className="stat-label">Avaliação Média</div>
              </div>
              <div className="stat-card">
                <div className="stat-number" id="quick-earnings">R$ 0</div>
                <div className="stat-label">Ganhos do Mês</div>
              </div>
            </section>

            <section>
              <h2> Ações Rápidas</h2>
              <div className="quick-actions">
                <div className="action-card" onClick={() => navigate("/anfitriao-dashboard")}>
                  <div className="action-icon"></div>
                  <h3>Ver Dashboard Completo</h3>
                  <p>Acesse todas as ferramentas de gerenciamento</p>
                </div>
                
                <div className="action-card" onClick={() => navigate("/reserva")}>
                  <div className="action-icon"></div>
                  <h3>Gerenciar Reservas</h3>
                  <p>Aceitar, recusar ou ver detalhes</p>
                </div>
                
                <div className="action-card" onClick={() => navigate("/anfitriao-dashboard#perfil")}>
                  <div className="action-icon"></div>
                  <h3>Editar Meu Perfil</h3>
                  <p>Atualizar fotos, preços e disponibilidade</p>
                </div>
                
                <div className="action-card" onClick={() => navigate("/busca")}>
                  <div className="action-icon"></div>
                  <h3>Explorar Mercado</h3>
                  <p>Ver outros anfitriões e preços</p>
                </div>
              </div>
            </section>

            <section className="upcoming-bookings">
              <h2> Próximas Hospedagens</h2>
              <div id="upcoming-bookings-list">
                <div className="booking-card">
                  <div className="booking-header">
                    <div className="booking-pet">
                      <div className="pet-avatar">R</div>
                      <div>
                        <strong>Rex (Golden Retriever)</strong>
                        <div style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
                          Dono: Maria Silva • 15-20 Dez 2024
                        </div>
                      </div>
                    </div>
                    <button className="btn">Ver Detalhes</button>
                  </div>
                </div>
              </div>
            </section>

            <section style={{ marginTop: "3rem" }}>
              <div className="card">
                <h2> Dicas para Sucesso como Anfitrião</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem", marginTop: "1rem" }}>
                  <div>
                    <h4> Fotos de Qualidade</h4>
                    <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
                      Anfitriões com mais fotos recebem 3x mais reservas
                    </p>
                  </div>
                  <div>
                    <h4> Resposta Rápida</h4>
                    <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
                      Responder em até 2 horas aumenta suas chances em 40%
                    </p>
                  </div>
                  <div>
                    <h4> Avaliações</h4>
                    <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
                      Peça avaliações após cada hospedagem
                    </p>
                  </div>
                  <div>
                    <h4> Disponibilidade</h4>
                    <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
                      Mantenha seu calendário sempre atualizado
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        ) : (
          <div id="normal-content">
            <section className="hero-section">
              <h1 className="hero-title">Encontre o cuidado perfeito para seu pet</h1>
              <p className="hero-subtitle">
                Conectamos você a anfitriões confiáveis que amam animais
              </p>
              <div className="hero-actions">
                <Link className="btn btn-primary" to="/busca">
                  Começar a buscar
                </Link>
              </div>
            </section>

            <section className="categories-section">
              <h2 className="section-title">Tipos de hospedagem</h2>
              <div className="categories-grid">
                <div className="category-card">
                  <div className="category-icon"></div>
                  <h3 className="category-name">Espaços internos</h3>
                  <p className="category-desc">
                    Ambientes fechados e seguros para pets tranquilos
                  </p>
                </div>
                <div className="category-card">
                  <div className="category-icon"></div>
                  <h3 className="category-name">Casas com quintal</h3>
                  <p className="category-desc">
                    Amplo espaço para brincar e se exercitar
                  </p>
                </div>
                <div className="category-card">
                  <div className="category-icon"></div>
                  <h3 className="category-name">Cuidados especiais</h3>
                  <p className="category-desc">
                    Para pets com necessidades especiais ou medicação
                  </p>
                </div>
                <div className="category-card">
                  <div className="category-icon"></div>
                  <h3 className="category-name">Supervisão veterinária</h3>
                  <p className="category-desc">
                    Anfitriões com experiência em cuidados médicos
                  </p>
                </div>
              </div>
            </section>

            <section className="featured-section">
              <h2 className="section-title">Anfitriões em destaque</h2>
              <div className="hosts-grid">
                <div className="host-card">
                  <img 
                    src="https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?q=80&w=800&auto=format&fit=crop" 
                    alt="Casa com quintal" 
                    className="host-image" 
                  />
                  <div className="host-info">
                    <h3 className="host-name">Ana Silva</h3>
                    <div className="host-location">
                      <span></span>
                      São Paulo, SP
                    </div>
                    <div className="host-price">R$ 45/noite</div>
                    <div className="host-rating">
                      <span> 4.9</span>
                      <span></span>
                      <span>128 avaliações</span>
                    </div>
                  </div>
                </div>
                
                <div className="host-card">
                  <img 
                    src="https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=800&auto=format&fit=crop" 
                    alt="Apartamento acolhedor" 
                    className="host-image" 
                  />
                  <div className="host-info">
                    <h3 className="host-name">Carlos Mendes</h3>
                    <div className="host-location">
                      <span></span>
                      Rio de Janeiro, RJ
                    </div>
                    <div className="host-price">R$ 60/noite</div>
                    <div className="host-rating">
                      <span> 4.8</span>
                      <span></span>
                      <span>95 avaliações</span>
                    </div>
                  </div>
                </div>
                
                <div className="host-card">
                  <img 
                    src="https://images.unsplash.com/photo-1558788353-f76d92427f16?q=80&w=800&auto=format&fit=crop" 
                    alt="Casa com jardim" 
                    className="host-image" 
                  />
                  <div className="host-info">
                    <h3 className="host-name">Mariana Costa</h3>
                    <div className="host-location">
                      <span></span>
                      Belo Horizonte, MG
                    </div>
                    <div className="host-price">R$ 55/noite</div>
                    <div className="host-rating">
                      <span> 4.7</span>
                      <span></span>
                      <span>76 avaliações</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="how-it-works">
              <h2 className="section-title">Como o Petbnb funciona</h2>
              <div className="steps-grid">
                <div className="step-card">
                  <div className="step-number">1</div>
                  <h3 className="step-title">Busque</h3>
                  <p className="step-desc">
                    Encontre anfitriões perto de você com base nas necessidades do seu pet
                  </p>
                </div>
                <div className="step-card">
                  <div className="step-number">2</div>
                  <h3 className="step-title">Reserve</h3>
                  <p className="step-desc">
                    Faça uma solicitação de reserva e converse com o anfitrião
                  </p>
                </div>
                <div className="step-card">
                  <div className="step-number">3</div>
                  <h3 className="step-title">Relaxe</h3>
                  <p className="step-desc">
                    Seu pet estará em boas mãos enquanto você viaja
                  </p>
                </div>
              </div>
            </section>

            <section className="testimonials-section">
              <h2 className="section-title">O que nossos clientes dizem</h2>
              <div className="testimonials-grid">
                <div className="testimonial-card">
                  <p className="testimonial-text">
                    "Encontrei uma anfitriã maravilhosa para meu labrador. Ele adorou a estadia e voltou super feliz!"
                  </p>
                  <div className="testimonial-author">
                    <div className="author-avatar">JS</div>
                    <div className="author-info">
                      <h4>João Silva</h4>
                      <p>Dono do Thor</p>
                    </div>
                  </div>
                </div>
                
                <div className="testimonial-card">
                  <p className="testimonial-text">
                    "Perfeito para minhas viagens a trabalho. Meu gato recebe todo cuidado e carinho que precisa."
                  </p>
                  <div className="testimonial-author">
                    <div className="author-avatar">MP</div>
                    <div className="author-info">
                      <h4>Maria Pereira</h4>
                      <p>Dona do Mingau</p>
                    </div>
                  </div>
                </div>
                
                <div className="testimonial-card">
                  <p className="testimonial-text">
                    "Como anfitriã, posso dizer que é uma experiência incrível cuidar dos pets e ainda gerar uma renda extra."
                  </p>
                  <div className="testimonial-author">
                    <div className="author-avatar">CR</div>
                    <div className="author-info">
                      <h4>Carla Rodrigues</h4>
                      <p>Anfitriã há 2 anos</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      <footer className="site-footer">
        <div className="container">
          <p id="footer-text">
            © 2025 Petbnb - Conectando donos e anfitriões com amor pelos animais
          </p>
        </div>
      </footer>
    </>
  );

}
