export default function AdvancedFilters() {
  return (
    <div id="advanced-filters" style={{ marginTop: "1rem" }}>
      
      {/* Porte */}
      <div className="filter-group">
        <label> Porte do pet</label>
        <div className="checkbox-group">
          <label className="checkbox-label">
            <input type="checkbox" value="pequeno" />
            <span> Pequeno (até 10kg)</span>
          </label>
          <label className="checkbox-label">
            <input type="checkbox" value="médio" />
            <span> Médio (10-25kg)</span>
          </label>
          <label className="checkbox-label">
            <input type="checkbox" value="grande" />
            <span> Grande (acima de 25kg)</span>
          </label>
        </div>
      </div>

      {/* Tipo de hospedagem */}
      <div className="filter-group">
        <label> Tipo de hospedagem</label>
        <div className="checkbox-group">
          <label className="checkbox-label">
            <input type="checkbox" value="casa" />
            <span> Casa com quintal</span>
          </label>
          <label className="checkbox-label">
            <input type="checkbox" value="apartamento" />
            <span> Apartamento</span>
          </label>
          <label className="checkbox-label">
            <input type="checkbox" value="sítio" />
            <span> Sítio/Chácara</span>
          </label>
        </div>
      </div>

      {/* Serviços */}
      <div className="filter-group">
        <label> Serviços incluídos</label>
        <div className="checkbox-group">
          <label className="checkbox-label">
            <input type="checkbox" value="banho" />
            <span> Banho e tosa</span>
          </label>
          <label className="checkbox-label">
            <input type="checkbox" value="veterinario" />
            <span> Veterinário próximo</span>
          </label>
          <label className="checkbox-label">
            <input type="checkbox" value="emergencia" />
            <span> Plantão 24h</span>
          </label>
          <label className="checkbox-label">
            <input type="checkbox" value="atualizacoes" />
            <span> Atualizações diárias</span>
          </label>
        </div>
      </div>

      {/* Faixa de preço */}
      <div className="filter-group">
        <label htmlFor="f-preco"> Preço por diária</label>
        <div className="price-range">
          <span>R$ 10</span>
          <input type="range" id="f-preco" min="10" max="200" defaultValue="50" />
          <span>R$ 200</span>
          <div className="price-selected">
            Até R$ <span id="price-value">50</span>
          </div>
        </div>
      </div>

      {/* Experiência */}
      <div className="filter-group">
        <label> Experiência do anfitrião</label>
        <div className="checkbox-group">
          <label className="checkbox-label">
            <input type="checkbox" value="veterinario" />
            <span> Veterinário</span>
          </label>
          <label className="checkbox-label">
            <input type="checkbox" value="adestrador" />
            <span> Adestrador</span>
          </label>
          <label className="checkbox-label">
            <input type="checkbox" value="experiente" />
            <span> 5+ anos de experiência</span>
          </label>
        </div>
      </div>
    </div>
  );
}
