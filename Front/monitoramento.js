// monitoramento.js

// 'auth' e 'db' são importados globalmente do firebase-config.js
// que deve ser carregado antes deste script no HTML.

document.addEventListener('DOMContentLoaded', () => {
    // --- Referências aos elementos HTML da Navbar e Info do Usuário ---
    const userDropdownToggle = document.getElementById('user-dropdown-toggle');
    const userDefaultAvatarSpan = document.getElementById('userDefaultAvatar');
    const userProfilePictureImg = document.getElementById('userProfilePicture');
    const userNameDisplaySpan = document.getElementById('userNameDisplay'); // ONDE APARECE "Carregando..." OU O NOME NA NAVBAR
    const logoutBtn = document.getElementById('logout-btn'); // Botão Sair dentro do dropdown

    // --- Referências aos elementos HTML dos Cards de Resumo e Modais ---
    const slotsAvailableValue = document.getElementById('slots-available-value');
    const slotsFreeStatus = document.getElementById('slots-free-status');
    const monitorsCountValue = document.getElementById('monitors-count-value');
    const monitorsActiveStatus = document.getElementById('monitors-active-status');
    const monitoringListSection = document.getElementById('monitoring-list');
    const initialNoMonitoramentoMessage = document.getElementById('initial-no-monitoramento-message');

    // NOVAS REFERÊNCIAS PARA OS SPANS DENTRO DA SEÇÃO PRINCIPAL (SE ESTIVEREM LÁ)
    // Se você tem este bloco no seu monitoramento.html, certifique-se que estas IDs correspondem:
    // <p>Você está logado como: <span id="user-email">Carregando...</span></p>
    // <p>Seu Nome Completo: <span id="user-fullname">Carregando...</span></p>
    // <p>Seu Usuário: <span id="user-username">Carregando...</span></p>
    const userEmailSpan = document.getElementById('user-email');
    const userFullNameSpan = document.getElementById('user-fullname');
    const userUsernameSpan = document.getElementById('user-username');


    // Modais e Botões (mantidos do seu código original)
    const openNewMonitoramentoModalBtn = document.getElementById('open-new-monitoramento-modal');
    const createFirstMonitoramentoBtn = document.getElementById('create-first-monitoramento-btn');
    const chooseTypeModal = document.getElementById('choose-type-modal');
    const personalMonitoramentoModal = document.getElementById('personal-monitoramento-modal');
    const radarMonitoramentoModal = document.getElementById('radar-monitoramento-modal');
    const monitoramentoAtivadoModal = document.getElementById('monitoramento-ativado-modal');
    const modalCloseButtons = document.querySelectorAll('.modal-close-btn');
    const btnCancelModal = document.querySelector('#choose-type-modal .btn-cancel-modal');
    const btnCancelForms = document.querySelectorAll('.modal-form .btn-cancel-form');
    const typeOptionCards = document.querySelectorAll('.type-option-card');

    // Formulários
    const personalMonitoringForm = document.getElementById('personal-monitoring-form');
    const radarMonitoringForm = document.getElementById('radar-monitoring-form');

    // Modal de Ativação (Progresso)
    const progressBar = document.getElementById('progress-bar');
    const progressPercentage = document.getElementById('progress-percentage');
    const activationSteps = document.querySelectorAll('.activation-step');
    const activationCompletedMessage = document.querySelector('.activation-completed-message');

    // --- URL base do seu backend FastAPI ---
    const BACKEND_URL = "https://conecta-edital.onrender.com";

    // --- Funções Auxiliares de UI (Mantidas) ---
    function openModal(modalElement) {
        if (modalElement) {
            modalElement.classList.add('show-modal');
            document.body.style.overflow = 'hidden';
        } else {
            console.error("Erro: Tentativa de abrir um modal nulo.");
        }
    }

    function closeModal(modalElement) {
        if (modalElement) {
            modalElement.classList.remove('show-modal');
            if (modalElement === personalMonitoramentoModal && personalMonitoringForm) personalMonitoringForm.reset();
            if (modalElement === radarMonitoramentoModal && radarMonitoringForm) radarMonitoringForm.reset();

            const anyModalOpen = document.querySelector('.modal-overlay.show-modal');
            if (!anyModalOpen) {
                document.body.style.overflow = '';
            }
        } else {
            console.error("Erro: Tentativa de fechar um modal nulo.");
        }
    }

    function closeAllModals() {
        document.querySelectorAll('.modal-overlay.show-modal').forEach(modal => {
            modal.classList.remove('show-modal');
            if (modal === personalMonitoramentoModal && personalMonitoringForm) personalMonitoringForm.reset();
            if (modal === radarMonitoramentoModal && radarMonitoringForm) radarMonitoringForm.reset();
        });
        document.body.style.overflow = '';
    }

    // --- Lógica de Autenticação do Firebase e Carregamento de Dados do Usuário ---

    // Listener para o estado de autenticação do Firebase
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            // Usuário está logado
            console.log('Usuário logado:', user.email, user.uid);

            // 1. Lidar com a Foto de Perfil / Avatar Padrão
            if (user.photoURL) {
                userProfilePictureImg.src = user.photoURL;
                userProfilePictureImg.style.display = 'block';
                userDefaultAvatarSpan.style.display = 'none';
            } else {
                // Sem foto, mostra a inicial do nome ou email
                userDefaultAvatarSpan.textContent = (user.displayName || user.email).charAt(0).toUpperCase();
                userDefaultAvatarSpan.style.display = 'flex'; // Exibe o span do avatar
                userProfilePictureImg.style.display = 'none';
            }

            // 2. Buscar informações adicionais do Firestore (Nome Completo, Usuário, Contato)
            try {
                const docRef = db.collection('users').doc(user.uid);
                const doc = await docRef.get();

                if (doc.exists) {
                    const userData = doc.data();
                    console.log('Dados do usuário do Firestore:', userData);

                    // ***** LINHAS CRUCIAIS PARA EXIBIR O NOME/USUÁRIO NA UI *****
                    // Atualiza o nome exibido na NAVBAR (prioriza fullName do Firestore)
                    userNameDisplaySpan.textContent = userData.fullName || user.displayName || user.email;
                    
                    // Preenche os spans na seção principal (se existirem no HTML)
                    if (userEmailSpan) userEmailSpan.textContent = userData.email || user.email;
                    if (userFullNameSpan) userFullNameSpan.textContent = userData.fullName || 'Não informado';
                    if (userUsernameSpan) userUsernameSpan.textContent = userData.username || 'Não informado';
                    // **********************************************************
                    
                } else {
                    console.log("Nenhum documento de usuário encontrado no Firestore para este UID.");
                    // Se o documento não existe no Firestore, ainda mostra o nome de display do Firebase Auth ou email na navbar
                    userNameDisplaySpan.textContent = user.displayName || user.email; 
                }
            } catch (error) {
                console.error("Erro ao buscar dados do Firestore:", error);
                // Mesmo em caso de erro, tenta mostrar algo na navbar
                userNameDisplaySpan.textContent = user.displayName || user.email;
            }

            // Inicia o carregamento dos monitoramentos e cards de resumo
            await loadMonitorings();
            await updateSummaryCards();

        } else {
            // Usuário NÃO está logado, redirecionar para a página de login
            console.log('Usuário não logado. Redirecionando para login.');
            alert('Sua sessão expirou ou você não está logado. Por favor, faça login novamente.');
            window.location.href = 'login-cadastro.html';
        }
    });

    // --- Lógica do Logout ---
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                await auth.signOut(); // Desloga o usuário do Firebase
                window.location.href = 'index.html'; // Redireciona para a página de login
            } catch (error) {
                console.error("Erro ao fazer logout:", error);
                alert('Ocorreu um erro ao tentar sair. Por favor, tente novamente.');
            }
        });
    }

    // --- Lógica do Dropdown do Menu de Usuário (mostrar/esconder) ---
    if (userDropdownToggle) {
        userDropdownToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdownToggle.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!userDropdownToggle.contains(e.target)) {
                userDropdownToggle.classList.remove('active');
            }
        });
    }

    /**
     * Função auxiliar para lidar com erros de autenticação da API.
     */
    async function handleApiAuthError(response) {
        if (response.status === 401 || response.status === 403) {
            console.error("Token de autenticação inválido ou expirado. Redirecionando para login.");
            await auth.signOut();
            window.location.href = 'login-cadastro.html';
            return true;
        }
        return false;
    }

    /**
     * Atualiza os cards de resumo no topo da página e a mensagem de "sem monitoramentos".
     */
    async function updateSummaryCards() {
        const user = auth.currentUser;
        if (!user) { return null; }

        try {
            const idToken = await user.getIdToken();
            const response = await fetch(`${BACKEND_URL}/api/status`, {
                headers: { 'Authorization': `Bearer ${idToken}` }
            });

            if (await handleApiAuthError(response)) return null;
            if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`); }
            const data = await response.json();

            if (slotsAvailableValue) slotsAvailableValue.textContent = `${data.total_monitoramentos}/${data.total_slots}`;
            if (slotsFreeStatus) slotsFreeStatus.textContent = `${data.slots_livres} livre${data.slots_livres !== 1 ? 's' : ''}`;
            if (monitorsCountValue) monitorsCountValue.textContent = `${data.total_monitoramentos}`;
            if (monitorsActiveStatus) monitorsActiveStatus.textContent = `${data.monitoramentos_ativos} ativo${data.monitoramentos_ativos !== 1 ? 's' : ''}`;

            if (initialNoMonitoramentoMessage) {
                if (data.total_monitoramentos === 0) { initialNoMonitoramentoMessage.style.display = 'flex'; } else { initialNoMonitoramentoMessage.style.display = 'none'; }
            }
            return data;
        } catch (error) {
            console.error("Erro ao buscar status do backend:", error);
            slotsAvailableValue.textContent = 'N/A';
            slotsFreeStatus.textContent = 'Erro';
            monitorsCountValue.textContent = 'N/A';
            monitorsActiveStatus.textContent = 'Erro';
            if (initialNoMonitoramentoMessage) initialNoMonitoramentoMessage.style.display = 'flex';
            return null;
        }
    }

    // Função para simular a progressão do modal de ativação (mantida)
    function startActivationProgress(monitoringData) {
        let progress = 0; let stepIndex = 0; const totalSteps = activationSteps.length; const progressPerStep = 100 / totalSteps;
        if (!progressBar || !progressPercentage || activationSteps.length === 0 || !activationCompletedMessage) {
            console.error("Erro: Elementos do modal de ativação não encontrados."); closeAllModals(); if (monitoringData) { loadMonitorings(); } return; }
        progressBar.style.width = '0%'; progressPercentage.textContent = '0%'; activationSteps.forEach(step => {
            step.classList.remove('active', 'completed'); step.querySelector('.icon-spinning').style.display = 'block'; step.querySelector('.icon-check').style.display = 'none'; step.querySelector('.step-status-icon').style.backgroundColor = '#e0e0e0'; step.querySelector('.step-status-icon').style.color = '#6c757d'; step.querySelector('.icon-spinning').style.animation = 'none'; }); activationCompletedMessage.style.display = 'none';
        const progressInterval = setInterval(() => {
            if (stepIndex < totalSteps) { if (stepIndex > 0) { const prevStep = activationSteps[stepIndex - 1]; prevStep.classList.remove('active'); prevStep.classList.add('completed'); prevStep.querySelector('.icon-spinning').style.display = 'none'; prevStep.querySelector('.icon-check').style.display = 'block'; prevStep.querySelector('.step-status-icon').style.backgroundColor = 'green'; prevStep.querySelector('.step-status-icon').style.color = 'white'; prevStep.querySelector('.icon-spinning').style.animation = 'none'; } const currentStep = activationSteps[stepIndex]; currentStep.classList.add('active'); currentStep.querySelector('.icon-spinning').style.animation = 'spin 1s linear infinite'; currentStep.querySelector('.step-status-icon').style.backgroundColor = '#007bff'; currentStep.querySelector('.step-status-icon').style.color = 'white';
                progress = (stepIndex + 1) * progressPerStep; progressBar.style.width = `${progress}%`; progressPercentage.textContent = `${Math.round(progress)}%`; stepIndex++;
            } else { clearInterval(progressInterval);
                const lastStep = activationSteps[totalSteps - 1]; lastStep.classList.remove('active'); lastStep.classList.add('completed'); lastStep.querySelector('.icon-spinning').style.display = 'none'; lastStep.querySelector('.icon-check').style.display = 'block'; lastStep.querySelector('.step-status-icon').style.backgroundColor = 'green'; lastStep.querySelector('.step-status-icon').style.color = 'white'; lastStep.querySelector('.icon-spinning').style.animation = 'none';
                activationCompletedMessage.style.display = 'block'; setTimeout(() => { closeModal(monitoramentoAtivadoModal); loadMonitorings(); console.log("Monitoramento criado e adicionado à lista. Voltando para a página principal."); }, 1500); } }, 1000);
    }

    /** Cria o elemento HTML de um item de monitoramento (mantida) */
    function createMonitoringItemHTML(mon) {
        const itemCard = document.createElement('div'); itemCard.classList.add('monitoramento-item-card'); itemCard.dataset.id = mon.id;
        let titleIconClass = ''; let typeBadgeText = ''; let detailsHtml = '';
        if (mon.monitoring_type === 'personal') { titleIconClass = 'fas fa-user'; typeBadgeText = 'Pessoal'; detailsHtml = `
                <div class="detail-item"><i class="fas fa-user" style="color:purple"></i><span>Nome do Candidato(a)</span><p><strong>${mon.candidate_name || 'N/A'}</strong></p></div>
                <div class="detail-item"><i class="fas fa-id-card" style="color: #ffc107"></i><span>ID do Edital / Concurso</span><p><strong>${mon.edital_identifier || 'N/A'}</strong></p></div>
                <div class="detail-item"><i class="fas fa-key"></i><span>Palavras-chave Monitoradas</span><div class="keyword-tags"  > ${(mon.keywords || mon.candidate_name || '').split(',').map(k => `<span class="keyword-tag">${k.trim()}</span>`).join('')}</div></div>
            `;
        } else if (mon.monitoring_type === 'radar') { titleIconClass = 'fas fa-bullseye'; typeBadgeText = 'Radar'; detailsHtml = `
                <div class="detail-item"><i class="fas fa-id-card"style="color: #ffc107"></i><span>ID do Edital / Concurso</span><p><strong>${mon.edital_identifier || 'N/A'}</strong></p></div>
                <div class="detail-item1"><i class="fas fa-key"></i><span>Palavras-chave Monitoradas</span><div class="keyword-tags">${(mon.keywords || mon.edital_identifier || '').split(',').map(k => `<span class="keyword-tag">${k.trim()}</span>`).join('')}</div></div>
            `;
        }
        itemCard.innerHTML = `
            <div class="item-header"><div class="item-header-title"><i class="${titleIconClass}"></i><h3>Monitoramento ${typeBadgeText} - ${mon.edital_identifier || mon.id}</h3><button class="edit-btn" data-id="${mon.id}" title="Editar monitoramento"><i class="fas fa-pencil-alt"></i></button><button class="favorite-btn" data-id="${mon.id}" title="Marcar como favorito"><i class="far fa-star"></i></button></div><span class="status-tag monitoring">${mon.status === 'active' ? 'Monitorando' : 'Inativo'}</span></div>
            <div class="item-details-grid">${detailsHtml}
                <div class="detail-item"><i class="fas fa-book-open" style="color:blue"></i><span>Diário Oficial</span><p><a href="${mon.official_gazette_link || '#'}" target="_blank" class="link-diario">Acessar Diário Oficial</a></p></div>
                <div class="detail-item"><i class="fas fa-sync-alt"></i><span>Última Verificação</span><p><strong>${mon.last_checked_at ? new Date(mon.last_checked_at).toLocaleString('pt-BR') : 'Nunca verificado'}</strong></p></div>
                <div class="detail-item"><i class="fas fa-search"></i><span>Ocorrências</span><p class="occurrences-count"><strong>${mon.occurrences || 0} ocorrência(s)</strong> <a href="#" class="view-history-link">Ver Histórico</a></p></div>
                <div class="detail-item"><i class="fas fa-bell" style="color:purple"></i><span>Status das Notificações</span><div class="notification-status"><span class="notification-tag email-enabled">Email</span><span class="notification-tag whatsapp-enabled">WhatsApp</span></div></div>
            </div>
            <div class="item-actions"><div class="toggle-switch"><input type="checkbox" id="toggle-monitoramento-${mon.id}" ${mon.status === 'active' ? 'checked' : ''} data-id="${mon.id}"><label for="toggle-monitoramento-${mon.id}">Ativo</label></div><div class="action-buttons"><button class="btn-action btn-configure" data-id="${mon.id}"><i class="fas fa-cog"></i> Configurar</button><button class="btn-action btn-test" data-id="${mon.id}"><i class="fas fa-play"></i> Testar</button><button class="btn-action btn-delete" data-id="${mon.id}"><i class="fas fa-trash-alt"></i> Excluir</button></div></div>
        `; return itemCard;
    }

    /** Carrega e exibe os monitoramentos buscando-os do backend (mantida) */
    async function loadMonitorings() {
        if (monitoringListSection) { Array.from(monitoringListSection.children).forEach(child => { if (child.id !== 'initial-no-monitoramento-message') { child.remove(); } }); }
        const user = auth.currentUser; if (!user) { console.warn("Nenhum usuário logado para carregar monitoramentos."); if (initialNoMonitoramentoMessage) initialNoMonitoramentoMessage.style.display = 'flex'; return; }
        try { const idToken = await user.getIdToken(); const response = await fetch(`${BACKEND_URL}/api/monitoramentos`, { headers: { 'Authorization': `Bearer ${idToken}` } });
            if (await handleApiAuthError(response)) return; if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`); } const monitoramentos = await response.json();
            if (monitoramentos.length > 0) { initialNoMonitoramentoMessage.style.display = 'none'; monitoramentos.forEach(mon => { const newItem = createMonitoringItemHTML(mon); if (monitoringListSection) { monitoringListSection.prepend(newItem); } }); } else { initialNoMonitoramentoMessage.style.display = 'flex'; } updateSummaryCards();
        } catch (error) { console.error("Erro ao carregar monitoramentos do backend:", error); if (initialNoMonitoramentoMessage) initialNoMonitoramentoMessage.style.display = 'flex'; }
    }

    /** Exclui um monitoramento via API e recarrega a lista (mantida) */
    const deleteMonitoring = async (id) => {
        if (!confirm('Tem certeza que deseja excluir este monitoramento?')) { return; }
        const user = auth.currentUser; if (!user) { alert("Você não está logado."); return; } const idToken = await user.getIdToken();
        try { const response = await fetch(`${BACKEND_URL}/api/monitoramentos/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${idToken}` } });
            if (await handleApiAuthError(response)) return; if (response.status === 204) { console.log(`Monitoramento ${id} excluído com sucesso!`); loadMonitorings(); } else if (response.status === 404) { alert('Monitoramento não encontrado.'); console.warn(`Monitoramento ${id} não encontrado no backend.`); } else { const errorData = await response.json(); throw new Error(errorData.detail || 'Erro desconhecido ao excluir.'); }
        } catch (error) { console.error("Erro ao excluir monitoramento:", error); alert(`Falha ao excluir monitoramento: ${error.message}`); }
    };

    /** Alterna o status (ativo/inativo) de um monitoramento via API (mantida) */
    const toggleMonitoringStatus = async (id, isActive) => {
        const user = auth.currentUser; if (!user) { alert("Você não está logado."); return; } const idToken = await user.getIdToken();
        try { const response = await fetch(`${BACKEND_URL}/api/monitoramentos/${id}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${idToken}` }, body: JSON.stringify({ active: isActive }) });
            if (await handleApiAuthError(response)) return; if (response.ok) { console.log(`Monitoramento ${id} status alterado para ${isActive ? 'Ativo' : 'Inativo'}.`); const statusTag = document.querySelector(`[data-id="${id}"] .status-tag`); if (statusTag) { statusTag.textContent = isActive ? 'Monitorando' : 'Inativo'; } updateSummaryCards(); } else { const errorData = await response.json(); throw new Error(errorData.detail || 'Erro desconhecido ao alternar status.'); }
        } catch (error) { console.error("Erro ao alternar status do monitoramento:", error); alert(`Falha ao alternar status: ${error.message}`); const checkbox = document.getElementById(`toggle-monitoramento-${id}`); if (checkbox) { checkbox.checked = !isActive; } }
    };

    /** Dispara uma verificação de teste para um monitoramento via API (mantida) */
    const testMonitoring = async (id) => {
        const user = auth.currentUser; if (!user) { alert("Você não está logado."); return; } const idToken = await user.getIdToken();
        try { const response = await fetch(`${BACKEND_URL}/api/monitoramentos/${id}/test`, { method: 'POST', headers: { 'Authorization': `Bearer ${idToken}` } });
            if (await handleApiAuthError(response)) return; if (response.ok) { const result = await response.json(); console.log(`Teste de monitoramento ${id} disparado com sucesso!`, result); alert('Teste de monitoramento iniciado! Verifique os logs do backend para o resultado e seu email se uma ocorrência for encontrada.'); } else { const errorData = await response.json(); throw new Error(errorData.detail || 'Erro desconhecido ao testar.'); }
        } catch (error) { console.error("Erro ao testar monitoramento:", error); alert(`Falha ao testar monitoramento: ${error.message}`); }
    };


    // --- Listeners de Eventos Globais (Modais e Formulários) (mantidos) ---

    if (openNewMonitoramentoModalBtn) { openNewMonitoramentoModalBtn.addEventListener('click', async () => { const status = await updateSummaryCards(); if (status && status.slots_livres <= 0) { alert('Você atingiu o limite de monitoramentos para o seu plano. Faça upgrade para adicionar mais!'); return; } openModal(chooseTypeModal); }); }
    if (createFirstMonitoramentoBtn) { createFirstMonitoramentoBtn.addEventListener('click', async () => { const status = await updateSummaryCards(); if (status && status.slots_livres <= 0) { alert('Você atingiu o limite de monitoramentos para o seu plano. Faça upgrade para adicionar mais!'); return; } openModal(chooseTypeModal); }); }
    modalCloseButtons.forEach(btn => { btn.addEventListener('click', (e) => { const modalId = e.currentTarget.dataset.modalId; const modalToClose = document.getElementById(modalId); closeModal(modalToClose); }); });
    if (btnCancelModal) { btnCancelModal.addEventListener('click', () => { closeModal(chooseTypeModal); }); }
    btnCancelForms.forEach(btn => { btn.addEventListener('click', () => { closeModal(personalMonitoramentoModal); closeModal(radarMonitoramentoModal); openModal(chooseTypeModal); }); });
    document.querySelectorAll('.modal-overlay').forEach(overlay => { overlay.addEventListener('click', (e) => { if (e.target === overlay) { closeAllModals(); } }); });
    typeOptionCards.forEach(card => { const btnSelectType = card.querySelector('.btn-select-type'); const btnSelectType1 = card.querySelector('.btn-select-type1');
        const handleTypeSelection = async (e) => { e.stopPropagation(); const type = card.dataset.type;
            const status = await updateSummaryCards(); if (status && status.slots_livres <= 0) { alert('Você atingiu o limite de monitoramentos para o seu plano. Faça upgrade para adicionar mais!'); closeModal(chooseTypeModal); return; }
            closeModal(chooseTypeModal);
            if (type === 'personal') { openModal(personalMonitoramentoModal); } else if (type === 'radar') { openModal(radarMonitoramentoModal); } };
        if (btnSelectType) btnSelectType.addEventListener('click', handleTypeSelection); if (btnSelectType1) btnSelectType1.addEventListener('click', handleTypeSelection);
    });

    // Enviar formulários de Monitoramento para o Backend (mantido)
    if (personalMonitoringForm) { personalMonitoringForm.addEventListener('submit', async (event) => { event.preventDefault(); const link = document.getElementById('personal-link').value; const id = document.getElementById('personal-id').value; const name = document.getElementById('personal-name').value;
            if (!link || !id || !name) { alert('Por favor, preencha todos os campos obrigatórios para Monitoramento Pessoal.'); return; }
            const user = auth.currentUser; if (!user) { alert("Você não está logado."); return; } const idToken = await user.getIdToken();
            try { const response = await fetch(`${BACKEND_URL}/api/monitoramentos/pessoal`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${idToken}` }, body: JSON.stringify({ link_diario: link, id_edital: id, nome_completo: name }) });
                if (await handleApiAuthError(response)) return; if (response.ok) { const result = await response.json(); console.log('Monitoramento pessoal criado com sucesso:', result); closeModal(personalMonitoramentoModal); openModal(monitoramentoAtivadoModal); startActivationProgress(result); } else { const errorData = await response.json(); alert(`Erro ao criar monitoramento pessoal: ${errorData.detail || 'Erro desconhecido.'}`); console.error('Erro ao criar monitoramento pessoal:', errorData); }
            } catch (error) { console.error('Erro na requisição para criar monitoramento pessoal:', error); alert('Ocorreu um erro ao se conectar com o servidor. Verifique se o backend está rodando.'); } }); }
    if (radarMonitoringForm) { radarMonitoringForm.addEventListener('submit', async (event) => { event.preventDefault(); const link = document.getElementById('radar-link').value; const id = document.getElementById('radar-id').value;
            if (!link || !id) { alert('Por favor, preencha todos os campos obrigatórios para Monitoramento Radar.'); return; }
            const user = auth.currentUser; if (!user) { alert("Você não está logado."); return; } const idToken = await user.getIdToken();
            try { const response = await fetch(`${BACKEND_URL}/api/monitoramentos/radar`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${idToken}` }, body: JSON.stringify({ link_diario: link, id_edital: id }) });
                if (await handleApiAuthError(response)) return; if (response.ok) { const result = await response.json(); console.log('Monitoramento radar criado com sucesso:', result); closeModal(radarMonitoramentoModal); openModal(monitoramentoAtivadoModal); startActivationProgress(result); } else { const errorData = await response.json(); alert(`Erro ao criar monitoramento radar: ${errorData.detail || 'Erro desconhecido.'}`); console.error('Erro ao criar monitoramento radar:', errorData); }
            } catch (error) { console.error('Erro na requisição para criar monitoramento radar:', error); alert('Ocorreu um erro ao se conectar com o servidor. Verifique se o backend está rodando.'); } }); }

    // Delegação de Eventos para Itens de Monitoramento Criados Dinamicamente (mantida)
    if (monitoringListSection) { monitoringListSection.addEventListener('change', (e) => { if (e.target.matches('input[type="checkbox"][id^="toggle-monitoramento-"]')) { const monitoringId = e.target.dataset.id; const isActive = e.target.checked; toggleMonitoringStatus(monitoringId, isActive); } });
        monitoringListSection.addEventListener('click', (e) => { const targetButton = e.target.closest('.btn-action'); if (targetButton) { const monitoringId = targetButton.dataset.id; if (targetButton.classList.contains('btn-delete')) { deleteMonitoring(monitoringId); } else if (targetButton.classList.contains('btn-configure')) { console.log(`Botão "Configurar" clicado para ${monitoringId}! (Ainda não implementado)`); alert(`Configurar monitoramento ${monitoringId} - Funcionalidade em desenvolvimento.`); } else if (targetButton.classList.contains('btn-test')) { testMonitoring(monitoringId); } } }); }
});