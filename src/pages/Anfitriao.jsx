// src/pages/Anfitriao.jsx
import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import "../styles/style.css";
import "../styles/responsivo.css";

export default function Anfitriao() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const id = params.get("id");

  const [host, setHost] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalBody, setModalBody] = useState(null);

  // Dados mockados — você pode substituir pelo contexto futuramente
  const MOCK = [
    {
      id: "1",
      name: "Ana Paula",
      city: "São Paulo",
      state: "SP",
      price: 45,
      description: "Cuido de pets com muito carinho em um ambiente seguro.",
      services: "Banho, Passeio, Cuidados especiais",
      photo: ""
    },
    {
      id: "2",
      name: "Carlos Silva",
      city: "Rio de Janeiro",
      state: "RJ",
      price: 60,
      description: "Casa com quintal grande, perfeita para cães ativos.",
      services: "Passeio, Supervisão veterinária",
      photo: ""
    }
  ];

  useEffect(() => {
    const found = MOCK.find((h) => h.id === id) || MOCK[0];
    setHost(found);
  }, [id]);

  function openModal(content) {
    setModalBody(content);
    setModalOpen(true);
  }

  return (
    <main className="container" style={{ marginTop: "1.5rem" }}>
      <section id="host-detail" className="card">
        {!host ? (
          <div className="empty-state">
            <p>Host não encontrado.</p>
            <Link to="/busca" className="btn btn-primary" style={{ marginTop: "1rem" }}>
              Voltar
            </Link>
          </div>
        ) : (
          <>
            {/* Header com foto + nome + preço */}
            <div
              style={{
                display: "flex",
                gap: "1.2rem",
                alignItems: "center",
                flexWrap: "wrap"
              }}
            >
              {/* Foto */}
              <div
                style={{
                  width: 140,
                  height: 140,
                  borderRadius: 12,
                  overflow: "hidden",
                  flex: "0 0 140px"
                }}
              >
                {host.photo ? (
                  <img
                    src={host.photo}
                    alt={host.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                  />
                ) : (
                  <div
                    style={{
                      background: "var(--brand)",
                      color: "white",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 32
                    }}
                  >
                    {host.name[0]}
                  </div>
                )}
              </div>

              {/* Informações */}
              <div style={{ flex: 1 }}>
                <h1 style={{ margin: 0 }}>{host.name}</h1>
                <div style={{ color: "var(--muted)", marginTop: 6 }}>
                  {host.city} • {host.state}
                </div>

                <div style={{ marginTop: 10 }}>
                  <strong className="host-price">R$ {host.price}/noite</strong>
                </div>

                <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      openModal(
                        <div>
                          <h3>Solicitar hospedagem</h3>
                          <p>Formulário será implementado depois.</p>
                        </div>
                      )
                    }
                  >
                    Solicitar
                  </button>

                  <Link to="/busca" className="btn">
                    Voltar
                  </Link>
                </div>
              </div>
            </div>

            <hr style={{ margin: "1rem 0" }} />

            {/* Seções */}
            <div>
              <h3>Sobre o espaço</h3>
              <p style={{ color: "var(--muted)" }}>
                {host.description || "Descrição não informada."}
              </p>

              <h4 style={{ marginTop: 12 }}>Serviços</h4>
              <p style={{ color: "var(--muted)" }}>
                {host.services || "Nenhum serviço listado."}
              </p>

              <h4 style={{ marginTop: 12 }}>Avaliações</h4>
              <p style={{ color: "var(--muted)" }}>
                As avaliações serão exibidas aqui futuramente.
              </p>
            </div>
          </>
        )}
      </section>

      {/* Modal */}
      {modalOpen && (
        <div id="modal" className="modal" aria-hidden="false" style={{ display: "block" }}>
          <div className="modal-content card">
            <button
              className="modal-close"
              aria-label="Fechar"
              onClick={() => setModalOpen(false)}
            >
              &times;
            </button>
            <div id="modal-body">{modalBody}</div>
          </div>
        </div>
      )}
    </main>
  );
}
