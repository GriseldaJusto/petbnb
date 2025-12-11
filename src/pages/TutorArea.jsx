// src/pages/TutorArea.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PageLayout from "../components/PageLayout"; // Importe o PageLayout

/* --- Constantes de storage --- */
const STORAGE = {
  USERS: "petbnb_users",
  PETS: "petbnb_pets",
  REQS: "petbnb_reqs",
};

/* --- Helpers --- */
function uid(prefix = "") {
  return `${prefix}${Math.random().toString(36).slice(2, 9)}`;
}

function readStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getPets() {
  return readStorage(STORAGE.PETS);
}

function getRequests() {
  return readStorage(STORAGE.REQS);
}

function addPet(pet) {
  const pets = getPets();
  pets.push(pet);
  writeStorage(STORAGE.PETS, pets);
}

function getPetsByOwner(email) {
  return getPets().filter((p) => p.owner === email);
}

function getUsers() {
  return readStorage(STORAGE.USERS);
}

function updateUsers(users) {
  writeStorage(STORAGE.USERS, users);
}

/* --- Componente Principal --- */
export default function TutorArea() {
  const navigate = useNavigate();
  const { session, logout } = useAuth();

  const [section, setSection] = useState("dashboard");
  const [pets, setPets] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [userData, setUserData] = useState(null);
  const [petFormVisible, setPetFormVisible] = useState(false);
  
  const [petForm, setPetForm] = useState({
    nome: "",
    tipo: "",
    idade: "",
    porte: "pequeno",
    vacinas: "sim",
    observacoes: "",
  });

  // Verificar sessão e carregar dados
  useEffect(() => {
    if (!session) {
      navigate("/login");
      return;
    }

    if (session.tipo && session.tipo !== "dono") {
      alert("Área restrita para donos de pets.");
      navigate("/");
      return;
    }

    loadAll();
  }, [session]);

  // Carregar todos os dados
  function loadAll() {
    loadPets();
    loadReservas();
    loadProfile();
  }

  function loadPets() {
    if (session?.email) {
      setPets(getPetsByOwner(session.email));
    }
  }

  function loadReservas() {
    if (session?.email) {
      const reqs = getRequests().filter((r) => r.ownerEmail === session.email);
      setReservas(reqs);
    }
  }

  function loadProfile() {
    const users = getUsers();
    const user = users.find((u) => u.email === session?.email);
    setUserData(user || { 
      email: session?.email, 
      nome: session?.nome || "", 
      telefone: "", 
      cidade: "", 
      bio: "" 
    });
  }

  function handleSection(newSection) {
    setSection(newSection);
    if (newSection === "pets") loadPets();
    if (newSection === "reservas") loadReservas();
    if (newSection === "profile") loadProfile();
  }

  function handlePetField(e) {
    const { name, value } = e.target;
    setPetForm((prev) => ({ ...prev, [name]: value }));
  }

  function submitPet(e) {
    e.preventDefault();
    if (!session) return;

    const nome = petForm.nome.trim();
    const tipo = petForm.tipo;
    if (!nome || !tipo) {
      alert("Preencha nome e tipo do pet.");
      return;
    }

    const newPet = {
      id: uid("pet_"),
      owner: session.email,
      nome,
      tipo,
      idade: Number(petForm.idade) || 0,
      porte: tipo === "cachorro" ? petForm.porte : "n/a",
      vacinas: petForm.vacinas,
      observacoes: petForm.observacoes,
      createdAt: new Date().toISOString(),
    };

    addPet(newPet);
    setPetForm({ nome: "", tipo: "", idade: "", porte: "pequeno", vacinas: "sim", observacoes: "" });
    setPetFormVisible(false);
    loadPets();
    alert(`Pet ${nome} cadastrado com sucesso!`);
  }

  function handleProfileSave(e) {
    e.preventDefault();
    if (!session) return;

    const users = getUsers();
    const updatedUsers = users.map(u => 
      u.email === session.email ? { ...u, ...userData } : u
    );
    
    // Se usuário não existe ainda, adiciona
    if (!users.some(u => u.email === session.email)) {
      updatedUsers.push({
        email: session.email,
        ...userData
      });
    }
    
    updateUsers(updatedUsers);
    alert("Perfil atualizado com sucesso!");
  }

  function cancelarReserva(reservaId) {
    if (!confirm("Tem certeza que deseja cancelar esta reserva?")) return;
    
    const reqs = getRequests();
    const updatedReqs = reqs.map(r => 
      r.id === reservaId ? { ...r, status: "Cancelada" } : r
    );
    
    writeStorage(STORAGE.REQS, updatedReqs);
    loadReservas();
    alert("Reserva cancelada com sucesso!");
  }

  // Função de logout
  const handleLogout = () => {
    if (confirm("Deseja sair da sua conta?")) {
      logout();
      navigate("/");
    }
  };

  // Estilos inline para manter consistência
  const styles = {
    dashboardGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "1rem",
      marginBottom: "1.5rem"
    },
    statCard: {
      background: "var(--card)",
      padding: "1.5rem",
      borderRadius: "var(--radius)",
      textAlign: "center",
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
    },
    statNumber: {
      fontSize: "2rem",
      fontWeight: "700",
      color: "var(--accent)",
      margin: "0"
    },
    statLabel: {
      color: "var(--muted)",
      margin: "0.5rem 0 0 0",
      fontSize: "0.9rem"
    },
    petGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
      gap: "1rem"
    },
    petCard: {
      background: "var(--card)",
      padding: "1.2rem",
      borderRadius: "var(--radius)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
      borderLeft: "4px solid var(--brand)"
    }
  };

  // Se não tem sessão, mostrar carregamento
  if (!session) {
    return (
      <PageLayout title="Minha Área">
        <div className="container" style={{ padding: "3rem", textAlign: "center" }}>
          <p>Carregando...</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Minha Área">
      <main className="container" style={{ paddingTop: "1rem", paddingBottom: "2rem" }}>
        {/* Cabeçalho de boas-vindas */}
        <section className="card" style={{ background: "linear-gradient(135deg, var(--brand), #ffd88a)", color: "white", marginBottom: "1rem" }}>
          <h1 style={{ margin: 0 }}>Olá, <span>{session.nome || session.email}</span>! 👋</h1>
          <p style={{ margin: 0, opacity: 0.9 }}>Bem-vindo à sua área personalizada</p>
        </section>

        {/* Dashboard (seção ativa) */}
        {section === "dashboard" && (
          <section className="card" style={{ marginBottom: "1rem" }}>
            {/* Estatísticas */}
            <div style={styles.dashboardGrid}>
              <div style={styles.statCard}>
                <p style={styles.statNumber}>{pets.length}</p>
                <p style={styles.statLabel}>Pets Cadastrados</p>
              </div>
              <div style={styles.statCard}>
                <p style={styles.statNumber}>{reservas.filter(r => r.status === "Aceita").length}</p>
                <p style={styles.statLabel}>Reservas Ativas</p>
              </div>
              <div style={styles.statCard}>
                <p style={styles.statNumber}>{reservas.filter(r => r.status === "Pendente").length}</p>
                <p style={styles.statLabel}>Solicitações Pendentes</p>
              </div>
              <div style={styles.statCard}>
                <p style={styles.statNumber}>{reservas.filter(r => r.status === "Aceita" || r.status === "Concluída").length}</p>
                <p style={styles.statLabel}>Total de Hospedagens</p>
              </div>
            </div>

            {/* Próximas Reservas */}
            <div className="card" style={{ marginTop: "1rem" }}>
              <h3>📅 Próximas Reservas</h3>
              <div id="proximas-reservas">
                {reservas.filter(r => r.status === "Aceita").slice(0, 3).length === 0 ? (
                  <p style={{ color: "var(--muted)", textAlign: "center", padding: "1rem" }}>
                    Nenhuma reserva próxima
                  </p>
                ) : (
                  reservas.filter(r => r.status === "Aceita").slice(0, 3).map(r => (
                    <div key={r.id} className="card small" style={{ marginBottom: "0.5rem" }}>
                      <strong>{r.hostName}</strong>
                      <div>{r.checkin} → {r.checkout}</div>
                      <div>R$ {Number(r.precoEstimado || 0).toFixed(2)}</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Ações Rápidas */}
            <div className="card" style={{ marginTop: "1rem" }}>
              <h3>🚀 Ações Rápidas</h3>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "1rem" }}>
                <button className="btn btn-primary" onClick={() => handleSection("pets")}>
                  🐕 Cadastrar Novo Pet
                </button>
                <button className="btn btn-primary" onClick={() => navigate("/busca")}>
                  🔍 Buscar Anfitriões
                </button>
                <button className="btn" onClick={() => handleSection("reservas")}>
                  📋 Ver Todas as Reservas
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Navegação entre seções */}
        <div className="section-nav" style={{ marginBottom: "1rem" }}>
          <button 
            className={`nav-btn ${section === "dashboard" ? "active" : ""}`} 
            onClick={() => handleSection("dashboard")}
          >
            📊 Dashboard
          </button>
          <button 
            className={`nav-btn ${section === "pets" ? "active" : ""}`} 
            onClick={() => handleSection("pets")}
          >
            🐕 Meus Pets
          </button>
          <button 
            className={`nav-btn ${section === "reservas" ? "active" : ""}`} 
            onClick={() => handleSection("reservas")}
          >
            📅 Minhas Reservas
          </button>
          <button 
            className={`nav-btn ${section === "profile" ? "active" : ""}`} 
            onClick={() => handleSection("profile")}
          >
            👤 Meu Perfil
          </button>
        </div>

        {/* Seção Meus Pets */}
        {section === "pets" && (
          <section className="card" style={{ marginBottom: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h2 style={{ margin: 0 }}>🐕 Meus Pets</h2>
              <button className="btn btn-primary" onClick={() => setPetFormVisible(!petFormVisible)}>
                {petFormVisible ? "Cancelar" : "+ Novo Pet"}
              </button>
            </div>

            {/* Formulário de novo pet */}
            {petFormVisible && (
              <div style={{ marginBottom: "2rem", padding: "1rem", background: "#f8f9fa", borderRadius: "8px" }}>
                <h3>Cadastrar Novo Pet</h3>
                <form id="pet-form" onSubmit={submitPet}>
                  <div className="form-row">
                    <div>
                      <label htmlFor="pet-nome">Nome do pet *</label>
                      <input 
                        id="pet-nome" 
                        name="nome" 
                        required 
                        value={petForm.nome} 
                        onChange={handlePetField} 
                      />
                    </div>
                    <div>
                      <label htmlFor="pet-tipo">Tipo de animal *</label>
                      <select 
                        id="pet-tipo" 
                        name="tipo" 
                        required 
                        value={petForm.tipo} 
                        onChange={handlePetField}
                      >
                        <option value="">Selecione</option>
                        <option value="cachorro">Cachorro</option>
                        <option value="gato">Gato</option>
                        <option value="pássaro">Pássaro</option>
                        <option value="roedor">Roedor</option>
                        <option value="outro">Outro</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div>
                      <label htmlFor="pet-idade">Idade (anos) *</label>
                      <input 
                        id="pet-idade" 
                        name="idade" 
                        type="number" 
                        min="0" 
                        max="30" 
                        required 
                        value={petForm.idade} 
                        onChange={handlePetField} 
                      />
                    </div>
                    <div style={{ display: petForm.tipo === "cachorro" ? "block" : "none" }}>
                      <label htmlFor="pet-porte">Porte (apenas para cães)</label>
                      <select 
                        id="pet-porte" 
                        name="porte" 
                        value={petForm.porte} 
                        onChange={handlePetField}
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
                        name="vacinas" 
                        value={petForm.vacinas} 
                        onChange={handlePetField} 
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
                        name="observacoes" 
                        value={petForm.observacoes} 
                        onChange={handlePetField} 
                        placeholder="Comportamento, cuidados especiais..."
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button className="btn btn-primary" type="submit">Cadastrar Pet</button>
                    <button 
                      className="btn" 
                      type="button" 
                      onClick={() => {
                        setPetFormVisible(false);
                        setPetForm({ nome: "", tipo: "", idade: "", porte: "pequeno", vacinas: "sim", observacoes: "" });
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Lista de Pets */}
            <div id="pets-list">
              {pets.length === 0 ? (
                <div style={{ textAlign: "center", padding: "2rem", color: "var(--muted)" }}>
                  <p>🎯 Você ainda não cadastrou nenhum pet</p>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => setPetFormVisible(true)} 
                    style={{ marginTop: "1rem" }}
                  >
                    Cadastrar Primeiro Pet
                  </button>
                </div>
              ) : (
                <div style={styles.petGrid}>
                  {pets.map(pet => (
                    <div key={pet.id} style={styles.petCard}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h3 style={{ margin: 0 }}>{pet.nome}</h3>
                        <span style={{ background: "var(--accent)", color: "white", padding: "0.2rem 0.6rem", borderRadius: "12px", fontSize: "0.8rem" }}>
                          {pet.tipo}
                        </span>
                      </div>
                      <div style={{ color: "var(--muted)", fontSize: "0.9rem", marginTop: "0.5rem" }}>
                        <div>🏷️ {pet.idade} anos</div>
                        {pet.tipo === "cachorro" && <div>📏 Porte {pet.porte}</div>}
                        <div>💉 Vacinas: {pet.vacinas}</div>
                        {pet.observacoes && <div>📝 {pet.observacoes}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Seção Minhas Reservas */}
        {section === "reservas" && (
          <section className="card" style={{ marginBottom: "1rem" }}>
            <h2>📅 Minhas Reservas</h2>
            <div id="reservas-list">
              {reservas.length === 0 ? (
                <p style={{ color: "var(--muted)", textAlign: "center", padding: "1rem" }}>
                  Nenhuma reserva encontrada
                </p>
              ) : (
                reservas.map(reserva => (
                  <div 
                    key={reserva.id} 
                    className="card" 
                    style={{ 
                      marginBottom: "1rem", 
                      borderLeft: `4px solid ${
                        reserva.status === "Aceita" ? "#4CAF50" : 
                        reserva.status === "Pendente" ? "#FF9800" : 
                        "#F44336"
                      }` 
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: "0 0 0.5rem 0" }}>{reserva.hostName}</h3>
                        <div>📅 {reserva.checkin} → {reserva.checkout} ({reserva.days} diárias)</div>
                        <div>💰 R$ {Number(reserva.precoEstimado || 0).toFixed(2)}</div>
                        <div>
                          Status: <strong style={{ 
                            color: reserva.status === "Aceita" ? "#4CAF50" : 
                            reserva.status === "Pendente" ? "#FF9800" : 
                            "#F44336" 
                          }}>
                            {reserva.status}
                          </strong>
                        </div>
                      </div>
                      {reserva.status === "Pendente" && (
                        <button className="btn" onClick={() => cancelarReserva(reserva.id)}>
                          Cancelar
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {/* Seção Meu Perfil */}
        {section === "profile" && (
          <section className="card">
            <div style={{ maxWidth: "600px" }}>
              <h2>👤 Meu Perfil</h2>
              <form id="profile-form" onSubmit={handleProfileSave}>
                <div className="form-row">
                  <div>
                    <label htmlFor="profile-nome">Nome completo *</label>
                    <input 
                      id="profile-nome" 
                      value={userData?.nome || ""} 
                      onChange={e => setUserData({...userData, nome: e.target.value})} 
                      required 
                    />
                  </div>
                  <div>
                    <label htmlFor="profile-email">E-mail *</label>
                    <input 
                      id="profile-email" 
                      type="email" 
                      value={userData?.email || session?.email || ""} 
                      readOnly 
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div>
                    <label htmlFor="profile-telefone">Telefone</label>
                    <input 
                      id="profile-telefone" 
                      placeholder="(11) 99999-9999" 
                      value={userData?.telefone || ""} 
                      onChange={e => setUserData({...userData, telefone: e.target.value})} 
                    />
                  </div>
                  <div>
                    <label htmlFor="profile-cidade">Cidade</label>
                    <input 
                      id="profile-cidade" 
                      placeholder="Sua cidade" 
                      value={userData?.cidade || ""} 
                      onChange={e => setUserData({...userData, cidade: e.target.value})} 
                    />
                  </div>
                </div>

                <label htmlFor="profile-bio">Sobre mim</label>
                <textarea 
                  id="profile-bio" 
                  placeholder="Conte um pouco sobre você e seus pets..." 
                  rows="4" 
                  value={userData?.bio || ""} 
                  onChange={e => setUserData({...userData, bio: e.target.value})}
                />

                <div className="form-actions">
                  <button className="btn btn-primary" type="submit">
                    Salvar Alterações
                  </button>
                </div>
              </form>
            </div>
          </section>
        )}
      </main>
    </PageLayout>
  );
}