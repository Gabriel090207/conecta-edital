// login-cadastro.js

// 'auth' e 'db' são importados globalmente do firebase-config.js
// que deve ser carregado antes deste script no HTML.

document.addEventListener('DOMContentLoaded', () => {
    // Obtenha referências aos elementos HTML
    const authForm = document.getElementById('auth-form');
    const emailInput = document.getElementById('email-input'); // ID atualizado para email
    const passwordInput = document.getElementById('password');
    const submitBtn = document.getElementById('submit-btn');
    const toggleModeLink = document.getElementById('toggle-mode');
    const errorMessage = document.getElementById('error-message');
    const googleSignInBtn = document.getElementById('google-signin-btn');

    // NOVAS REFERÊNCIAS PARA OS CAMPOS ADICIONAIS:
    const fullNameGroup = document.getElementById('full-name-group');
    const usernameGroup = document.getElementById('username-group');
    const contactGroup = document.getElementById('contact-group');
    const confirmPasswordGroup = document.getElementById('confirm-password-group');

    const fullNameInput = document.getElementById('full-name');
    const usernameInput = document.getElementById('username');
    const contactInput = document.getElementById('contact');
    const confirmPasswordInput = document.getElementById('confirm-password');

    // Variável para controlar o modo atual (Login ou Cadastro)
    let isLoginMode = true; // Começa no modo de login

    // Função para atualizar o texto e a visibilidade dos campos na interface
    function updateUIMode() {
        if (isLoginMode) {
            submitBtn.textContent = 'Entrar';
            toggleModeLink.textContent = 'Cadastre-se';
            toggleModeLink.parentNode.firstChild.nodeValue = 'Não tem uma conta? ';
            document.querySelector('.form-header h2').textContent = 'Bem-vindo(a) de Volta!';
            document.querySelector('.form-header p').textContent = 'Entre ou crie sua conta para acessar o Conecta Edital.';

            // Esconde os campos adicionais no modo Login
            fullNameGroup.style.display = 'none';
            usernameGroup.style.display = 'none';
            contactGroup.style.display = 'none';
            confirmPasswordGroup.style.display = 'none';

            // Define "required" para os campos de login
            emailInput.required = true;
            passwordInput.required = true;
            fullNameInput.required = false;
            usernameInput.required = false;
            contactInput.required = false;
            confirmPasswordInput.required = false;

        } else {
            submitBtn.textContent = 'Cadastrar';
            toggleModeLink.textContent = 'Entrar';
            toggleModeLink.parentNode.firstChild.nodeValue = 'Já tem uma conta? ';
            document.querySelector('.form-header h2').textContent = 'Crie Sua Conta';
            document.querySelector('.form-header p').textContent = 'É rápido e fácil!';

            // Mostra os campos adicionais no modo Cadastro
            fullNameGroup.style.display = 'block';
            usernameGroup.style.display = 'block';
            contactGroup.style.display = 'block';
            confirmPasswordGroup.style.display = 'block';

            // Define "required" para os campos de cadastro
            emailInput.required = true;
            passwordInput.required = true;
            fullNameInput.required = true;
            usernameInput.required = true;
            contactInput.required = true;
            confirmPasswordInput.required = true;
        }
        errorMessage.style.display = 'none'; // Limpa mensagens de erro anteriores ao mudar de modo
        // Limpa os campos quando o modo muda para evitar dados residuais
        emailInput.value = '';
        passwordInput.value = '';
        fullNameInput.value = '';
        usernameInput.value = '';
        contactInput.value = '';
        confirmPasswordInput.value = '';
    }

    // Evento para alternar entre os modos de login e cadastro
    toggleModeLink.addEventListener('click', (e) => {
        e.preventDefault(); // Evita que o link recarregue a página
        isLoginMode = !isLoginMode; // Inverte o modo
        updateUIMode(); // Atualiza a interface
    });

    // Lida com o envio do formulário (Login ou Cadastro)
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evita o envio padrão do formulário
        const email = emailInput.value;
        const password = passwordInput.value;
        errorMessage.style.display = 'none'; // Esconde a mensagem de erro antes de uma nova tentativa

        try {
            if (isLoginMode) {
                // Tenta fazer o login com e-mail e senha
                await auth.signInWithEmailAndPassword(email, password);
                console.log('Login bem-sucedido!');
                alert('Login bem-sucedido!');
                // Redireciona para a página de monitoramento após o login.
                window.location.href = 'monitoramento.html'; 
            } else {
                // Modo de Cadastro
                const fullName = fullNameInput.value;
                const username = usernameInput.value;
                const contact = contactInput.value;
                const confirmPassword = confirmPasswordInput.value;

                // Validação de senhas
                if (password !== confirmPassword) {
                    errorMessage.textContent = 'As senhas não coincidem.';
                    errorMessage.style.display = 'block';
                    return; // Interrompe a função se as senhas não forem iguais
                }

                // Tenta criar uma nova conta com e-mail e senha
                const userCredential = await auth.createUserWithEmailAndPassword(email, password);
                const user = userCredential.user;

                // Salva informações adicionais do usuário no Firestore
                await db.collection('users').doc(user.uid).set({
                    email: user.email,
                    fullName: fullName,
                    username: username,
                    contact: contact,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });

                console.log('Cadastro bem-sucedido!', user);
                alert('Cadastro bem-sucedido! Você já pode entrar.');
                isLoginMode = true; // Volta para o modo de login após o cadastro
                updateUIMode(); // Atualiza a interface para o modo de login
            }
        } catch (error) {
            // Captura e exibe erros de autenticação do Firebase
            console.error('Erro de autenticação:', error);
            errorMessage.textContent = getFriendlyErrorMessage(error.code);
            errorMessage.style.display = 'block';
        }
    });

    // Lida com o login usando a conta Google
    googleSignInBtn.addEventListener('click', async () => {
        const provider = new firebase.auth.GoogleAuthProvider(); // Provedor de autenticação Google
        try {
            const result = await auth.signInWithPopup(provider); // Abre pop-up para login Google
            const user = result.user; // Obtém os dados do usuário logado via Google

            // Checa se o usuário já existe no Firestore, se não, adiciona
            const userRef = db.collection('users').doc(user.uid);
            const doc = await userRef.get();

            if (!doc.exists) {
                await userRef.set({
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            }

            console.log('Login com Google bem-sucedido!', user);
            alert('Login com Google bem-sucedido!');
            window.location.href = 'monitoramento.html'; // Redireciona para a página de monitoramento após login Google
        } catch (error) {
            console.error('Erro no login com Google:', error);
            errorMessage.textContent = getFriendlyErrorMessage(error.code);
            errorMessage.style.display = 'block';
        }
    });

    // Função auxiliar para traduzir códigos de erro do Firebase para mensagens amigáveis
    function getFriendlyErrorMessage(errorCode) {
        switch (errorCode) {
            case 'auth/email-already-in-use':
                return 'Este e-mail já está em uso. Tente entrar ou redefinir a senha.';
            case 'auth/invalid-email':
                return 'Endereço de e-mail inválido.';
            case 'auth/weak-password':
                return 'A senha deve ter pelo menos 6 caracteres.';
            case 'auth/user-not-found':
            case 'auth/wrong-password':
                return 'E-mail ou senha incorretos.';
            case 'auth/network-request-failed':
                return 'Erro de conexão. Verifique sua internet.';
            case 'auth/popup-closed-by-user':
                return 'Login com Google cancelado. A janela pop-up foi fechada.';
            case 'auth/cancelled-popup-request':
                return 'Login com Google já em andamento. Tente novamente.';
            default:
                return 'Ocorreu um erro inesperado. Por favor, tente novamente.';
        }
    }

    // Configuração inicial da interface ao carregar a página
    updateUIMode();
});