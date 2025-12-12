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
      {}
      
      {}
      
      {}
      <Header />
      
      {}
      
      {/* Conteúdo principal */}
      <main style={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column"
      }}>
        {/* Título da página */}
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
