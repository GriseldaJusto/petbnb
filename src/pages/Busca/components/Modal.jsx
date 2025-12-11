export default function Modal() {
  return (
    <div
      id="modal"
      className="modal"
      aria-hidden="true"
      style={{ display: "none" }}
    >
      <div className="modal-content card">
        <button className="modal-close" aria-label="Fechar">
          &times;
        </button>
        <div id="modal-body"></div>
      </div>
    </div>
  );
}
