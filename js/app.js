

/* ---------- Helpers ---------- */
const STORAGE = {
  USERS: 'petbnb_users',
  HOSTS: 'petbnb_hosts',
  PETS:  'petbnb_pets',
  REQS:  'petbnb_requests',
  SESSION: 'petbnb_session'
};

function readStorage(key){ return JSON.parse(localStorage.getItem(key) || 'null'); }
function writeStorage(key, value){ localStorage.setItem(key, JSON.stringify(value)); }
function uid(prefix='id'){ return prefix + '_' + Math.random().toString(36).slice(2,9); }

/* ---------- Inicialização de dados  ---------- */
function seedHosts(){
  if(readStorage(STORAGE.HOSTS)) return;
  const hosts = [
    {
      id: uid('host'),
      nome: 'Mariana Souza',
      cidade: 'São Carlos',
      preco: 45.00,
      capacidade: 2,
      portes: ['pequeno','médio'],
      fotos: [
        'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=39c8b7f4c0f9a1d5b6e4f6c4f0a5d2e3'
      ],
      descricao: 'Ambiente familiar, quintal grande. Experiência com medicação básica.'
    },
    {
      id: uid('host'),
      nome: 'Carlos Henrique',
      cidade: 'São Paulo',
      preco: 60.00,
      capacidade: 3,
      portes: ['pequeno','médio','grande'],
      fotos: [
        'https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=1bb5f6a2f6b2c3a1b4e5f6d7c8a9b0c1'
      ],
      descricao: 'Casa com quintal coberto e câmera para monitoramento.'
    },
    {
      id: uid('host'),
      nome: 'Fernanda Ribeiro',
      cidade: 'Campinas',
      preco: 70.00,
      capacidade: 1,
      portes: ['pequeno'],
      fotos: [
        'https://images.unsplash.com/photo-1546539787-3be1a6a8a3f2?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=abcdef1234567890'
      ],
      descricao: 'Cuido em regime familiar. Prefiro animais vacinados.'
    }
  ];
  writeStorage(STORAGE.HOSTS, hosts);
}

/* ---------- Autenticação/Usuários ---------- */
function getUsers(){ return readStorage(STORAGE.USERS) || []; }
function saveUser(user){
  const users = getUsers();
  users.push(user);
  writeStorage(STORAGE.USERS, users);
}
function setSession(user){ writeStorage(STORAGE.SESSION, user); }
function getSession(){ return readStorage(STORAGE.SESSION); }
function clearSession(){ localStorage.removeItem(STORAGE.SESSION); }

/* ---------- Pets ---------- */
function getPets(){ return readStorage(STORAGE.PETS) || []; }
function addPet(pet){
  const arr = getPets();
  arr.push(pet);
  writeStorage(STORAGE.PETS, arr);
}
function getPetsByOwner(ownerEmail){ return getPets().filter(p=>p.owner===ownerEmail); }

/* ---------- Requests ---------- */
function getRequests(){ return readStorage(STORAGE.REQS) || []; }
function addRequest(req){
  const arr = getRequests(); arr.push(req); writeStorage(STORAGE.REQS, arr);
}

/* ---------- Funções UI / Comportamento ---------- */

/* Form: cadastro */
function handleCadastro(){
  const form = document.getElementById('cadastro-form');
  if(!form) return;
  const anfitriaoCampos = document.getElementById('anfitriao-campos');
  document.getElementById('tipo').addEventListener('change', e=>{
    if(e.target.value === 'anfitriao') anfitriaoCampos.style.display = 'block';
    else anfitriaoCampos.style.display = 'none';
  });

  form.addEventListener('submit', e=>{
    e.preventDefault();
    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('emailCad').value.trim();
    const senha = document.getElementById('senhaCad').value;
    const tipo = document.getElementById('tipo').value;

    if(getUsers().some(u=>u.email === email)){
      alert('Já existe conta com esse e-mail.');
      return;
    }

    const user = {id: uid('user'), nome, email, senha, tipo};
    if(tipo === 'anfitriao'){
      user.cidade = document.getElementById('cidade').value || '';
      user.preco = parseFloat(document.getElementById('preco').value || 0);
      user.capacidade = parseInt(document.getElementById('capacidade').value || 1);
      user.portes = (document.getElementById('portes').value || '').split(',').map(s=>s.trim()).filter(Boolean);
      // também cria um host análogo para a busca
      const hosts = readStorage(STORAGE.HOSTS) || [];
      hosts.push({
        id: uid('host'),
        nome: nome,
        cidade: user.cidade || '',
        preco: user.preco || 0,
        capacidade: user.capacidade || 1,
        portes: user.portes || [],
        fotos: [],
        descricao: 'Anúncio criado pelo usuário (perfil).'
      });
      writeStorage(STORAGE.HOSTS, hosts);
    }
    saveUser(user);
    setSession({email,user});
    alert('Conta criada com sucesso. Você está logado.');
    window.location.href = '../index.html';
  });
}

/* Form: login */
function handleLogin(){
  const form = document.getElementById('login-form');
  if(!form) return;
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;
    const user = getUsers().find(u=>u.email===email && u.senha===senha);
    if(!user){
      alert('Credenciais inválidas. Se não tiver conta, crie uma.');
      return;
    }
    setSession({email:user.email, nome:user.nome, tipo:user.tipo});
    alert('Login realizado.');
    window.location.href = '../index.html';
  });
}

/* Página: busca */
function handleBusca(){
  const form = document.getElementById('search-form');
  if(!form) return;
  const hostsList = document.getElementById('hosts-list');
  const tpl = document.getElementById('host-card-tpl');

  function renderHosts(list){
    hostsList.innerHTML = '';
    if(!list.length){ hostsList.innerHTML = '<p>Nenhum anfitrião encontrado.</p>'; return; }
    list.forEach(h=>{
      const node = tpl.content.cloneNode(true);
      node.querySelector('.host-photo').src = h.fotos && h.fotos[0] ? h.fotos[0] : 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder';
      node.querySelector('.host-name').textContent = h.nome;
      node.querySelector('.host-city').textContent = h.cidade;
      node.querySelector('.host-meta').textContent = `Portes: ${h.portes.join(', ')} · Capacidade: ${h.capacidade}`;
      node.querySelector('.host-price').textContent = `R$ ${h.preco.toFixed(2)} / diária`;
      const btnView = node.querySelector('.host-view');
      const btnReq = node.querySelector('.host-request');

      btnView.addEventListener('click', ()=> {
        // abrir perfil
        window.location.href = `anfitriao.html?host=${h.id}`;
      });

      btnReq.addEventListener('click', ()=> {
        openReservationModal(h);
      });

      hostsList.appendChild(node);
    });
  }

  // initial render
  const allHosts = readStorage(STORAGE.HOSTS) || [];
  renderHosts(allHosts);

  form.addEventListener('submit', e=>{
    e.preventDefault();
    const cidade = document.getElementById('f-cidade').value.trim().toLowerCase();
    const porte = document.getElementById('f-porte').value;
    const preco = parseFloat(document.getElementById('f-preco').value || 0);

    let result = allHosts.filter(h=>{
      if(cidade && !h.cidade.toLowerCase().includes(cidade)) return false;
      if(porte && !h.portes.includes(porte)) return false;
      if(preco && h.preco > preco) return false;
      return true;
    });
    renderHosts(result);
  });

  document.getElementById('btn-reset').addEventListener('click', ()=>{
    document.getElementById('f-cidade').value = '';
    document.getElementById('f-porte').value = '';
    document.getElementById('f-preco').value = '';
    renderHosts(allHosts);
  });
}

/* Modal para solicitar hospedagem */
function openReservationModal(host){
  const modal = document.getElementById('modal');
  const body = document.getElementById('modal-body');
  modal.setAttribute('aria-hidden','false');
  body.innerHTML = `
    <h3>Solicitar hospedagem em ${host.nome} (${host.cidade})</h3>
    <p>${host.descricao || ''}</p>

    <form id="req-form">
      <label>Seu e-mail (dono)</label>
      <input id="req-email" type="email" required placeholder="seu@email.com" />

      <label>Selecione pet (se já cadastrado)</label>
      <select id="req-pet">
        <option value="">-- escolher --</option>
      </select>

      <label>Check-in</label>
      <input id="req-checkin" type="date" required />

      <label>Check-out</label>
      <input id="req-checkout" type="date" required />

      <label>Quantidade de cães</label>
      <input id="req-qt" type="number" min="1" value="1" required />

      <div class="form-actions">
        <button class="btn btn-primary" type="submit">Enviar solicitação</button>
        <button class="btn" type="button" id="req-cancel">Cancelar</button>
      </div>
    </form>
  `;

  // preencher pets do session.user
  const sel = document.getElementById('req-pet');
  const session = getSession();
  const pets = getPetsByOwner(session ? session.email : null);
  pets.forEach(p=>{
    const opt = document.createElement('option'); opt.value = p.id; opt.textContent = `${p.nome} (${p.porte})`;
    sel.appendChild(opt);
  });

  // fechar
  modal.querySelector('.modal-close').onclick = ()=> modal.setAttribute('aria-hidden','true');
  document.getElementById('req-cancel').onclick = ()=> modal.setAttribute('aria-hidden','true');

  document.getElementById('req-form').addEventListener('submit', e=>{
    e.preventDefault();
    const email = document.getElementById('req-email').value.trim();
    const checkin = document.getElementById('req-checkin').value;
    const checkout = document.getElementById('req-checkout').value;
    const qt = parseInt(document.getElementById('req-qt').value || 1);
    const petId = document.getElementById('req-pet').value;

    if(!email || !checkin || !checkout){
      alert('Preencha os campos obrigatórios.');
      return;
    }
    if(new Date(checkout) <= new Date(checkin)){
      alert('Check-out deve ser maior que check-in.');
      return;
    }

    // validações de porte e capacidade simples
    const pet = pets.find(p=>p.id === petId);
    if(pet && !host.portes.includes(pet.porte)){
      alert('Portes do pet não compatível com o anúncio.');
      return;
    }
    if(qt > host.capacidade){
      alert('Quantidade excede capacidade do anfitrião.');
      return;
    }

    // calcular diárias
    const days = Math.ceil((new Date(checkout) - new Date(checkin)) / (1000*60*60*24));
    const precoTotal = (host.preco * days).toFixed(2);

    const req = {
      id: uid('req'),
      hostId: host.id,
      hostName: host.nome,
      ownerEmail: email,
      petId: petId || null,
      checkin, checkout, qt, days,
      precoEstimado: parseFloat(precoTotal),
      status: 'Pendente',
      createdAt: new Date().toISOString()
    };
    addRequest(req);
    alert(`Solicitação enviada. Preço estimado R$ ${precoTotal} — status Pendente.`);
    modal.setAttribute('aria-hidden','true');
  });
}

/* Página: anfitriao.html — detalhe */
function handleHostDetail(){
  // obtém param host
  const params = new URLSearchParams(window.location.search);
  const hostId = params.get('host');
  if(!hostId) return;
  const hosts = readStorage(STORAGE.HOSTS) || [];
  const host = hosts.find(h=>h.id === hostId);
  const container = document.getElementById('host-detail');
  if(!host || !container){ container.innerHTML = '<p>Anfitrião não encontrado.</p>'; return; }

  container.innerHTML = `
    <h2>${host.nome}</h2>
    <p class="note">${host.cidade} · R$ ${host.preco.toFixed(2)} / diária</p>
    <div class="host-gallery">
      <img alt="foto1" src="${host.fotos[0]||''}" />
      <div>
        <p>${host.descricao}</p>
        <div class="host-meta-list">
          <div class="card small"><strong>Capacidade</strong><div>${host.capacidade}</div></div>
          <div class="card small"><strong>Portes</strong><div>${host.portes.join(', ')}</div></div>
          <div class="card small"><strong>Preço</strong><div>R$ ${host.preco.toFixed(2)}</div></div>
        </div>
        <div style="margin-top:1rem">
          <button class="btn btn-primary" id="btn-solicitar">Solicitar hospedagem</button>
          <a href="busca.html" class="btn">Voltar</a>
        </div>
      </div>
    </div>
  `;

  document.getElementById('btn-solicitar').addEventListener('click', ()=>{
    openReservationModal(host);
  });
}

/* Página: dono.html — gerenciar pets */
function handleDonoArea(){
  const petsList = document.getElementById('pets-list');
  if(!petsList) return;
  const form = document.getElementById('pet-form');
  const session = getSession();
  if(!session){ petsList.innerHTML = '<p>Você precisa estar logado como dono para gerenciar pets.</p>'; return; }

  function render(){
    const pets = getPetsByOwner(session.email);
    petsList.innerHTML = '';
    if(!pets.length){ petsList.innerHTML = '<p>Você ainda não cadastrou pets.</p>'; return; }
    pets.forEach(p=>{
      const el = document.createElement('div');
      el.className = 'card small';
      el.innerHTML = `<strong>${p.nome}</strong><div>Idade: ${p.idade} · Porte: ${p.porte} · Vacinas: ${p.vacinas}</div>`;
      petsList.appendChild(el);
    });
  }
  render();

  form.addEventListener('submit', e=>{
    e.preventDefault();
    const nome = document.getElementById('pet-nome').value.trim();
    const idade = parseInt(document.getElementById('pet-idade').value || 0);
    const porte = document.getElementById('pet-porte').value;
    const vacinas = document.getElementById('pet-vacinas').value || 'sim';
    const pet = { id: uid('pet'), owner: session.email, nome, idade, porte, vacinas };
    addPet(pet);
    render();
    form.reset();
  });
}

/* Página: reservas (minhas solicitações) */
function handleReservas(){
  const container = document.getElementById('reservas-list');
  if(!container) return;
  const session = getSession();
  if(!session){ container.innerHTML = '<p>Faça login para ver suas solicitações.</p>'; return; }

  const all = getRequests();
  let list = [];
  if(session.tipo === 'dono'){
    list = all.filter(r=>r.ownerEmail === session.email);
  } else {
    // se anfitrião: filtrar por hostName igual ao user nome (simples)
    list = all.filter(r=>r.hostName === session.nome);
  }

  if(!list.length){ container.innerHTML = '<p>Sem solicitações ou reservas.</p>'; return; }

  container.innerHTML = '';
  list.forEach(r=>{
    const el = document.createElement('div');
    el.className = 'card';
    el.innerHTML = `
      <strong>${r.hostName}</strong>
      <div>Período: ${r.checkin} → ${r.checkout} (${r.days} diárias)</div>
      <div>Preço estimado: R$ ${r.precoEstimado.toFixed(2)}</div>
      <div>Status: <strong>${r.status}</strong></div>
      <div class="form-actions">${session.tipo === 'anfitriao' && r.status==='Pendente'? `<button class="btn btn-primary" data-accept="${r.id}">Aceitar</button> <button class="btn" data-decline="${r.id}">Recusar</button>` : ''}</div>
    `;
    container.appendChild(el);
  });

  // handlers para aceitar/recusar (apenas alteração local)
  container.addEventListener('click', e=>{
    const accept = e.target.dataset.accept;
    const decline = e.target.dataset.decline;
    if(!accept && !decline) return;
    const id = accept || decline;
    const allReq = getRequests();
    const idx = allReq.findIndex(x=>x.id===id);
    if(idx === -1) return;
    allReq[idx].status = accept ? 'Aceita' : 'Recusada';
    writeStorage(STORAGE.REQS, allReq);
    handleReservas(); // re-render
  });
}

/* UI: atualizar link login para logout quando sessão ativa */
function updateHeaderLinks(){
  const session = getSession();
  const linkLogin = document.getElementById('link-login');
  if(!linkLogin) return;
  if(session){
    linkLogin.textContent = `Olá, ${session.nome || session.email} (sair)`;
    linkLogin.href = '#';
    linkLogin.onclick = (e)=>{
      e.preventDefault();
      if(confirm('Deseja sair?')){ clearSession(); window.location.href = '../index.html'; }
    };
  } else {
    linkLogin.textContent = 'Entrar / Cadastrar';
    linkLogin.href = 'pages/login.html';
  }
}

/* Inicializa dependendo da página */
function init(){
  seedHosts();
  handleCadastro();
  handleLogin();
  handleBusca();
  handleHostDetail();
  handleDonoArea();
  handleReservas();
  updateHeaderLinks();

  // modal close por clique no overlay
  document.addEventListener('click', e=>{
    const modal = document.getElementById('modal');
    if(!modal) return;
    if(e.target === modal) modal.setAttribute('aria-hidden','true');
  });
}

document.addEventListener('DOMContentLoaded', init);
