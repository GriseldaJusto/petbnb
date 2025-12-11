// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Busca from "./pages/Busca/Busca";
import Anfitriao from "./pages/Anfitriao";
import AnfitriaoDashboard from "./pages/AnfitriaoDashboard";
import AnfitriaoAvaliacoes from "./pages/AnfitriaoAvaliacoes";
import CadastroAnfitriao from "./pages/CadastroAnfitriao";
import Tutor from "./pages/Tutor";
import TutorArea from "./pages/TutorArea";
import Reservas from "./pages/Reservas";
import "./styles/style.css";
import "./styles/responsivo.css";

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Routes>
            <Route path="/seja-anfitriao" element={<CadastroAnfitriao />} />
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/busca" element={<Busca />} />
            <Route path="/anfitriao" element={<Anfitriao />} />
            {/* CORRIJA ESTAS ROTAS: */}
            <Route path="/anfitriao/dashboard" element={<AnfitriaoDashboard />} />
            <Route path="/anfitriao/avaliacoes" element={<AnfitriaoAvaliacoes />} />
            {/* OU mantenha as com hífen e atualize todos os links */}
            <Route path="/tutor" element={<Tutor />} />
            <Route path="/tutor" element={<TutorArea />} />
            <Route path="/reserva" element={<Reservas />} />
          </Routes>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;