import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import "../styles/style.css";
import "../styles/responsivo.css";
import { AuthContext } from "../context/AuthContext";

// Note: integrate with your AuthContext if you have one.
// For now this is the UI and basic simulation.
export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    const user = login(email, senha);

    if (!user) {
        alert("Usuário ou senha inválidos");
        return;
    }

    // Redirecionamento baseado no tipo
    if (user.tipo === "dono") {
        navigate("/tutor");
    } else if (user.tipo === "anfitriao") {
        navigate("/anfitriao/dashboard");
    } else {
        navigate("/");
    }
}


  return (
    <PageLayout> {/* Sem prop title */}
    <main className="container form-page" style={{ 
        marginTop: "1.5rem", 
        flexGrow: 2, // Ocupa o espaço disponível
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
        }}
    >
      <section className="card form-card" style={{ maxWidth: 520 }}>
        <h2>Entrar</h2>
          <form id="login-form" onSubmit={handleSubmit}>
            <label htmlFor="email">E-mail</label>
            <input 
              id="email" 
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />

            <label htmlFor="senha">Senha</label>
            <input 
              id="senha" 
              type="password" 
              required 
              value={senha} 
              onChange={(e) => setSenha(e.target.value)} 
            />

            <div className="form-actions">
              <button className="btn btn-primary" type="submit">
                Entrar
              </button>
              <Link className="btn" to="/cadastro">
                Criar conta
              </Link>
            </div>
          </form>
          <p className="note">
            Observação: autenticação é simulada (localStorage)
          </p>
        </section>
      </main>
    </PageLayout>
  );
}