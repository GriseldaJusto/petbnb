import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);

  // Carregar sessão salva
  useEffect(() => {
    const saved = localStorage.getItem("session");
    if (saved) setSession(JSON.parse(saved));
  }, []);

function login(email, senha) {
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const found = users.find(
    (u) => u.email === email && u.senha === senha
  );

  if (!found) {
    return null; // login falhou
  }

  // salvar sessão
  localStorage.setItem("session", JSON.stringify(found));
  setSession(found);

  return found; // <-- retorna o usuário completo
}
    

  function logout() {
    localStorage.removeItem("session");
    setSession(null);
  }

  return (
    <AuthContext.Provider value={{ session, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
