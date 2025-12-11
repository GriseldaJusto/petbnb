// src/pages/Tutor.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import "../styles/style.css";
import "../styles/responsivo.css";
import "../styles/tutor-area.css";


export default function Tutor() {
  const { session, logout } = useAuth();
  const { getPetsByOwner, addPet, uid, getRequests } = useData();
  const navigate = useNavigate();

  const [active, setActive] = useState("dashboard");
  const [pets, setPets] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [petFormVisible, setPetFormVisible] = useState(false);
  const [petForm, setPetForm] = useState({ 
    nome: "", 
    tipo: "", 
    tipoOutro: "",
    idade: 0, 
    porte: "pequeno", 
    vacinas: "sim", 
    observacoes: "" 
  });

  useEffect(() => {
    if (!session) {
      navigate("/login");
      return;
    }
    
    // Verifica se é tutor/dono
    if (session.tipo !== "dono" && session.tipo !== "tutor") {
      navigate("/");
      return;
    }
    
    loadDashboard();
  }, [session, navigate]);

  function loadDashboard() {
    loadPets();
    loadReservas();
  }

  function loadPets() {
    if (!session) return;
    const myPets = getPetsByOwner(session.email);
    setPets(myPets || []);
  }

  function loadReservas() {
    if (!session) return;
    const all = getRequests();
    const mine = all.filter(r => r.ownerEmail === session.email);
    setReservas(mine);
  }

  function togglePetForm() {
    setPetFormVisible(!petFormVisible);
  }

  function handlePetSubmit(e) {
    e.preventDefault();
    const newPet = { 
      id: uid("pet"), 
      owner: session.email, 
      nome: petForm.nome, 
      tipo: petForm.tipo === "outro" ? petForm.tipoOutro : petForm.tipo, 
      idade: Number(petForm.idade || 0), 
      porte: petForm.porte, 
      vacinas: petForm.vacinas, 
      observacoes: petForm.observacoes 
    };
    addPet(newPet);
    setPetForm({ nome: "", tipo: "", idade: 0, porte: "pequeno", vacinas: "sim", observacoes: "" });
    setPetFormVisible(false);
    loadPets();
    alert("Pet cadastrado com sucesso!");
  }

  function showSection(sectionId) {
    setActive(sectionId);
    if (sectionId === "pets") loadPets();
    if (sectionId === "reservas") loadReservas();
  }

  const reservasAtivas = reservas.filter(r => r.status === "Aceita").length;
  const reservasPendentes = reservas.filter(r => r.status === "Pendente").length;
  const proximasReservas = reservas.filter(r => r.status === "Aceita").slice(0, 3);

  return (
    <PageLayout> {/* Sem prop title */}
      <main className="container">
        {/* Banner de boas-vindas */}
        <section className="card dashboard-header">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h1 style={{ margin: 0, color: "white" }}>Olá, {session?.nome || session?.email || "Tutor"}! 👋</h1>
              <p style={{ margin: "0.5rem 0 0 0", opacity: 0.9, color: "white" }}>
                Bem-vindo à sua área personalizada
              </p>
            </div>
          </div>
        </section>

        {/* Dashboard */}
        <section id="dashboard-section" className={`section-content ${active === "dashboard" ? "active" : ""}`}>
          <div className="dashboard-grid">
            <div className="stat-card">
              <p className="stat-number">{pets.length}</p>
              <p className="stat-label">Pets Cadastrados</p>
            </div>
            <div className="stat-card">
              <p className="stat-number">{reservasAtivas}</p>
              <p className="stat-label">Reservas Ativas</p>
            </div>
            <div className="stat-card">
              <p className="stat-number">{reservasPendentes}</p>
              <p className="stat-label">Solicitações Pendentes</p>
            </div>
            <div className="stat-card">
              <p className="stat-number">{reservas.length}</p>
              <p className="stat-label">Total de Hospedagens</p>
            </div>
          </div>

          <div className="card card-hover">
            <h3>📅 Próximas Reservas</h3>
            <div id="proximas-reservas">
              {proximasReservas.length === 0 ? (
                <div className="empty-state">Nenhuma reserva próxima</div>
              ) : (
                proximasReservas.map(r => (
                  <div key={r.id} className="card small" style={{ marginBottom: "0.5rem" }}>
                    <strong>{r.hostName}</strong>
                    <div>{r.checkin} → {r.checkout}</div>
                    <div>R$ {r.precoEstimado?.toFixed?.(2) || "0.00"}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="card card-hover">
            <h3>🚀 Ações Rápidas</h3>
            <div className="quick-actions">
              <button className="btn btn-primary btn-with-icon" onClick={() => showSection("pets")}>
                🐕 Cadastrar Novo Pet
              </button>
              <button className="btn btn-primary btn-with-icon" onClick={() => navigate("/busca")}>
                🔍 Buscar Anfitriões
              </button>
              <button className="btn btn-with-icon" onClick={() => showSection("reservas")}>
                📋 Ver Todas as Reservas
              </button>
            </div>
          </div>
        </section>

        {/* Navegação por abas */}
        <div className="section-nav">
          <button className={`nav-btn ${active === "dashboard" ? "active" : ""}`} onClick={() => showSection("dashboard")}>
            📊 Dashboard
          </button>
          <button className={`nav-btn ${active === "pets" ? "active" : ""}`} onClick={() => showSection("pets")}>
            🐕 Meus Pets
          </button>
          <button className={`nav-btn ${active === "reservas" ? "active" : ""}`} onClick={() => showSection("reservas")}>
            📅 Minhas Reservas
          </button>
          <button className={`nav-btn ${active === "profile" ? "active" : ""}`} onClick={() => showSection("profile")}>
            👤 Meu Perfil
          </button>
          <button className="nav-btn" onClick={() => { if (confirm("Deseja sair?")) { logout(); navigate("/"); } }}>
            🚪 Sair
          </button>
        </div>

        {/* Seção de Pets */}
        <section id="pets-section" className={`section-content ${active === "pets" ? "active" : ""}`}>
          <div className="card card-hover">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ margin: 0 }}>🐕 Meus Pets</h2>
              <button className="btn btn-primary btn-with-icon" onClick={togglePetForm}>
                + Novo Pet
              </button>
            </div>

            {petFormVisible && (
              <div id="pet-form-container">
                <h3>Cadastrar Novo Pet</h3>
                <form id="pet-form" onSubmit={handlePetSubmit}>
                  <div className="form-row">
                    <div>
                      <label htmlFor="pet-nome">Nome do pet *</label>
                      <input 
                        id="pet-nome" 
                        value={petForm.nome} 
                        onChange={(e) => setPetForm({...petForm, nome: e.target.value})} 
                        required 
                      />
                    </div>
                    <div>
                      <label htmlFor="pet-tipo">Tipo de Pet *</label>
                      <select 
                        id="pet-tipo" 
                        value={petForm.tipo} 
                        onChange={(e) => setPetForm({...petForm, tipo: e.target.value})} 
                        required
                      >
                        <option value="">Selecione</option>
                        <option value="cachorro">Cachorro</option>
                        <option value="gato">Gato</option>
                        <option value="pássaro">Pássaro</option>
                        <option value="roedor">Roedor</option>
                        <option value="outro">Outro</option>
                      </select>
                      {petForm.tipo === "outro" && (
                        <div>
                            <label htmlFor="pet-tipo-outro">Qual tipo?</label>
                            <input
                            id="pet-tipo-outro"
                            type="text"
                            placeholder="Digite o tipo de animal"
                            value={petForm.tipoOutro}
                            onChange={(e) =>
                                setPetForm({ ...petForm, tipoOutro: e.target.value })
                            }
                            required
                            />
                        </div>
                        )}



                    </div>
                  </div>

                  <div className="form-row">
                    <div>
                      <label htmlFor="pet-idade">Idade (anos) *</label>
                      <input 
                        id="pet-idade" 
                        type="number" 
                        min="0" 
                        value={petForm.idade} 
                        onChange={(e) => setPetForm({...petForm, idade: e.target.value})} 
                        required 
                      />
                    </div>
                    <div id="porte-field" className={petForm.tipo === "cachorro" ? "show" : ""}>
                      <label htmlFor="pet-porte">Porte (apenas para cães) *</label>
                      <select 
                        id="pet-porte" 
                        value={petForm.porte} 
                        onChange={(e) => setPetForm({...petForm, porte: e.target.value})}
                      >
                        <option value="pequeno">Pequeno</option>
                        <option value="médio">Médio</option>
                        <option value="grande">Grande</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div>
                      <label htmlFor="pet-vacinas">Vacinas em dia? *</label>
                      <select 
                        id="pet-vacinas" 
                        value={petForm.vacinas} 
                        onChange={(e) => setPetForm({...petForm, vacinas: e.target.value})} 
                        required
                      >
                        <option value="sim">Sim</option>
                        <option value="não">Não</option>
                        <option value="parcial">Parcialmente</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="pet-observacoes">Observações</label>
                      <textarea 
                        id="pet-observacoes" 
                        value={petForm.observacoes} 
                        onChange={(e) => setPetForm({...petForm, observacoes: e.target.value})}
                        placeholder="Comportamento, cuidados especiais..."
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button className="btn btn-primary" type="submit">Cadastrar Pet</button>
                    <button className="btn" type="button" onClick={togglePetForm}>Cancelar</button>
                  </div>
                </form>
              </div>
            )}

            <div id="pets-list">
              {pets.length === 0 ? (
                <div className="empty-state">
                  <p>🎯 Você ainda não cadastrou nenhum pet</p>
                  <button className="btn btn-primary" onClick={togglePetForm} style={{ marginTop: "1rem" }}>
                    Cadastrar Primeiro Pet
                  </button>
                </div>
              ) : (
                <div className="pet-grid">
                  {pets.map(p => (
                    <div className="pet-card" key={p.id}>
                      <div className="pet-header">
                        <h3 className="pet-name">{p.nome}</h3>
                        <span className="pet-type">{p.tipo}</span>
                      </div>
                      <div className="pet-details">
                        <div>🏷️ {p.idade} anos</div>
                        {p.tipo === "cachorro" && <div>📏 Porte {p.porte}</div>}
                        <div>💉 Vacinas: {p.vacinas}</div>
                        {p.observacoes && <div>📝 {p.observacoes}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Seção de Reservas */}
        <section id="reservas-section" className={`section-content ${active === "reservas" ? "active" : ""}`}>
          <div className="card card-hover">
            <h2 style={{ margin: 0 }}>📅 Minhas Reservas</h2>
            <div id="reservas-list">
              {reservas.length === 0 ? (
                <div className="empty-state">Nenhuma reserva encontrada</div>
              ) : (
                reservas.map(r => (
                  <div key={r.id} className={`card reserva-card ${r.status.toLowerCase()}`} style={{ marginBottom: "1rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: "0 0 0.5rem 0" }}>{r.hostName}</h3>
                        <div>📅 {r.checkin} → {r.checkout} ({r.days} diárias)</div>
                        <div>💰 R$ {r.precoEstimado?.toFixed?.(2) || "0.00"}</div>
                        <div>
                          Status: <span className={`reserva-status status-${r.status.toLowerCase()}`}>{r.status}</span>
                        </div>
                      </div>
                      {r.status === "Pendente" && (
                        <button 
                          className="btn" 
                          onClick={() => {
                            if (confirm("Cancelar reserva?")) {
                              // Implementar cancelamento aqui
                              alert("Reserva cancelada (simulação)");
                            }
                          }}
                        >
                          Cancelar
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Seção de Perfil */}
        <section id="profile-section" className={`section-content ${active === "profile" ? "active" : ""}`}>
          <div className="card profile-form card-hover">
            <h2 style={{ margin: 0 }}>👤 Meu Perfil</h2>
            <ProfileForm session={session} />
          </div>
        </section>
      </main>
    </PageLayout>
  );
}

function ProfileForm({ session }) {
  const { users, updateUser } = useData();
  const [form, setForm] = useState({ nome: "", telefone: "", cidade: "", bio: "" });

  useEffect(() => {
    if (!session) return;
    const u = users.find(x => x.email === session.email);
    if (u) setForm({ 
      nome: u.nome || "", 
      telefone: u.telefone || "", 
      cidade: u.cidade || "", 
      bio: u.bio || "" 
    });
  }, [session, users]);

  function handleSubmit(e) {
    e.preventDefault();
    updateUser(session.email, form);
    alert("Perfil salvo!");
  }

  return (
    <form id="profile-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div>
          <label htmlFor="profile-nome">Nome completo *</label>
          <input 
            id="profile-nome" 
            value={form.nome} 
            onChange={(e) => setForm({...form, nome: e.target.value})} 
            required 
          />
        </div>
        <div>
          <label htmlFor="profile-email">E-mail *</label>
          <input 
            id="profile-email" 
            type="email" 
            value={session?.email || ""} 
            readOnly 
          />
        </div>
      </div>

      <div className="form-row">
        <div>
          <label htmlFor="profile-telefone">Telefone</label>
          <input 
            id="profile-telefone" 
            value={form.telefone} 
            onChange={(e) => setForm({...form, telefone: e.target.value})}
            placeholder="(11) 99999-9999"
          />
        </div>
        <div>
          <label htmlFor="profile-cidade">Cidade</label>
          <input 
            id="profile-cidade" 
            value={form.cidade} 
            onChange={(e) => setForm({...form, cidade: e.target.value})}
            placeholder="Sua cidade"
          />
        </div>
      </div>

      <label htmlFor="profile-bio">Sobre mim</label>
      <textarea 
        id="profile-bio" 
        rows="4" 
        value={form.bio} 
        onChange={(e) => setForm({...form, bio: e.target.value})}
        placeholder="Conte um pouco sobre você e seus pets..."
      ></textarea>

      <div className="form-actions">
        <button className="btn btn-primary" type="submit">Salvar Alterações</button>
      </div>
    </form>
  );
}