export default function HostCard() {
  return (
    <article className="card host-card">
      <img className="host-photo" alt="foto do anfitrião" />

      <div className="host-info">
        <h3 className="host-name">Nome do Anfitrião</h3>
        <p className="host-city">Cidade - Estado</p>
        <p className="host-meta">Descrição curta</p>
        <p className="host-price">R$ 00,00 / diária</p>

        <div className="card-actions">
          <button className="btn btn-primary">Ver perfil</button>
          <button className="btn">Solicitar</button>
        </div>
      </div>
    </article>
  );
}
