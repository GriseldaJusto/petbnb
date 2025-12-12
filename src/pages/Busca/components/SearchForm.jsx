import { useState } from "react";
import AdvancedFilters from "./AdvancedFilters";

export default function SearchForm() {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <section className="search-panel card">
      <h2>Encontre a hospedagem perfeita para seu pet</h2>

      <form id="search-form">
        {/* Localização */}
        <div className="form-row">
          <div>
            <label htmlFor="f-cidade"> Cidade *</label>
            <input id="f-cidade" placeholder="Ex: São Carlos" required />
          </div>

          <div>
            <label htmlFor="f-bairro"> Bairro (opcional)</label>
            <input id="f-bairro" placeholder="Bairro específico" />
          </div>
        </div>

        {/* Datas */}
        <div className="form-row">
          <div>
            <label htmlFor="f-checkin"> Check-in</label>
            <input id="f-checkin" type="date" />
          </div>

          <div>
            <label htmlFor="f-checkout"> Check-out</label>
            <input id="f-checkout" type="date" />
          </div>
        </div>

        {/* Pet */}
        <div className="form-row">
          <div>
            <label htmlFor="f-tipo-pet"> Tipo de pet</label>
            <select id="f-tipo-pet">
              <option value="">Todos os tipos</option>
              <option value="cachorro"> Cachorro</option>
              <option value="gato"> Gato</option>
              <option value="outro"> Outro</option>
            </select>

            <input
              type="text"
              id="f-outro-tipo"
              placeholder="Especifique o tipo de pet"
              style={{ display: "none", marginTop: "0.5rem" }}
            />
          </div>

          <div>
            <label htmlFor="f-qt-pets"> Quantidade de pets</label>
            <input type="number" id="f-qt-pets" min="1" max="10" defaultValue="1" />
          </div>
        </div>

        {/* Botão de filtros avançados */}
        <div className="filters-toggle">
          <button
            type="button"
            className="btn-link"
            onClick={() => setShowFilters(!showFilters)}
          >
             Filtros avançados
          </button>
        </div>

        {showFilters && <AdvancedFilters />}

        <div className="form-actions" style={{ marginTop: "1rem" }}>
          <button className="btn btn-primary btn-large" type="submit">
             Buscar Anfitriões
          </button>

          <button className="btn" type="button">
             Limpar Filtros
          </button>
        </div>
      </form>
    </section>
  );
}
