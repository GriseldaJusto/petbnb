import { createContext, useContext, useEffect, useState } from "react";

const DataContext = createContext();

export function DataProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [pets, setPets] = useState([]);
  const [requests, setRequests] = useState([]);
  const [hosts, setHosts] = useState([]);

  // Carregar localStorage ao iniciar
  useEffect(() => {
    setUsers(JSON.parse(localStorage.getItem("users")) || []);
    setPets(JSON.parse(localStorage.getItem("pets")) || []);
    setRequests(JSON.parse(localStorage.getItem("requests")) || []);
    setHosts(JSON.parse(localStorage.getItem("hosts")) || []);
  }, []);

  // Helpers de escrita
  function saveLS(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function getRequests() {
  return requests;
  }


  // UID
  function uid(prefix = "id") {
    return prefix + "_" + Math.random().toString(36).substring(2, 10);
  }

  // USUÁRIOS
  function addUser(user) {
    const list = [...users, user];
    setUsers(list);
    saveLS("users", list);
  }

  function updateUser(email, data) {
    const updated = users.map(u => 
      u.email === email ? { ...u, ...data } : u
    );
    setUsers(updated);
    saveLS("users", updated);
  }

  // PETS
  function addPet(pet) {
    const list = [...pets, pet];
    setPets(list);
    saveLS("pets", list);
  }

  function getPetsByOwner(ownerEmail) {
    return pets.filter(p => p.owner === ownerEmail);
  }

  // RESERVAS / REQUESTS
  function addRequest(req) {
    const list = [...requests, req];
    setRequests(list);
    saveLS("requests", list);
  }

  function updateRequest(id, data) {
    const list = requests.map(r =>
      r.id === id ? { ...r, ...data } : r
    );
    setRequests(list);
    saveLS("requests", list);
  }

  // HOSTS
  function addHost(host) {
    const list = [...hosts, host];
    setHosts(list);
    saveLS("hosts", list);
  }

  function getHostByEmail(email) {
    return hosts.find(h => h.email === email);
  }

  return (
    <DataContext.Provider value={{
      users, pets, requests, hosts,
      addUser, updateUser,
      addPet, getPetsByOwner,
      addRequest, updateRequest,
      addHost, getHostByEmail,
      uid,
      getRequests
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
