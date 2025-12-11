// src/pages/Cadastro.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import "../styles/style.css";
import "../styles/responsivo.css";

export default function Cadastro() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addUser, addPet, addHost, uid } = useData();

  const [tipo, setTipo] = useState("");
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

  // Estados para cadastro do pet (opcional)
  const [pet, setPet] = useState({
    nome: "",
    tipo: "",
    idade: 0,
    vacinas: "sim",
    porte: "pequeno"
  });

  const [mostrarPet, setMostrarPet] = useState(false);
  const [mostrarAnfitriaoCampos, setMostrarAnfitriaoCampos] = useState(false);
  const [petCadastrado, setPetCadastrado] = useState(false);

  // Efeito para mostrar/esconder campos do anfitrião
  useEffect(() => {
    setMostrarAnfitriaoCampos(tipo === "anfitriao");
    setMostrarPet(tipo === "dono");
  }, [tipo]);

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

  const handlePetChange = (e) => {
    const { name, value } = e.target;
    setPet(prev => ({ ...prev, [name]: value }));
  };

  const handleCadastrarPet = () => {
    if (pet.nome && pet.tipo) {
      setPetCadastrado(true);
      alert('Pet cadastrado! Ele será adicionado à sua conta.');
    } else {
      alert('Por favor, preencha pelo menos o nome e tipo do pet.');
    }
  };

  const handlePularPet = () => {
    setMostrarPet(false);
    setPetCadastrado(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Criar usuário
    const novoUsuario = {
      id: uid("user"),
      nome: form.nome,
      email: form.email,
      senha: form.senha,
      tipo: tipo,
      dataCadastro: new Date().toISOString()
    };

    // Adicionar usuário
    addUser(novoUsuario);

    // Se for anfitrião, adicionar host
    if (tipo === "anfitriao") {
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
    }

    // Se pet foi cadastrado, adicionar pet
    if (petCadastrado && pet.nome && pet.tipo) {
      const novoPet = {
        id: uid("pet"),
        donoEmail: form.email,
        donoNome: form.nome,
        ...pet,
        foto: "",
        observacoes: pet.observacoes || ""
      };
      addPet(novoPet);
    }

    // Login automático
    login(novoUsuario);

    // Redirecionar
    if (tipo === "anfitriao") {
      navigate("/anfitriao/dashboard");
    } else {
      navigate("/tutor");
    }
  };

  // Formatar CEP
  const formatarCEP = (value) => {
    const cep = value.replace(/\D/g, '');
    return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  return (
    <PageLayout> {/* Sem prop title */}
    <main className="container form-page" style={{ marginTop: "1.5rem" }}>
      <section className="card form-card">
        <h2>Criar conta</h2>
        <form id="cadastro-form" onSubmit={handleSubmit}>
          {/* Campos básicos */}
          <label htmlFor="nome">Nome completo</label>
          <input 
            id="nome" 
            name="nome" 
            required 
            value={form.nome} 
            onChange={handleChange}
            placeholder="Seu nome completo"
          />

          <label htmlFor="emailCad">E-mail</label>
          <input 
            id="emailCad" 
            name="email" 
            type="email" 
            required 
            value={form.email} 
            onChange={handleChange}
            placeholder="seu@email.com"
          />

          <label htmlFor="senhaCad">Senha</label>
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

          <label htmlFor="tipo">Na plataforma, eu sou:</label>
          <select 
            id="tipo" 
            required 
            value={tipo} 
            onChange={(e) => setTipo(e.target.value)}
          >
            <option value="">Selecione</option>
            <option value="dono">Tutor de pet</option>
            <option value="anfitriao">Anfitrião</option>
          </select>

          {/* Campos do anfitrião */}
          {mostrarAnfitriaoCampos && (
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
          )}

          {/* Cadastro opcional do primeiro pet (apenas para donos) */}
          {mostrarPet && !petCadastrado && (
            <div id="primeiro-pet-campos" style={{ 
              marginTop: "1.5rem", 
              padding: "1rem", 
              background: "#f8f9fa", 
              borderRadius: "8px" 
            }}>
              <h3 style={{ marginTop: 0 }}>🎉 Cadastrar seu primeiro pet (opcional)</h3>
              <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "1rem" }}>
                Você pode cadastrar seu pet agora ou depois na sua área pessoal.
              </p>
              
              <div className="form-row">
                <div>
                  <label htmlFor="pet-nome-cadastro">Nome do pet</label>
                  <input 
                    id="pet-nome-cadastro" 
                    name="nome" 
                    placeholder="ex: Rex, Luna..." 
                    value={pet.nome} 
                    onChange={handlePetChange}
                  />
                </div>
                <div>
                  <label htmlFor="pet-tipo-cadastro">Tipo de animal</label>
                  <select 
                    id="pet-tipo-cadastro" 
                    name="tipo" 
                    value={pet.tipo} 
                    onChange={handlePetChange}
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
                  <label htmlFor="pet-idade-cadastro">Idade (anos)</label>
                  <input 
                    id="pet-idade-cadastro" 
                    name="idade" 
                    type="number" 
                    min="0" 
                    max="30" 
                    placeholder="ex: 2" 
                    value={pet.idade} 
                    onChange={handlePetChange}
                  />
                </div>
                <div>
                  <label htmlFor="pet-vacinas-cadastro">Vacinas em dia?</label>
                  <select 
                    id="pet-vacinas-cadastro" 
                    name="vacinas" 
                    value={pet.vacinas} 
                    onChange={handlePetChange}
                  >
                    <option value="sim">Sim</option>
                    <option value="não">Não</option>
                    <option value="parcial">Parcialmente</option>
                  </select>
                </div>
              </div>

              <div className="form-actions" style={{ justifyContent: "flex-start", gap: "1rem" }}>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={handleCadastrarPet}
                >
                  Cadastrar este pet
                </button>
                <button 
                  type="button" 
                  className="btn" 
                  onClick={handlePularPet}
                >
                  Pular por enquanto
                </button>
              </div>
            </div>
          )}

          {/* Mensagem de pet cadastrado */}
          {petCadastrado && (
            <div style={{ 
              marginTop: "1rem", 
              padding: "1rem", 
              background: "#d4edda", 
              color: "#155724",
              borderRadius: "8px",
              border: "1px solid #c3e6cb"
            }}>
              ✅ Pet cadastrado com sucesso! Ele será adicionado à sua conta.
            </div>
          )}

          <div className="form-actions">
            <button className="btn btn-primary" type="submit">Criar conta</button>
            <button 
              type="button" 
              className="btn" 
              onClick={() => navigate("/login")}
            >
              Já tenho conta
            </button>
          </div>
        </form>
        <p className="note" style={{ marginTop: "1rem", fontSize: "0.9rem", color: "var(--muted)" }}>
          As contas são salvas no localStorage apenas para demonstração.
        </p>
      </section>
    </main>
    </PageLayout>
  );
}