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
      descricao: 'Cuido em regime familial. Prefiro animais vacinados.'
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

/* ---------- Funções para CEP e Endereço ---------- */

// Formata o CEP
function formatarCEP(cep) {
  cep = cep.replace(/\D/g, '');
  if (cep.length > 5) {
    cep = cep.substring(0, 5) + '-' + cep.substring(5, 8);
  }
  return cep;
}

// Busca endereço pelo CEP
async function buscarEnderecoPorCEP(cep) {
  cep = cep.replace(/\D/g, '');
  
  if (cep.length !== 8) {
    return null;
  }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();
    
    if (data.erro) {
      alert('CEP não encontrado. Verifique o número digitado.');
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
    alert('Erro ao buscar CEP. Tente novamente.');
    return null;
  }
}

// Preenche os campos de endereço
function preencherEndereco(data) {
  document.getElementById('rua').value = data.logradouro || '';
  document.getElementById('bairro').value = data.bairro || '';
  document.getElementById('cidade').value = data.localidade || '';
  document.getElementById('estado').value = data.uf || '';
}

// Limpa os campos de endereço
function limparEndereco() {
  document.getElementById('rua').value = '';
  document.getElementById('bairro').value = '';
  document.getElementById('cidade').value = '';
  document.getElementById('estado').value = '';
}

/* Form: cadastro */
function handleCadastro(){
  // Verificar se veio do link "Seja um Anfitrião"
  const urlParams = new URLSearchParams(window.location.search);
  const veioComoAnfitriao = urlParams.get('tipo') === 'anfitriao';
  
  const form = document.getElementById('cadastro-form');
  if(!form) return;
  
  const anfitriaoCampos = document.getElementById('anfitriao-campos');
  const primeiroPetCampos = document.getElementById('primeiro-pet-campos');
  const tipoSelect = document.getElementById('tipo');
  const tipoLabel = document.querySelector('label[for="tipo"]');
  
  let petCadastrado = false;
  let tempPet = null;

  console.log('Elementos encontrados:', {
    form: !!form,
    anfitriaoCampos: !!anfitriaoCampos,
    primeiroPetCampos: !!primeiroPetCampos,
    veioComoAnfitriao: veioComoAnfitriao
  });

  //Se veio como anfitrião, seleciona automaticamente e ajusta a interface
  if(veioComoAnfitriao) {
    tipoSelect.value = 'anfitriao';
    tipoSelect.style.display = 'none';
    if(tipoLabel) tipoLabel.style.display = 'none';
    anfitriaoCampos.style.display = 'block';
    if(primeiroPetCampos) primeiroPetCampos.style.display = 'none';
    
    // Atualiza o título da página para refletir que é cadastro de anfitrião
    const pageTitle = document.querySelector('title');
    if(pageTitle) pageTitle.textContent = 'Cadastrar como Anfitrião — Petbnb';
    
    const formTitle = document.querySelector('.form-card h2');
    if(formTitle) formTitle.textContent = 'Cadastrar como Anfitrião';
  }

  // Controle de visibilidade das seções - DEBUG
  if(tipoSelect && !veioComoAnfitriao) {
    tipoSelect.addEventListener('change', function(e){
      console.log('Tipo selecionado:', e.target.value);
      
      if(e.target.value === 'anfitriao') {
        anfitriaoCampos.style.display = 'block';
        if(primeiroPetCampos) primeiroPetCampos.style.display = 'none';
      } else if(e.target.value === 'dono') {
        anfitriaoCampos.style.display = 'none';
        if(primeiroPetCampos) primeiroPetCampos.style.display = 'block';
      } else {
        anfitriaoCampos.style.display = 'none';
        if(primeiroPetCampos) primeiroPetCampos.style.display = 'none';
      }
    });
  }

  //Eventos para o CEP (apenas se a seção de anfitrião existir)
  if (anfitriaoCampos) {
    // Formatação do CEP em tempo real
    const cepInput = document.getElementById('cep');
    if (cepInput) {
      cepInput.addEventListener('input', function(e) {
        e.target.value = formatarCEP(e.target.value);
      });

      // Busca automática do endereço quando o CEP perde o foco
      cepInput.addEventListener('blur', async function(e) {
        const cep = e.target.value.trim();
        
        if (cep.length < 9) return;
        
        const enderecoData = await buscarEnderecoPorCEP(cep);
        if (enderecoData) {
          preencherEndereco(enderecoData);
        } else {
          limparEndereco();
        }
      });
    }
  }

  // Botão para cadastrar pet - DEBUG
  document.addEventListener('click', function(e) {
    if(e.target && e.target.id === 'btn-cadastrar-pet') {
      e.preventDefault();
      console.log('Botão cadastrar pet clicado');
      
      const nome = document.getElementById('pet-nome-cadastro').value.trim();
      const tipo = document.getElementById('pet-tipo-cadastro').value;
      const idade = parseInt(document.getElementById('pet-idade-cadastro').value || 0);
      const vacinas = document.getElementById('pet-vacinas-cadastro').value;

      console.log('Dados do pet:', { nome, tipo, idade, vacinas });

      if(!nome || !tipo) {
        alert('Preencha pelo menos o nome e tipo do animal.');
        return;
      }

      // Para cães, precisamos do porte (vamos usar "médio" como padrão por enquanto)
      const porte = tipo === 'cachorro' ? 'médio' : 'n/a';

      tempPet = {
        id: uid('pet'),
        nome,
        tipo,
        idade, 
        porte,
        vacinas,
        owner: ''
      };

      petCadastrado = true;
      
      alert(`Pet ${nome} cadastrado com sucesso! Agora finalize seu cadastro.`);
      if(primeiroPetCampos) primeiroPetCampos.style.display = 'none';
    }

    if(e.target && e.target.id === 'btn-pular-pet') {
      e.preventDefault();
      console.log('Botão pular pet clicado');
      if(primeiroPetCampos) primeiroPetCampos.style.display = 'none';
      petCadastrado = false;
      tempPet = null;
    }
  });

  form.addEventListener('submit', function(e){
    e.preventDefault();
    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('emailCad').value.trim();
    const senha = document.getElementById('senhaCad').value;
    
    //Se veio como anfitrião, usa 'anfitriao', senão pega do select
    const tipo = veioComoAnfitriao ? 'anfitriao' : document.getElementById('tipo').value;

    if(getUsers().some(function(u){ return u.email === email; })){
      alert('Já existe conta com esse e-mail.');
      return;
    }

    const user = {id: uid('user'), nome, email, senha, tipo};
    if(tipo === 'anfitriao'){
      //CAMPOS: Endereço completo
      user.cep = document.getElementById('cep').value;
      user.rua = document.getElementById('rua').value;
      user.numero = document.getElementById('numero').value;
      user.complemento = document.getElementById('complemento').value;
      user.bairro = document.getElementById('bairro').value;
      user.cidade = document.getElementById('cidade').value;
      user.estado = document.getElementById('estado').value;
      user.tipoMoradia = document.getElementById('tipo-moradia').value;

      //CAMPOS: Informações da hospedagem
      user.preco = parseFloat(document.getElementById('preco').value || 10);
      user.capacidade = parseInt(document.getElementById('capacidade').value || 1);

      //Pegar portes aceitos dos checkboxes
      const portesCheckboxes = document.querySelectorAll('input[name="portes"]:checked');
      user.portes = Array.from(portesCheckboxes).map(cb => cb.value);

      // Validações
      if(user.portes.length === 0) {
        alert('Selecione pelo menos um porte aceito para pets.');
        return;
      }

      if(!user.rua || !user.numero || !user.bairro || !user.cidade || !user.estado || !user.tipoMoradia) {
        alert('Preencha todos os campos obrigatórios do endereço.');
        return;
      }

      //cria um host análogo para a busca
      const hosts = readStorage(STORAGE.HOSTS) || [];
      hosts.push({
        id: uid('host'),
        nome: nome,
        cidade: user.cidade || '',
        preco: user.preco || 10,
        capacidade: user.capacidade || 1,
        portes: user.portes || [],
        fotos: [],
        descricao: 'Anúncio criado pelo usuário (perfil).',
        //CAMPOS: Endereço completo
        endereco: {
          cep: user.cep,
          rua: user.rua,
          numero: user.numero,
          complemento: user.complemento,
          bairro: user.bairro,
          cidade: user.cidade,
          estado: user.estado,
          tipoMoradia: user.tipoMoradia
        }
      });
      writeStorage(STORAGE.HOSTS, hosts);
    }

    // Salva o usuário primeiro
    saveUser(user);
    
    // Se cadastrou um pet, salva ele também (apenas se for dono)
    if(petCadastrado && tempPet && tipo === 'dono') {
      tempPet.owner = email;
      addPet(tempPet);
    }

    setSession({email: email, nome: nome, tipo: tipo});
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
  const resultsCount = document.getElementById('count');

  function renderHosts(list){
    hostsList.innerHTML = '';
    resultsCount.textContent = list.length;
    
    if(!list.length){ 
      hostsList.innerHTML = `
        <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 3rem;">
          <p style="font-size: 1.2rem; color: var(--muted); margin-bottom: 1rem;">🐕 Nenhum anfitrião encontrado</p>
          <p style="color: var(--muted);">Tente ajustar os filtros para ver mais resultados.</p>
        </div>
      `; 
      return; 
    }
    
    list.forEach(h=>{
      const node = tpl.content.cloneNode(true);
      node.querySelector('.host-photo').src = h.fotos && h.fotos[0] ? h.fotos[0] : 'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3';
      node.querySelector('.host-name').textContent = h.nome;
      node.querySelector('.host-city').textContent = h.cidade;
      node.querySelector('.host-meta').textContent = `Portes: ${h.portes.join(', ')} · Capacidade: ${h.capacidade} pets`;
      node.querySelector('.host-price').textContent = `R$ ${h.preco.toFixed(2)} / diária`;
      const btnView = node.querySelector('.host-view');
      const btnReq = node.querySelector('.host-request');

      btnView.addEventListener('click', ()=> {
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


  // 1. Controles de número para quantidade de pets
  const numberInput = document.getElementById('f-qt-pets');
  const decreaseBtn = document.querySelector('[data-action="decrease"]');
  const increaseBtn = document.querySelector('[data-action="increase"]');

  function updateNumberButtons() {
    const currentValue = parseInt(numberInput.value) || 1;
    const min = parseInt(numberInput.min) || 1;
    const max = parseInt(numberInput.max) || 10;
    
    if (decreaseBtn) decreaseBtn.disabled = currentValue <= min;
    if (increaseBtn) increaseBtn.disabled = currentValue >= max;
  }

  if (decreaseBtn && increaseBtn && numberInput) {
    decreaseBtn.addEventListener('click', () => {
      const currentValue = parseInt(numberInput.value) || 1;
      const min = parseInt(numberInput.min) || 1;
      if (currentValue > min) {
        numberInput.value = currentValue - 1;
        updateNumberButtons();
      }
    });

    increaseBtn.addEventListener('click', () => {
      const currentValue = parseInt(numberInput.value) || 1;
      const max = parseInt(numberInput.max) || 10;
      if (currentValue < max) {
        numberInput.value = currentValue + 1;
        updateNumberButtons();
      }
    });

    // Validação manual do input
    numberInput.addEventListener('change', () => {
      let value = parseInt(numberInput.value) || 1;
      const min = parseInt(numberInput.min) || 1;
      const max = parseInt(numberInput.max) || 10;
      
      if (value < min) value = min;
      if (value > max) value = max;
      
      numberInput.value = value;
      updateNumberButtons();
    });

    // Inicializar estado dos botões
    updateNumberButtons();
  }

  // 2. Campo "Outro" para tipo de pet
  const tipoPetSelect = document.getElementById('f-tipo-pet');
  const outroTipoInput = document.getElementById('f-outro-tipo');

  if (tipoPetSelect && outroTipoInput) {
    tipoPetSelect.addEventListener('change', function() {
      if (this.value === 'outro') {
        outroTipoInput.style.display = 'block';
        outroTipoInput.required = true;
      } else {
        outroTipoInput.style.display = 'none';
        outroTipoInput.required = false;
        outroTipoInput.value = '';
      }
    });
  }

  // 3. Validação de datas (não permitir datas passadas)
  const checkinInput = document.getElementById('f-checkin');
  const checkoutInput = document.getElementById('f-checkout');

  // Definir data mínima como hoje
  const today = new Date().toISOString().split('T')[0];
  if (checkinInput) checkinInput.min = today;
  if (checkoutInput) checkoutInput.min = today;

  // Sincronizar datas - checkout não pode ser antes do checkin
  if (checkinInput && checkoutInput) {
    checkinInput.addEventListener('change', function() {
      checkoutInput.min = this.value;
      
      // Se checkout for anterior ao novo checkin, resetar checkout
      if (checkoutInput.value && checkoutInput.value < this.value) {
        checkoutInput.value = '';
      }
    });

    // Validação adicional no submit
    checkoutInput.addEventListener('change', function() {
      if (checkinInput.value && this.value < checkinInput.value) {
        alert('A data de check-out não pode ser anterior à data de check-in.');
        this.value = '';
      }
    });
  }

  // ===== FILTROS AVANÇADOS =====

  // Toggle dos filtros avançados
  document.getElementById('toggle-filters')?.addEventListener('click', function() {
    const filters = document.getElementById('advanced-filters');
    const isVisible = filters.style.display === 'block';
    filters.style.display = isVisible ? 'none' : 'block';
    this.textContent = isVisible ? '🔍 Filtros avançados' : '🔍 Ocultar filtros';
  });

  // Slider de preço em tempo real
  const priceSlider = document.getElementById('f-preco');
  const priceValue = document.getElementById('price-value');
  if (priceSlider && priceValue) {
    priceSlider.addEventListener('input', function() {
      priceValue.textContent = this.value;
    });
  }

  // ===== BUSCA APRIMORADA =====

  form.addEventListener('submit', e=>{
    e.preventDefault();
    
    // Validação de datas
    if (checkinInput && checkoutInput) {
      if (checkinInput.value && !checkoutInput.value) {
        alert('Por favor, selecione também a data de check-out.');
        return;
      }
      if (!checkinInput.value && checkoutInput.value) {
        alert('Por favor, selecione também a data de check-in.');
        return;
      }
      if (checkinInput.value && checkoutInput.value && checkinInput.value > checkoutInput.value) {
        alert('A data de check-in não pode ser posterior à data de check-out.');
        return;
      }
    }

    const cidade = document.getElementById('f-cidade').value.trim().toLowerCase();
    const bairro = document.getElementById('f-bairro').value.trim().toLowerCase();
    const tipoPet = document.getElementById('f-tipo-pet').value;
    const outroTipo = document.getElementById('f-outro-tipo').value.trim().toLowerCase();
    const qtPets = parseInt(document.getElementById('f-qt-pets').value || 1);
    const preco = parseInt(document.getElementById('f-preco').value || 0);
    
    // Obter checkboxes selecionados
    const portesSelecionados = Array.from(document.querySelectorAll('input[name="porte"]:checked')).map(cb => cb.value);
    const servicosSelecionados = Array.from(document.querySelectorAll('input[name="servicos"]:checked')).map(cb => cb.value);
    const tiposHospedagem = Array.from(document.querySelectorAll('input[name="tipo-hospedagem"]:checked')).map(cb => cb.value);
    const experiencias = Array.from(document.querySelectorAll('input[name="experiencia"]:checked')).map(cb => cb.value);

    let result = allHosts.filter(h=>{
      // Filtro por cidade
      if(cidade && !h.cidade.toLowerCase().includes(cidade)) return false;
      
      // Filtro por bairro (se o anfitrião tiver o campo bairro)
      if(bairro && h.endereco && h.endereco.bairro && !h.endereco.bairro.toLowerCase().includes(bairro)) return false;
      
      // Filtro por preço
      if(preco && h.preco > preco) return false;
      
      // Filtro por quantidade de pets
      if(qtPets && h.capacidade < qtPets) return false;
      
      // Filtro por portes
      if(portesSelecionados.length > 0 && !portesSelecionados.some(porte => h.portes.includes(porte))) return false;
      
      // Filtro por tipo de hospedagem
      if(tiposHospedagem.length > 0 && h.endereco && h.endereco.tipoMoradia && !tiposHospedagem.includes(h.endereco.tipoMoradia)) return false;

      // Filtro por tipo de pet (se implementado futuramente)
      // Por enquanto, todos os anfitriões aceitam todos os tipos básicos
      
      return true;
    });
    
    renderHosts(result);
  });

  // Reset completo dos filtros
  document.getElementById('btn-reset').addEventListener('click', ()=>{
    // Resetar campos de texto
    document.getElementById('f-cidade').value = '';
    document.getElementById('f-bairro').value = '';
    
    // Resetar datas
    document.getElementById('f-checkin').value = '';
    document.getElementById('f-checkout').value = '';
    
    // Resetar selects
    document.getElementById('f-tipo-pet').value = '';
    document.getElementById('f-outro-tipo').style.display = 'none';
    document.getElementById('f-outro-tipo').value = '';
    
    // Resetar número de pets
    document.getElementById('f-qt-pets').value = '1';
    updateNumberButtons(); // Atualizar estado dos botões
    
    // Resetar slider de preço
    document.getElementById('f-preco').value = '50';
    document.getElementById('price-value').textContent = '50';
    
    // Resetar checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    
    // Fechar filtros avançados
    document.getElementById('advanced-filters').style.display = 'none';
    document.getElementById('toggle-filters').textContent = '🔍 Filtros avançados';
    
    // Resetar validação de datas
    document.getElementById('f-checkin').min = today;
    document.getElementById('f-checkout').min = today;
    
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
function updateNavigation() {
  const session = getSession();
  const userLogged = document.getElementById('user-logged');
  const authLinks = document.getElementById('auth-links');
  const userName = document.getElementById('user-name');
  const linkMinhaArea = document.getElementById('link-minha-area');
  const linkLogout = document.getElementById('link-logout');

  if (session) {
    // Usuário LOGADO
    if (userLogged) userLogged.style.display = 'flex';
    if (authLinks) authLinks.style.display = 'none';
    
    // Atualizar informações do usuário
    if (userName) {
      userName.textContent = session.nome || session.email.split('@')[0];
    }
    
    //link da área baseado no tipo de usuário
    if (linkMinhaArea) {
      if (session.tipo === 'dono') {
        linkMinhaArea.innerHTML = '<span>🐕</span> Minha Área (Dono)';
        linkMinhaArea.href = 'pages/dono.html';
      } else if (session.tipo === 'anfitriao') {
        linkMinhaArea.innerHTML = '<span>🏠</span> Minha Área (Anfitrião)';
        linkMinhaArea.href = 'pages/anfitriao-dashboard.html';
      }
    }

    // Configurar logout
    if (linkLogout) {
      linkLogout.onclick = function(e) {
        e.preventDefault();
        if (confirm('Deseja sair da sua conta?')) {
          clearSession();
          window.location.href = '../index.html';
        }
      };
    }
  } else {
    // Usuário NÃO LOGADO
    if (userLogged) userLogged.style.display = 'none';
    if (authLinks) authLinks.style.display = 'flex';
  }
}

/*Header específico para páginas de anfitrião */
function updateHostHeader() {
  const session = getSession();
  const hostStats = document.querySelector('.host-stats');
  const hostName = document.getElementById('host-name');
  const linkLogout = document.getElementById('link-logout');

  if (session && session.tipo === 'anfitriao') {
    // Atualizar nome do anfitrião
    if (hostName) {
      hostName.textContent = session.nome;
    }

    // Configurar logout no header do anfitrião
    if (linkLogout) {
      linkLogout.onclick = function(e) {
        e.preventDefault();
        if (confirm('Deseja sair da sua conta?')) {
          clearSession();
          window.location.href = '../index.html';
        }
      };
    }

    // Calcular estatísticas do anfitrião
    const requests = getRequests();
    const hostRequests = requests.filter(r => r.hostName === session.nome);
    const pendentes = hostRequests.filter(r => r.status === 'Pendente').length;
    const confirmadas = hostRequests.filter(r => r.status === 'Aceita').length;
    
    // Atualizar estatísticas no header (se existirem)
    if (hostStats) {
      const statsElements = hostStats.querySelectorAll('.stat');
      if (statsElements.length >= 3) {
        statsElements[0].textContent = `⭐ 4.9 (${confirmadas} avaliações)`;
        statsElements[1].textContent = `🏠 ${confirmadas} hospedagens`;
        statsElements[2].textContent = `💬 95% taxa de resposta`;
      }
    }
  } else if (!session) {
    // Redirecionar se não estiver logado
    alert('Área restrita para anfitriões. Redirecionando...');
    window.location.href = 'login.html';
  } else if (session.tipo !== 'anfitriao') {
    // Redirecionar se não for anfitrião
    alert('Área restrita para anfitriões. Redirecionando...');
    window.location.href = '../index.html';
  }
}

/*FUNÇÃO PARA HEADER: Dashboard, Reservas, Avaliações */
function updateHeaderBasedOnUserType() {
  const session = getSession();
  const normalNav = document.getElementById('normal-nav');
  const hostNav = document.getElementById('host-nav');
  const becomeHostLink = document.getElementById('become-host-link');
  const userLogged = document.getElementById('user-logged');
  const authLinks = document.getElementById('auth-links');
  const userName = document.getElementById('user-name');

  if (session) {
    // Usuário LOGADO
    if (userName) {
      userName.textContent = session.nome || session.email.split('@')[0];
    }
    
    if (session.tipo === 'anfitriao') {
      // USUÁRIO É ANFITRIÃO - Mostrar menu específico
      if (normalNav) normalNav.style.display = 'none';
      if (hostNav) hostNav.style.display = 'flex';
      if (becomeHostLink) becomeHostLink.style.display = 'none';
      if (userLogged) userLogged.style.display = 'flex';
      if (authLinks) authLinks.style.display = 'none';
      
      // Atualizar link "Minha Área" no dropdown para anfitriões
      const linkMinhaArea = document.getElementById('link-minha-area');
      if (linkMinhaArea) {
        linkMinhaArea.innerHTML = '<span>📊</span> Dashboard';
        linkMinhaArea.href = 'anfitriao-dashboard.html';
      }
    } else {
      // USUÁRIO É DONO - Mostrar menu normal
      if (normalNav) normalNav.style.display = 'flex';
      if (hostNav) hostNav.style.display = 'none';
      if (becomeHostLink) becomeHostLink.style.display = 'none'; // Dono não vê "Seja um Anfitrião"
      if (userLogged) userLogged.style.display = 'flex';
      if (authLinks) authLinks.style.display = 'none';
      
      // Atualizar link "Minha Área" no dropdown para donos
      const linkMinhaArea = document.getElementById('link-minha-area');
      if (linkMinhaArea) {
        linkMinhaArea.innerHTML = '<span>🐕</span> Minha Área';
        linkMinhaArea.href = 'dono.html';
      }
    }
  } else {
    // USUÁRIO NÃO LOGADO - Mostrar menu público
    if (normalNav) normalNav.style.display = 'flex';
    if (hostNav) hostNav.style.display = 'none';
    if (becomeHostLink) becomeHostLink.style.display = 'flex';
    if (userLogged) userLogged.style.display = 'none';
    if (authLinks) authLinks.style.display = 'flex';
  }
}

/*Dashboard do anfitrião */
function handleAnfitriaoDashboard() {
  const session = getSession();
  
  if (!session || session.tipo !== 'anfitriao') {
    alert('Área restrita para anfitriões. Redirecionando...');
    window.location.href = 'login.html';
    return;
  }

  updateHostHeader();
  
  // Carregar dados do dashboard
  const requests = getRequests();
  const hostRequests = requests.filter(r => r.hostName === session.nome);
  
  const pendentes = hostRequests.filter(r => r.status === 'Pendente').length;
  const proximas = hostRequests.filter(r => r.status === 'Aceita' && new Date(r.checkin) >= new Date()).length;
  const rendaMes = hostRequests
    .filter(r => r.status === 'Aceita' && new Date(r.createdAt).getMonth() === new Date().getMonth())
    .reduce((total, r) => total + r.precoEstimado, 0);

  // Atualizar métricas
  const statsPendentes = document.getElementById('stats-pendentes');
  const statsProximas = document.getElementById('stats-proximas');
  const statsAvaliacao = document.getElementById('stats-avaliacao');
  const statsRenda = document.getElementById('stats-renda');
  
  if (statsPendentes) statsPendentes.textContent = pendentes;
  if (statsProximas) statsProximas.textContent = proximas;
  if (statsAvaliacao) statsAvaliacao.textContent = '4.9';
  if (statsRenda) statsRenda.textContent = `R$ ${rendaMes.toFixed(0)}`;
}

/*Função para verificar tipo de usuário na página inicial */
function handleHomePage() {
  const session = getSession();
  const hostNav = document.getElementById('host-nav');
  const normalNav = document.getElementById('normal-nav');
  const becomeHostLink = document.getElementById('become-host-link');
  const authLinks = document.getElementById('auth-links');
  const userLogged = document.getElementById('user-logged');
  const userName = document.getElementById('user-name');
  const hostContent = document.getElementById('host-content');
  const normalContent = document.getElementById('normal-content');
  const footerText = document.getElementById('footer-text');
  const linkMinhaArea = document.getElementById('link-minha-area');

  if (session && session.tipo === 'anfitriao') {
    // MOSTRAR interface do anfitrião
    if (hostNav) hostNav.style.display = 'flex';
    if (normalNav) normalNav.style.display = 'none';
    if (becomeHostLink) becomeHostLink.style.display = 'none';
    if (authLinks) authLinks.style.display = 'none';
    if (userLogged) userLogged.style.display = 'flex';
    if (userName) userName.textContent = session.nome || session.email;
    if (hostContent) hostContent.style.display = 'block';
    if (normalContent) normalContent.style.display = 'none';
    if (footerText) footerText.textContent = '© 2024 Petbnb - Plataforma para Anfitriões de Pets';
    if (linkMinhaArea) {
      linkMinhaArea.innerHTML = '<span>🏠</span> Minha Área (Anfitrião)';
      linkMinhaArea.href = 'pages/anfitriao-dashboard.html';
    }
    
    // Carregar dados do anfitrião
    loadHostHomeData(session);
  } else {
    // MOSTRAR interface normal
    if (hostNav) hostNav.style.display = 'none';
    if (normalNav) normalNav.style.display = 'flex';
    if (becomeHostLink) becomeHostLink.style.display = 'flex';
    if (hostContent) hostContent.style.display = 'none';
    if (normalContent) normalContent.style.display = 'block';
    if (footerText) footerText.textContent = '© 2025 Petbnb - Conectando donos e anfitriões com amor pelos animais';
    
    // Configurar link Minha Área para donos
    if (linkMinhaArea && session && session.tipo === 'dono') {
      linkMinhaArea.innerHTML = '<span>🐕</span> Minha Área (Dono)';
      linkMinhaArea.href = 'pages/dono.html';
    }
  }
}

/*Função para carregar dados do anfitrião na home */
function loadHostHomeData(session) {
  // Atualizar nome na saudação
  const hostGreetingName = document.getElementById('host-greeting-name');
  if (hostGreetingName) {
    hostGreetingName.textContent = session.nome || 'Anfitrião';
  }
  
  // Carregar estatísticas rápidas
  const requests = getRequests();
  const hostRequests = requests.filter(r => r.hostName === session.nome);
  
  const pendentes = hostRequests.filter(r => r.status === 'Pendente').length;
  const proximas = hostRequests.filter(r => r.status === 'Aceita' && new Date(r.checkin) >= new Date()).length;
  const rendaMes = hostRequests
    .filter(r => r.status === 'Aceita' && new Date(r.createdAt).getMonth() === new Date().getMonth())
    .reduce((total, r) => total + r.precoEstimado, 0);

  // Atualizar métricas rápidas
  const quickPending = document.getElementById('quick-pending');
  const quickUpcoming = document.getElementById('quick-upcoming');
  const quickRating = document.getElementById('quick-rating');
  const quickEarnings = document.getElementById('quick-earnings');
  
  if (quickPending) quickPending.textContent = pendentes;
  if (quickUpcoming) quickUpcoming.textContent = proximas;
  if (quickRating) quickRating.textContent = '4.9';
  if (quickEarnings) quickEarnings.textContent = `R$ ${rendaMes.toFixed(0)}`;

  // Carregar próximas hospedagens
  loadUpcomingBookingsHome(hostRequests);
}

/*Função para carregar próximas hospedagens na home */
function loadUpcomingBookingsHome(hostRequests) {
  const container = document.getElementById('upcoming-bookings-list');
  if (!container) return;

  const upcoming = hostRequests
    .filter(r => r.status === 'Aceita' && new Date(r.checkin) >= new Date())
    .slice(0, 5);

  if (upcoming.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="icon">📅</div>
        <p>Nenhuma hospedagem agendada</p>
        <p style="font-size: 0.9rem;">Quando receber reservas, elas aparecerão aqui</p>
      </div>
    `;
  } else {
    container.innerHTML = upcoming.map(booking => `
      <div class="booking-card">
        <div class="booking-header">
          <div class="booking-pet">
            <div class="pet-avatar">${booking.petId ? booking.petId.charAt(0).toUpperCase() : '🐕'}</div>
            <div>
              <strong>${booking.hostName}</strong>
              <div style="color: var(--muted); font-size: 0.9rem;">${booking.checkin} → ${booking.checkout}</div>
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-weight: 600; color: var(--accent);">R$ ${booking.precoEstimado.toFixed(2)}</div>
            <div style="color: var(--muted); font-size: 0.9rem;">${booking.days} diárias</div>
          </div>
        </div>
      </div>
    `).join('');
  }
}
/* Função universal para atualizar navegação em todas as páginas */
function updateUniversalNavigation() {
  const session = getSession();
  const userLogged = document.getElementById('user-logged');
  const authLinks = document.getElementById('auth-links');
  const userName = document.getElementById('user-name');
  const linkMinhaArea = document.getElementById('link-minha-area');
  const linkLogout = document.getElementById('link-logout');
  const hostNav = document.getElementById('host-nav');
  const normalNav = document.getElementById('normal-nav');
  const becomeHostLink = document.getElementById('become-host-link');

  if (session) {
    // Usuário LOGADO
    if (userLogged) userLogged.style.display = 'flex';
    if (authLinks) authLinks.style.display = 'none';
    if (userName) userName.textContent = session.nome || session.email.split('@')[0];

    // Configurar link Minha Área baseado no tipo de usuário
    if (linkMinhaArea) {
      if (session.tipo === 'dono') {
        linkMinhaArea.innerHTML = '<span>🐕</span> Minha Área (Dono)';
        linkMinhaArea.href = 'dono.html';
      } else if (session.tipo === 'anfitriao') {
        linkMinhaArea.innerHTML = '<span>🏠</span> Minha Área (Anfitrião)';
        linkMinhaArea.href = 'anfitriao-dashboard.html';
      }
    }

    // Mostrar/ocultar navegação específica
    if (hostNav && session.tipo === 'anfitriao') {
      hostNav.style.display = 'flex';
      if (normalNav) normalNav.style.display = 'none';
      if (becomeHostLink) becomeHostLink.style.display = 'none';
    } else {
      if (hostNav) hostNav.style.display = 'none';
      if (normalNav) normalNav.style.display = 'flex';
    }

    // Configurar logout
    if (linkLogout) {
      linkLogout.onclick = function(e) {
        e.preventDefault();
        if (confirm('Deseja sair da sua conta?')) {
          clearSession();
          window.location.href = '../index.html';
        }
      };
    }
  } else {
    // Usuário NÃO LOGADO
    if (userLogged) userLogged.style.display = 'none';
    if (authLinks) authLinks.style.display = 'flex';
    if (hostNav) hostNav.style.display = 'none';
    if (normalNav) normalNav.style.display = 'flex';
    if (becomeHostLink) becomeHostLink.style.display = 'flex';
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
  updateUniversalNavigation();
  updateHeaderBasedOnUserType(); 
  //updateNavigation();


  const currentPath = window.location.pathname;
  const currentPage = currentPath.split('/').pop();
  
  if (currentPage === 'index.html' || currentPage === '' || currentPath.endsWith('/')) {
    handleHomePage();
  }

 
  if (currentPage === 'anfitriao-dashboard.html' || currentPath.includes('anfitriao-dashboard')) {
    handleAnfitriaoDashboard();
  }

  // modal close por clique no overlay
  document.addEventListener('click', e=>{
    const modal = document.getElementById('modal');
    if(!modal) return;
    if(e.target === modal) modal.setAttribute('aria-hidden','true');
  });
}

document.addEventListener('DOMContentLoaded', init);