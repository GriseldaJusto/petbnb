import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/PageLayout";
import "../../styles/style.css";
import "../../styles/responsivo.css";
import "./Busca.css";

export default function Busca() {
  const navigate = useNavigate();

  // Estados principais do formulário
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [qtPets, setQtPets] = useState(1);
  const [tipoPet, setTipoPet] = useState("");
  const [outroTipo, setOutroTipo] = useState("");
  const [price, setPrice] = useState(50);
  
  // Estados para os filtros avançados
  const [porte, setPorte] = useState({
    pequeno: false,
    medio: false,
    grande: false
  });
  
  const [tipoHospedagem, setTipoHospedagem] = useState({
    casa: false,
    apartamento: false,
    sitio: false
  });
  
  const [servicos, setServicos] = useState({
    banho: false,
    veterinario: false,
    emergencia: false,
    atualizacoes: false
  });
  
  const [experiencia, setExperiencia] = useState({
    veterinario: false,
    adestrador: false,
    experiente: false
  });

  // Resultados
  const [resultados, setResultados] = useState([]);

  // Mock dos anfitriões
  const MOCK_ANFITRIOES = [
    { 
      id: 1, 
      nome: "Ana Paula", 
      cidade: "São Paulo", 
      preco: 45, 
      avaliacao: 4.9, 
      foto: "https://placekitten.com/300/200",
      porteAceito: ["pequeno", "medio"],
      tipoHospedagem: "casa",
      servicos: ["banho", "atualizacoes"],
      experiencia: ["experiente"]
    },
    { 
      id: 2, 
      nome: "Carlos Silva", 
      cidade: "Rio de Janeiro", 
      preco: 60, 
      avaliacao: 4.7, 
      foto: "https://placekitten.com/305/200",
      porteAceito: ["pequeno", "medio", "grande"],
      tipoHospedagem: "apartamento",
      servicos: ["veterinario", "emergencia"],
      experiencia: ["veterinario"]
    },
    { 
      id: 3, 
      nome: "Mariana Torres", 
      cidade: "Belo Horizonte", 
      preco: 50, 
      avaliacao: 5.0, 
      foto: "https://placekitten.com/310/200",
      porteAceito: ["medio"],
      tipoHospedagem: "sitio",
      servicos: ["banho", "veterinario", "emergencia", "atualizacoes"],
      experiencia: ["adestrador", "experiente"]
    },
  ];

  function doSearch(e) {
    e?.preventDefault();
    
    // Converter estados de checkbox para arrays
    const portesSelecionados = Object.keys(porte).filter(key => porte[key]);
    const tiposSelecionados = Object.keys(tipoHospedagem).filter(key => tipoHospedagem[key]);
    const servicosSelecionados = Object.keys(servicos).filter(key => servicos[key]);
    const experienciasSelecionadas = Object.keys(experiencia).filter(key => experiencia[key]);
    
    const found = MOCK_ANFITRIOES.filter(h => {
      // Filtro por cidade e preço
      const filtroCidadePreco = h.cidade.toLowerCase().includes(cidade.toLowerCase()) && h.preco <= price;
      
      // Filtro por porte (se algum porte foi selecionado)
      const filtroPorte = portesSelecionados.length === 0 || 
                         portesSelecionados.some(p => h.porteAceito.includes(p));
      
      // Filtro por tipo de hospedagem
      const filtroTipoHospedagem = tiposSelecionados.length === 0 || 
                                  tiposSelecionados.includes(h.tipoHospedagem);
      
      // Filtro por serviços
      const filtroServicos = servicosSelecionados.length === 0 || 
                            servicosSelecionados.every(s => h.servicos.includes(s));
      
      // Filtro por experiência
      const filtroExperiencia = experienciasSelecionadas.length === 0 || 
                               experienciasSelecionadas.some(e => h.experiencia.includes(e));
      
      return filtroCidadePreco && filtroPorte && filtroTipoHospedagem && filtroServicos && filtroExperiencia;
    });

    setResultados(found);
  }

  // Funções para lidar com checkboxes
  const handlePorteChange = (tipo) => {
    setPorte(prev => ({
      ...prev,
      [tipo]: !prev[tipo]
    }));
  };

  const handleTipoHospedagemChange = (tipo) => {
    setTipoHospedagem(prev => ({
      ...prev,
      [tipo]: !prev[tipo]
    }));
  };

  const handleServicosChange = (servico) => {
    setServicos(prev => ({
      ...prev,
      [servico]: !prev[servico]
    }));
  };

  const handleExperienciaChange = (exp) => {
    setExperiencia(prev => ({
      ...prev,
      [exp]: !prev[exp]
    }));
  };

  // Função para limpar todos os filtros
  const limparFiltros = () => {
    setCidade("");
    setBairro("");
    setResultados([]);
    setQtPets(1);
    setTipoPet("");
    setOutroTipo("");
    setPrice(50);
    setMostrarFiltros(false);
    
    // Limpar todos os checkboxes
    setPorte({ pequeno: false, medio: false, grande: false });
    setTipoHospedagem({ casa: false, apartamento: false, sitio: false });
    setServicos({ banho: false, veterinario: false, emergencia: false, atualizacoes: false });
    setExperiencia({ veterinario: false, adestrador: false, experiente: false });
  };

  return (
  <PageLayout> {/* Sem prop title */}
    <div className="container" style={{ marginTop: "1.5rem" }}>
      {/* PAINEL DE BUSCA */}
      <section className="search-panel card">
        <h2>Encontre a hospedagem perfeita para seu pet</h2>

        <form id="search-form" onSubmit={doSearch}>
          {/* Localização */}
          <div className="form-row">
            <div>
              <label htmlFor="f-cidade">📍 Cidade *</label>
              <input
                id="f-cidade"
                placeholder="Ex: São Carlos"
                required
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="f-bairro">🏘️ Bairro (opcional)</label>
              <input
                id="f-bairro"
                placeholder="Bairro específico"
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
              />
            </div>
          </div>

          {/* Datas */}
          <div className="form-row">
            <div>
              <label htmlFor="f-checkin">📅 Check-in</label>
              <input 
                id="f-checkin" 
                type="date" 
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <label htmlFor="f-checkout">📅 Check-out</label>
              <input 
                id="f-checkout" 
                type="date" 
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          {/* Tipo de pet */}
          <div className="form-row">
            <div>
              <label htmlFor="f-tipo-pet">🐾 Tipo de pet</label>
              <select
                id="f-tipo-pet"
                value={tipoPet}
                onChange={(e) => {
                  setTipoPet(e.target.value);
                  if (e.target.value !== "outro") {
                    setOutroTipo("");
                  }
                }}
              >
                <option value="">Todos os tipos</option>
                <option value="cachorro">🐕 Cachorro</option>
                <option value="gato">🐈 Gato</option>
                <option value="outro">🐾 Outro</option>
              </select>

              {tipoPet === "outro" && (
                <input
                  type="text"
                  id="f-outro-tipo"
                  placeholder="Especifique o tipo de pet"
                  style={{ marginTop: "0.5rem", width: "100%" }}
                  value={outroTipo}
                  onChange={(e) => setOutroTipo(e.target.value)}
                />
              )}
            </div>

            <div>
              <label htmlFor="f-qt-pets">🔢 Quantidade de pets</label>
              <div className="number-input">
                <input
                  type="number"
                  id="f-qt-pets"
                  min="1"
                  max="10"
                  value={qtPets}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value >= 1 && value <= 10) {
                      setQtPets(value);
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Botão para mostrar filtros avançados */}
          <div className="filters-toggle">
            <button
              type="button"
              id="toggle-filters"
              className="btn-link"
              onClick={() => setMostrarFiltros((v) => !v)}
            >
              {mostrarFiltros ? "🔍 Ocultar filtros avançados" : "🔍 Filtros avançados"}
            </button>
          </div>

          {/* FILTROS AVANÇADOS */}
          {mostrarFiltros && (
            <div id="advanced-filters" style={{ marginTop: "1rem" }}>
              {/* Porte do Pet */}
              <div className="filter-group">
                <label>📏 Porte do pet</label>
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="porte"
                      value="pequeno"
                      checked={porte.pequeno}
                      onChange={() => handlePorteChange("pequeno")}
                    />
                    <span>🐕 Pequeno (até 10kg)</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="porte"
                      value="médio"
                      checked={porte.medio}
                      onChange={() => handlePorteChange("medio")}
                    />
                    <span>🐕‍🦺 Médio (10-25kg)</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="porte"
                      value="grande"
                      checked={porte.grande}
                      onChange={() => handlePorteChange("grande")}
                    />
                    <span>🦮 Grande (acima de 25kg)</span>
                  </label>
                </div>
              </div>

              {/* Tipo de Hospedagem */}
              <div className="filter-group">
                <label>🏠 Tipo de hospedagem</label>
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="tipo-hospedagem"
                      value="casa"
                      checked={tipoHospedagem.casa}
                      onChange={() => handleTipoHospedagemChange("casa")}
                    />
                    <span>🏠 Casa com quintal</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="tipo-hospedagem"
                      value="apartamento"
                      checked={tipoHospedagem.apartamento}
                      onChange={() => handleTipoHospedagemChange("apartamento")}
                    />
                    <span>🏢 Apartamento</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="tipo-hospedagem"
                      value="sítio"
                      checked={tipoHospedagem.sitio}
                      onChange={() => handleTipoHospedagemChange("sitio")}
                    />
                    <span>🌳 Sítio/Chácara</span>
                  </label>
                </div>
              </div>

              {/* Serviços Adicionais */}
              <div className="filter-group">
                <label>⭐ Serviços incluídos</label>
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="servicos"
                      value="banho"
                      checked={servicos.banho}
                      onChange={() => handleServicosChange("banho")}
                    />
                    <span>🛁 Banho e tosa</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="servicos"
                      value="veterinario"
                      checked={servicos.veterinario}
                      onChange={() => handleServicosChange("veterinario")}
                    />
                    <span>🏥 Veterinário próximo</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="servicos"
                      value="emergencia"
                      checked={servicos.emergencia}
                      onChange={() => handleServicosChange("emergencia")}
                    />
                    <span>🚨 Plantão 24h</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="servicos"
                      value="atualizacoes"
                      checked={servicos.atualizacoes}
                      onChange={() => handleServicosChange("atualizacoes")}
                    />
                    <span>📱 Atualizações diárias</span>
                  </label>
                </div>
              </div>

              {/* Faixa de preço */}
              <div className="filter-group">
                <label htmlFor="f-preco">💰 Preço por diária</label>
                <div className="price-range">
                  <span>R$ 10</span>
                  <input
                    type="range"
                    id="f-preco"
                    min={10}
                    max={200}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="price-slider"
                  />
                  <span>R$ 200</span>
                  <div className="price-selected">
                    Até R$ <span id="price-value">{price}</span>
                  </div>
                </div>
              </div>

              {/* Experiência do Anfitrião */}
              <div className="filter-group">
                <label>🎓 Experiência do anfitrião</label>
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="experiencia"
                      value="veterinario"
                      checked={experiencia.veterinario}
                      onChange={() => handleExperienciaChange("veterinario")}
                    />
                    <span>👨‍⚕️ Veterinário</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="experiencia"
                      value="adestrador"
                      checked={experiencia.adestrador}
                      onChange={() => handleExperienciaChange("adestrador")}
                    />
                    <span>🎾 Adestrador</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="experiencia"
                      value="experiente"
                      checked={experiencia.experiente}
                      onChange={() => handleExperienciaChange("experiente")}
                    />
                    <span>⭐ 5+ anos de experiência</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Ações */}
          <div className="form-actions">
            <button className="btn btn-primary btn-large" type="submit">
              🔍 Buscar Anfitriões
            </button>

            <button
              className="btn"
              id="btn-reset"
              type="button"
              onClick={limparFiltros}
            >
              🗑️ Limpar Filtros
            </button>
          </div>
        </form>
      </section>

      {/* RESULTADOS */}
      <section className="container results-container">
        <h3 id="results-count">
          Encontramos <span id="count">{resultados.length}</span> anfitriões
        </h3>

        <div className="results-grid" id="hosts-list" aria-live="polite">
          {resultados.length === 0 ? (
            <div className="empty-state" style={{ textAlign: "center", padding: "2rem", color: "var(--muted)" }}>
              <p>Nenhum anfitrião encontrado com os filtros selecionados.</p>
              <button
                className="btn btn-primary"
                onClick={limparFiltros}
                style={{ marginTop: "1rem" }}
              >
                Limpar Filtros e Tentar Novamente
              </button>
            </div>
          ) : (
            resultados.map((h) => (
              <article
                key={h.id}
                className="card host-card"
                onClick={() => navigate(`/anfitriao?id=${h.id}`)}
                style={{ cursor: "pointer" }}
              >
                <img src={h.foto} alt={h.nome} className="host-photo" />
                <div className="host-info">
                  <h3 className="host-name">{h.nome}</h3>
                  <p className="host-city">📍 {h.cidade}</p>
                  <p className="host-meta">⭐ {h.avaliacao}</p>
                  <p className="host-price">
                    <strong>R$ {h.preco}/dia</strong>
                  </p>
                  <div className="card-actions">
                    <button
                      className="btn btn-primary host-view"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/anfitriao?id=${h.id}`);
                      }}
                    >
                      Ver perfil
                    </button>
                    <button 
                      className="btn host-request"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Aqui você pode adicionar a lógica para solicitar reserva
                        alert(`Solicitação enviada para ${h.nome}!`);
                      }}
                    >
                      Solicitar
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  </PageLayout>
);
}