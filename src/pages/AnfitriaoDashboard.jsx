import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/style.css";
import "../styles/responsivo.css";
import "../styles/AnfitriaoDashboard.css";

export default function AnfitriaoDashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard-section");
  const [session, setSession] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [proximasHospedagens, setProximasHospedagens] = useState([]);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [perfil, setPerfil] = useState({
    nome: "",
    telefone: "",
    cidade: "",
    preco: "",
    descricao: "",
    servicos: ""
  });

  // Simulação de verificação de sessão
  useEffect(() => {
    const userSession = {
      tipo: "anfitriao",
      nome: "Carlos Silva",
      email: "carlos@email.com",
      avaliacao: "4.9",
      hospedagens: "12",
      taxaResposta: "95%"
    };
    setSession(userSession);
    
    // Definir dados iniciais
    setPerfil({
      nome: "Carlos Silva",
      telefone: "(11) 99999-9999",
      cidade: "São Paulo",
      preco: "50",
      descricao: "Tenho uma casa com quintal grande e adoro animais. Experiência de 5 anos como anfitrião.",
      servicos: "Banho, passeios diários, medicação"
    });
    
    carregarDadosIniciais();
  }, []);

  const carregarDadosIniciais = () => {
    setReservas([
      {
        id: 1,
        pet: "Rex (Golden Retriever)",
        dono: "Maria Silva",
        periodo: "15-20 Dez 2024 (5 diárias)",
        status: "Pendente",
        inicialPet: "R"
      },
      {
        id: 2,
        pet: "Luna (SRD)",
        dono: "João Santos",
        periodo: "22-25 Dez 2024 (3 diárias)",
        status: "Confirmado",
        inicialPet: "L"
      }
    ]);
    
    setProximasHospedagens([
      {
        id: 1,
        pet: "Rex (Golden Retriever)",
        dono: "Maria Silva",
        periodo: "15-20 Dez 2024",
        inicialPet: "R"
      }
    ]);
    
    setAvaliacoes([
      {
        id: 1,
        nome: "Maria Silva",
        pet: "Rex",
        nota: "5.0",
        data: "15/12/2024",
        comentario: "Excelente cuidado! Meu Rex voltou muito feliz. Recomendo muito!"
      },
      {
        id: 2,
        nome: "João Santos",
        pet: "Luna",
        nota: "4.5",
        data: "10/12/2024",
        comentario: "Ótimo espaço e muito carinho com minha Luna. Só senti falta de mais fotos atualizadas."
      }
    ]);
  };

  const showSection = (sectionId) => {
    setActiveSection(sectionId);
    
    // Carregar dados específicos da seção (simulação)
    if(sectionId === 'reservas-section') {
      loadReservas();
    } else if(sectionId === 'financeiro-section') {
      loadFinanceiro();
    } else if(sectionId === 'avaliacoes-section') {
      loadAvaliacoes();
    } else if(sectionId === 'calendario-section') {
      loadCalendario();
    }
  };

  const loadReservas = () => {
    // Simulação de carregamento de reservas
    console.log("Carregando reservas...");
  };

  const loadFinanceiro = () => {
    // Simulação de carregamento financeiro
    console.log("Carregando dados financeiros...");
  };

  const loadAvaliacoes = () => {
    // Simulação de carregamento de avaliações
    console.log("Carregando avaliações...");
  };

  const loadCalendario = () => {
    // Simulação de carregamento do calendário
    console.log("Carregando calendário...");
  };

  const aceitarReserva = (id) => {
    if(window.confirm('Deseja aceitar esta reserva?')) {
      alert('Reserva aceita com sucesso!');
      // Atualizar status da reserva
      setReservas(prev => prev.map(reserva => 
        reserva.id === id ? {...reserva, status: 'Confirmado'} : reserva
      ));
    }
  };

  const recusarReserva = (id) => {
    if(window.confirm('Deseja recusar esta reserva?')) {
      alert('Reserva recusada.');
      // Remover reserva
      setReservas(prev => prev.filter(reserva => reserva.id !== id));
    }
  };

  const editarPrecos = () => {
    const novoPreco = prompt('Digite o novo preço por diária:');
    if(novoPreco && !isNaN(novoPreco)) {
      setPerfil(prev => ({...prev, preco: novoPreco}));
      alert(`Preço atualizado para R$ ${novoPreco} por diária!`);
    }
  };

  const salvarDisponibilidade = () => {
    alert('Disponibilidade salva com sucesso!');
  };

  const handlePerfilSubmit = (e) => {
    e.preventDefault();
    alert('Perfil atualizado com sucesso!');
  };

  const handleLogout = () => {
    if(window.confirm('Deseja sair da sua conta?')) {
      // Limpar sessão e redirecionar
      navigate('/');
    }
  };

  // Gerar calendário
  const gerarCalendario = () => {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    let calendar = [];
    
    // Cabeçalho dos dias
    days.forEach(day => {
      calendar.push(
        <div key={`header-${day}`} className="calendar-day" style={{fontWeight: 600, background: "transparent"}}>
          {day}
        </div>
      );
    });
    
    for (let i = 1; i <= 31; i++) {
      const status = i % 3 === 0 ? 'reservado' : i % 2 === 0 ? 'indisponivel' : 'disponivel';
      calendar.push(
        <div key={`day-${i}`} className={`calendar-day ${status}`}>
          {i}
        </div>
      );
    }
    
    return calendar;
  };

  // Renderizar seção ativa
  const renderSection = () => {
    switch(activeSection) {
      case 'dashboard-section':
        return (
          <>
            <div className="card">
              <h3>🚀 Ações Rápidas</h3>
              <div className="quick-actions">
                <div className="action-btn" onClick={() => showSection('perfil-section')}>
                  <div className="icon">📸</div>
                  <span>Adicionar Fotos</span>
                </div>
                <div className="action-btn" onClick={() => showSection('calendario-section')}>
                  <div className="icon">📅</div>
                  <span>Atualizar Disponibilidade</span>
                </div>
                <div className="action-btn" onClick={editarPrecos}>
                  <div className="icon">💰</div>
                  <span>Ajustar Preços</span>
                </div>
                <div className="action-btn" onClick={() => showSection('reservas-section')}>
                  <div className="icon">📋</div>
                  <span>Ver Solicitações</span>
                </div>
              </div>
            </div>

            <div className="card">
              <h3>🏠 Próximas Hospedagens</h3>
              <div className="upcoming-list" id="proximas-hospedagens">
                {proximasHospedagens.map(hospedagem => (
                  <div key={hospedagem.id} className="reserva-card">
                    <div className="reserva-header">
                      <div className="pet-info">
                        <div className="pet-avatar">{hospedagem.inicialPet}</div>
                        <div>
                          <strong>{hospedagem.pet}</strong>
                          <div>Dono: {hospedagem.dono}</div>
                          <div>📅 {hospedagem.periodo}</div>
                        </div>
                      </div>
                      <div className="reserva-actions">
                        <button className="btn">Ver Detalhes</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3>💡 Dicas para Melhorar seu Perfil</h3>
              <ul>
                <li>Adicione mais fotos do seu espaço (+15% de reservas)</li>
                <li>Responda rápido às mensagens (+20% de conversão)</li>
                <li>Mantenha o calendário sempre atualizado</li>
                <li>Peça avaliações após cada hospedagem</li>
              </ul>
            </div>
          </>
        );

      case 'reservas-section':
        return (
          <div className="card">
            <h3>📋 Gerenciar Reservas</h3>
            <div className="reservas-list">
              {reservas.map(reserva => (
                <div key={reserva.id} className="reserva-card">
                  <div className="reserva-header">
                    <div className="pet-info">
                      <div className="pet-avatar">{reserva.inicialPet}</div>
                      <div>
                        <strong>{reserva.pet}</strong>
                        <div>Dono: {reserva.dono}</div>
                        <div>📅 {reserva.periodo}</div>
                      </div>
                    </div>
                    <div className="reserva-actions">
                      <span className={`status-badge status-${reserva.status.toLowerCase()}`}>
                        {reserva.status}
                      </span>
                      {reserva.status === "Pendente" ? (
                        <>
                          <button className="btn btn-primary" onClick={() => aceitarReserva(reserva.id)}>
                            Aceitar
                          </button>
                          <button className="btn" onClick={() => recusarReserva(reserva.id)}>
                            Recusar
                          </button>
                        </>
                      ) : (
                        <button className="btn">Ver Detalhes</button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'calendario-section':
        return (
          <div className="card">
            <h3>📅 Calendário de Disponibilidade</h3>
            <p>Marque os dias que está disponível para receber pets</p>
            <div className="calendar-grid">
              {gerarCalendario()}
            </div>
            <div className="form-actions" style={{marginTop: "1rem"}}>
              <button className="btn btn-primary" onClick={salvarDisponibilidade}>
                Salvar Disponibilidade
              </button>
            </div>
          </div>
        );

      case 'perfil-section':
        return (
          <div className="card profile-form">
            <h3>✏️ Editar Perfil</h3>
            <form id="profile-form" onSubmit={handlePerfilSubmit}>
              <div className="form-row">
                <div>
                  <label htmlFor="host-nome">Nome completo *</label>
                  <input 
                    id="host-nome" 
                    required 
                    value={perfil.nome}
                    onChange={(e) => setPerfil({...perfil, nome: e.target.value})}
                  />
                </div>
                <div>
                  <label htmlFor="host-telefone">Telefone *</label>
                  <input 
                    id="host-telefone" 
                    required 
                    value={perfil.telefone}
                    onChange={(e) => setPerfil({...perfil, telefone: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-row">
                <div>
                  <label htmlFor="host-cidade">Cidade *</label>
                  <input 
                    id="host-cidade" 
                    required 
                    value={perfil.cidade}
                    onChange={(e) => setPerfil({...perfil, cidade: e.target.value})}
                  />
                </div>
                <div>
                  <label htmlFor="host-preco">Preço por diária (R$) *</label>
                  <input 
                    id="host-preco" 
                    type="number" 
                    min="10" 
                    required 
                    value={perfil.preco}
                    onChange={(e) => setPerfil({...perfil, preco: e.target.value})}
                  />
                </div>
              </div>

              <label htmlFor="host-descricao">Descrição do seu espaço *</label>
              <textarea 
                id="host-descricao" 
                rows="4" 
                required 
                placeholder="Conte sobre seu espaço, experiência com pets..."
                value={perfil.descricao}
                onChange={(e) => setPerfil({...perfil, descricao: e.target.value})}
              />

              <label htmlFor="host-servicos">Serviços oferecidos</label>
              <textarea 
                id="host-servicos" 
                rows="3" 
                placeholder="Banho, passeios, medicação..."
                value={perfil.servicos}
                onChange={(e) => setPerfil({...perfil, servicos: e.target.value})}
              />

              <div className="form-actions">
                <button className="btn btn-primary" type="submit">
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        );

      case 'financeiro-section':
        return (
          <div className="card">
            <h3>💰 Relatório Financeiro</h3>
            <div>
              <div className="metrics-grid">
                <div className="metric-card">
                  <div className="icon">💰</div>
                  <div className="number">R$ 680</div>
                  <div className="label">Este Mês</div>
                </div>
                <div className="metric-card">
                  <div className="icon">📈</div>
                  <div className="number">R$ 2.340</div>
                  <div className="label">Total</div>
                </div>
              </div>
              
              <h4>Últimas Transações</h4>
              <div className="reservas-list">
                <div className="reserva-card">
                  <strong>Rex - Golden Retriever</strong>
                  <div>5 diárias × R$ 45 = R$ 225</div>
                  <div style={{color: "var(--muted)", fontSize: "0.9rem"}}>
                    Pago em 10/12/2024
                  </div>
                </div>
                <div className="reserva-card">
                  <strong>Luna - SRD</strong>
                  <div>3 diárias × R$ 50 = R$ 150</div>
                  <div style={{color: "var(--muted)", fontSize: "0.9rem"}}>
                    Pago em 05/12/2024
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'avaliacoes-section':
        return (
          <div className="card">
            <h3>⭐ Avaliações dos Clientes</h3>
            <div className="reviews-list">
              {avaliacoes.map(avaliacao => (
                <div key={avaliacao.id} className="review-card">
                  <div style={{display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "1rem"}}>
                    <div>
                      <strong>{avaliacao.nome}</strong>
                      <div style={{color: "var(--muted)"}}>Dono do {avaliacao.pet}</div>
                    </div>
                    <div style={{display: "flex", alignItems: "center", gap: "0.5rem"}}>
                      <span>⭐ {avaliacao.nota}</span>
                      <span style={{color: "var(--muted)", fontSize: "0.9rem"}}>
                        {avaliacao.data}
                      </span>
                    </div>
                  </div>
                  <p>{avaliacao.comentario}</p>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!session) {
    return (
      <div className="container" style={{marginTop: "2rem"}}>
        <div className="card">
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header igual ao original */}
      <header className="site-header">
        <div className="container header-inner">
          {/* Logo */}
          <a className="brand" href="/">
            <span style={{fontSize: "1.5rem"}}>🐾</span>
            <span style={{fontWeight: 700, fontSize: "1.2rem"}}>Petbnb</span>
          </a>
          
          {/* Estatísticas do Anfitrião */}
          <div className="host-stats">
            <span className="stat">⭐ {session.avaliacao} (128 avaliações)</span>
            <span className="stat">🏠 {session.hospedagens} hospedagens</span>
            <span className="stat">💬 {session.taxaResposta} taxa de resposta</span>
          </div>

          {/* Menu do Anfitrião */}
          <nav className="host-nav">
            <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); showSection('perfil-section'); }}>
              ✏️ Editar Perfil
            </a>
            <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); showSection('reservas-section'); }}>
              📋 Minhas Reservas
            </a>
            <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); showSection('calendario-section'); }}>
              📅 Calendário
            </a>
            <a href="#" className="nav-link" onClick={handleLogout}>
              🚪 Sair
            </a>
          </nav>
        </div>
      </header>

      <main className="container">
        {/* Header do Perfil */}
        <section className="dashboard-header">
          <div className="host-profile-header">
            <div className="host-avatar">👤</div>
            <div className="host-info">
              <h1>Bem-vindo, <span id="host-name">{session.nome}</span>!</h1>
              <p>Gerencie suas hospedagens e receba pets com carinho</p>
            </div>
          </div>
        </section>

        {/* Métricas */}
        <section className="metrics-grid">
          <div className="metric-card">
            <div className="icon">⏳</div>
            <div className="number" id="stats-pendentes">
              {reservas.filter(r => r.status === "Pendente").length}
            </div>
            <div className="label">Reservas Pendentes</div>
          </div>
          <div className="metric-card">
            <div className="icon">📅</div>
            <div className="number" id="stats-proximas">
              {proximasHospedagens.length}
            </div>
            <div className="label">Próximas Hospedagens</div>
          </div>
          <div className="metric-card">
            <div className="icon">⭐</div>
            <div className="number" id="stats-avaliacao">
              {session.avaliacao}
            </div>
            <div className="label">Avaliação Média</div>
          </div>
          <div className="metric-card">
            <div className="icon">💰</div>
            <div className="number" id="stats-renda">R$ 680</div>
            <div className="label">Renda do Mês</div>
          </div>
        </section>

        {/* Navegação */}
        <div className="dashboard-nav">
          <button 
            className={`nav-btn ${activeSection === 'dashboard-section' ? 'active' : ''}`} 
            onClick={() => showSection('dashboard-section')}
          >
            📊 Dashboard
          </button>
          <button 
            className={`nav-btn ${activeSection === 'reservas-section' ? 'active' : ''}`} 
            onClick={() => showSection('reservas-section')}
          >
            📋 Reservas
          </button>
          <button 
            className={`nav-btn ${activeSection === 'calendario-section' ? 'active' : ''}`} 
            onClick={() => showSection('calendario-section')}
          >
            📅 Calendário
          </button>
          <button 
            className={`nav-btn ${activeSection === 'perfil-section' ? 'active' : ''}`} 
            onClick={() => showSection('perfil-section')}
          >
            ✏️ Perfil
          </button>
          <button 
            className={`nav-btn ${activeSection === 'financeiro-section' ? 'active' : ''}`} 
            onClick={() => showSection('financeiro-section')}
          >
            💰 Financeiro
          </button>
          <button 
            className={`nav-btn ${activeSection === 'avaliacoes-section' ? 'active' : ''}`} 
            onClick={() => showSection('avaliacoes-section')}
          >
            ⭐ Avaliações
          </button>
        </div>

        {/* Conteúdo da Seção Ativa */}
        <div className="section-content active">
          {renderSection()}
        </div>
      </main>

      <footer className="site-footer">
        <div className="container">
          <p>© 2025 Petbnb - Área do Anfitrião</p>
        </div>
      </footer>
    </>
  );
}
