// src/pages/CadastroAnfitriao.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import "../styles/style.css";
import "../styles/responsivo.css";

export default function CadastroAnfitriao() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addUser, addHost, uid } = useData();

  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: ""
  });

  // Estados para campos do anfitrião
  const [anfitriao, setAnfitriao] = useState({
    cep: "",
    tipoMoradia: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    preco: 10,
    capacidade: 1,
    portes: []
  });

  // Função para buscar CEP via API
  const buscarCep = async (cep) => {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();
      if (!data.erro) {
        setAnfitriao(prev => ({
          ...prev,
          rua: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
          estado: data.uf
        }));
      } else {
        alert('CEP não encontrado');
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      alert('Erro ao buscar CEP');
    }
  };

  // Handlers
  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAnfitriaoChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "cep") {
      setAnfitriao(prev => ({ ...prev, [name]: value }));
      // Busca automática quando CEP tem 8 dígitos
      if (value.replace(/\D/g, '').length === 8) {
        buscarCep(value);
      }
    } else {
      setAnfitriao(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePorteChange = (e) => {
    const { value, checked } = e.target;
    let novosPortes = [...anfitriao.portes];
    
    if (checked) {
      novosPortes.push(value);
    } else {
      novosPortes = novosPortes.filter(porte => porte !== value);
    }
    
    setAnfitriao(prev => ({ ...prev, portes: novosPortes }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Criar usuário
    const novoUsuario = {
      id: uid("user"),
      nome: form.nome,
      email: form.email,
      senha: form.senha,
      tipo: "anfitriao", // SEMPRE anfitrião nesta página
      dataCadastro: new Date().toISOString()
    };

    // Adicionar usuário
    addUser(novoUsuario);

    // Adicionar host
    const novoHost = {
      id: uid("host"),
      userId: novoUsuario.id,
      nome: form.nome,
      email: form.email,
      ...anfitriao,
      servicos: [],
      experiencias: [],
      disponibilidade: true,
      avaliacao: 0,
      totalAvaliacoes: 0
    };
    addHost(novoHost);

    // Login automático
    login(novoUsuario);

    // Redirecionar
    navigate("/anfitriao/dashboard");
  };

  return (
    <PageLayout> {/* Sem prop title */}
      <main className="container form-page" style={{ marginTop: "1.5rem" }}>
        <section className="card form-card">
          <h2>Seja um Anfitrião</h2>
          <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>
            Cadastre-se para oferecer hospedagem para pets e gerar renda extra.
          </p>
          
          <form id="cadastro-anfitriao-form" onSubmit={handleSubmit}>
            {/* Campos básicos */}
            <label htmlFor="nome">Nome completo *</label>
            <input 
              id="nome" 
              name="nome" 
              required 
              value={form.nome} 
              onChange={handleChange}
              placeholder="Seu nome completo"
            />

            <label htmlFor="emailCad">E-mail *</label>
            <input 
              id="emailCad" 
              name="email" 
              type="email" 
              required 
              value={form.email} 
              onChange={handleChange}
              placeholder="seu@email.com"
            />

            <label htmlFor="senhaCad">Senha *</label>
            <input 
              id="senhaCad" 
              name="senha" 
              type="password" 
              minLength={6} 
              required 
              value={form.senha} 
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
            />

            {/* Campos do anfitrião */}
            <div id="anfitriao-campos" style={{ marginTop: "2rem" }}>
              <h3>📍 Endereço da Hospedagem</h3>
              
              <div className="form-row">
                <div>
                  <label htmlFor="cep">CEP *</label>
                  <input 
                    id="cep" 
                    name="cep" 
                    type="text" 
                    placeholder="00000-000" 
                    maxLength={9} 
                    value={anfitriao.cep} 
                    onChange={handleAnfitriaoChange}
                    required 
                  />
                  <small style={{ color: "var(--muted)", fontSize: "0.8rem" }}>
                    Digite o CEP para preencher automaticamente
                  </small>
                </div>
                <div>
                  <label htmlFor="tipo-moradia">Tipo de Moradia *</label>
                  <select 
                    id="tipo-moradia" 
                    name="tipoMoradia" 
                    value={anfitriao.tipoMoradia} 
                    onChange={handleAnfitriaoChange}
                    required
                  >
                    <option value="">Selecione</option>
                    <option value="casa">Casa</option>
                    <option value="apartamento">Apartamento</option>
                    <option value="sítio">Sítio</option>
                    <option value="chácara">Chácara</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div>
                  <label htmlFor="rua">Rua *</label>
                  <input 
                    id="rua" 
                    name="rua" 
                    value={anfitriao.rua} 
                    readOnly 
                    required 
                  />
                </div>
                <div>
                  <label htmlFor="numero">Número *</label>
                  <input 
                    id="numero" 
                    name="numero" 
                    type="number" 
                    min="1" 
                    value={anfitriao.numero} 
                    onChange={handleAnfitriaoChange}
                    required 
                  />
                </div>
              </div>

              <div className="form-row">
                <div>
                  <label htmlFor="complemento">Complemento</label>
                  <input 
                    id="complemento" 
                    name="complemento" 
                    placeholder="Apto, Bloco, etc." 
                    value={anfitriao.complemento} 
                    onChange={handleAnfitriaoChange}
                  />
                </div>
                <div>
                  <label htmlFor="bairro">Bairro *</label>
                  <input 
                    id="bairro" 
                    name="bairro" 
                    value={anfitriao.bairro} 
                    readOnly 
                    required 
                  />
                </div>
              </div>

              <div className="form-row">
                <div>
                  <label htmlFor="cidade">Cidade *</label>
                  <input 
                    id="cidade" 
                    name="cidade" 
                    value={anfitriao.cidade} 
                    readOnly 
                    required 
                  />
                </div>
                <div>
                  <label htmlFor="estado">Estado *</label>
                  <input 
                    id="estado" 
                    name="estado" 
                    value={anfitriao.estado} 
                    readOnly 
                    required 
                  />
                </div>
              </div>

              <h3 style={{ marginTop: "2rem" }}>💰 Informações da Hospedagem</h3>

              <div className="form-row">
                <div>
                  <label htmlFor="preco">Preço por diária (R$) *</label>
                  <input 
                    id="preco" 
                    name="preco" 
                    type="number" 
                    min="10" 
                    step="1" 
                    value={anfitriao.preco} 
                    onChange={handleAnfitriaoChange}
                    required 
                  />
                  <small style={{ color: "var(--muted)", fontSize: "0.8rem" }}>
                    Valor mínimo: R$ 10,00
                  </small>
                </div>
                <div>
                  <label htmlFor="capacidade">Capacidade máxima *</label>
                  <input 
                    id="capacidade" 
                    name="capacidade" 
                    type="number" 
                    min="1" 
                    value={anfitriao.capacidade} 
                    onChange={handleAnfitriaoChange}
                    required 
                  />
                  <small style={{ color: "var(--muted)", fontSize: "0.8rem" }}>
                    Número máximo de pets simultâneos
                  </small>
                </div>
              </div>

              <div className="form-row">
                <div>
                  <label>Portes aceitos *</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.5rem" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <input 
                        type="checkbox" 
                        name="portes" 
                        value="pequeno" 
                        checked={anfitriao.portes.includes("pequeno")}
                        onChange={handlePorteChange}
                      /> 
                      <span>🐕 Pequeno (até 10kg)</span>
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <input 
                        type="checkbox" 
                        name="portes" 
                        value="médio" 
                        checked={anfitriao.portes.includes("médio")}
                        onChange={handlePorteChange}
                      /> 
                      <span>🐕‍🦺 Médio (10-25kg)</span>
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <input 
                        type="checkbox" 
                        name="portes" 
                        value="grande" 
                        checked={anfitriao.portes.includes("grande")}
                        onChange={handlePorteChange}
                      /> 
                      <span>🦮 Grande (acima de 25kg)</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button className="btn btn-primary" type="submit">
                Cadastrar como Anfitrião
              </button>
              <button 
                type="button" 
                className="btn" 
                onClick={() => navigate("/login")}
              >
                Já tenho conta
              </button>
            </div>
          </form>
          
          <div style={{ marginTop: "1.5rem", padding: "1rem", background: "#f8f9fa", borderRadius: "8px" }}>
            <h4 style={{ marginTop: 0 }}>📋 Como funciona?</h4>
            <ul style={{ marginBottom: 0 }}>
              <li>Você cadastra seu espaço e define seu preço</li>
              <li>Tutores encontram você através da busca</li>
              <li>Recebe solicitações de reserva</li>
              <li>Aceita ou recusa conforme sua disponibilidade</li>
              <li>Recebe pagamento após a hospedagem</li>
            </ul>
          </div>
          
          <p className="note" style={{ marginTop: "1rem", fontSize: "0.9rem", color: "var(--muted)" }}>
            As contas são salvas no localStorage apenas para demonstração.
          </p>
        </section>
      </main>
    </PageLayout>
  );
}