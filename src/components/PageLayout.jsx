// src/components/PageLayout.jsx
import { useNavigate, Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import "../styles/style.css";

export default function PageLayout({ children, title }) {
  const navigate = useNavigate();

  return (
    <div className="page-container" style={{
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh"
    }}>
      {/* 
        REMOVA ESTE HEADER SEPARADO - O Header já é um componente completo
        Se você quer manter a barra amarela com seta, logo e home, 
        você precisa integrá-la ao componente Header
      */}
      
      {/* 
        ATENÇÃO: Você tem duas opções:
        
        OPÇÃO 1: Usar apenas o Header que você já tem (recomendado)
        OPÇÃO 2: Manter a barra amarela como parte do PageLayout
        
        Vou mostrar as duas opções:
      */}
      
      {/*
        ============================================
        OPÇÃO 1: APENAS O HEADER PADRÃO (RECOMENDADO)
        ============================================
      */}
      <Header />
      
      {/*
        ============================================
        OPÇÃO 2: SE VOCÊ QUER MANTER A BARRA AMARELA 
        (mas terá duplicação com o Header)
        ============================================
      
      <div style={{
        background: "#ffb703",
        padding: "10px 0",
        borderBottom: "1px solid #e0e0e0",
        flexShrink: 0
      }}>
        <div className="container" style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              color: "#333"
            }}
          >
            ←
          </button>

          <Link to="/" style={{ display: "flex", alignItems: "center" }}>
            <img 
              src="/logoBranca.png" 
              alt="Petbnb" 
              style={{ 
                height: "40px",
                filter: "brightness(0) saturate(100%)"
              }} 
            />
          </Link>

          <Link 
            to="/" 
            style={{
              background: "#219EBC",
              color: "white",
              padding: "8px 16px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            🏠 Home
          </Link>
        </div>
      </div>
      */}
      
      {/* Conteúdo principal */}
      <main style={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column"
      }}>
        {/* Título da página (opcional) */}
        {title && (
          <div className="container" style={{ marginTop: "1rem" }}>
            <h1>{title}</h1>
          </div>
        )}
        
        {/* Conteúdo da página */}
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}