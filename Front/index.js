document.addEventListener("DOMContentLoaded", () => {
    // 1. Funcionalidade do Acordeão (FAQ)
    // Seleciona todos os elementos com a classe "faq-item"
    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach(item => {
        const question = item.querySelector(".faq-question");
        const answer = item.querySelector(".faq-answer"); // Selecionando a resposta aqui

        question.addEventListener("click", () => {
            const isActive = item.classList.contains("active");

            // Fecha todas as outras respostas antes de abrir a nova
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains("active")) {
                    otherItem.classList.remove("active");
                    const otherAnswer = otherItem.querySelector(".faq-answer");
                    if (otherAnswer) { // Adicionado verificação
                        otherAnswer.style.maxHeight = "0px";
                        otherAnswer.style.paddingTop = "0px";
                        otherAnswer.style.paddingBottom = "0px";
                    }
                }
            });

            // Alterna a resposta clicada
            if (isActive) {
                item.classList.remove("active");
                if (answer) { // Adicionado verificação
                    answer.style.maxHeight = "0px";
                    answer.style.paddingTop = "0px";
                    answer.style.paddingBottom = "0px";
                }
            } else {
                item.classList.add("active");
                if (answer) { // Adicionado verificação
                    // Define max-height para o scrollHeight (altura real do conteúdo)
                    // mais os paddings que serão aplicados, para garantir que não corte o texto
                    answer.style.maxHeight = (answer.scrollHeight + 10 + 20) + "px"; // scrollHeight + paddingTop + paddingBottom
                    answer.style.paddingTop = "10px";
                    answer.style.paddingBottom = "20px";
                }
            }
        });
    });

    // Fecha todas as respostas ao clicar fora da seção de FAQs
    document.addEventListener("click", (event) => {
        const faqAccordionContainer = document.querySelector(".faq-accordion");
        if (faqAccordionContainer && !faqAccordionContainer.contains(event.target)) {
            faqItems.forEach(item => {
                item.classList.remove("active");
                const answer = item.querySelector(".faq-answer");
                if (answer) { // Adicionado verificação
                    answer.style.maxHeight = "0px";
                    answer.style.paddingTop = "0px";
                    answer.style.paddingBottom = "0px";
                }
            });
        }
    });

    // 2. Scroll Suave para links da Navbar
    document.querySelectorAll('.navbar-center-index a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); // Previne o comportamento padrão do link

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Calcula o offset para parar um pouco abaixo da navbar
                const navbarHeight = document.querySelector('.navbar-index').offsetHeight;
                const offsetTop = targetElement.offsetTop - navbarHeight - 20; // -20px para um pouco de espaço extra

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth' // Rola suavemente
                });
            }
        });
    });

    // 3. Funcionalidade opcional para o formulário de upload (apenas demonstração visual)
    const uploadBox = document.querySelector('.upload-box');
    if (uploadBox) {
        uploadBox.addEventListener('click', () => {
            alert('Funcionalidade de upload simulada. Na vida real, abriria um seletor de arquivos.');
        });
    }

    const analisarIaBtn = document.querySelector('.btn-analisar-ia');
    if (analisarIaBtn) {
        analisarIaBtn.addEventListener('click', () => {
            alert('Análise com IA simulada. Na vida real, enviaria dados para um backend.');
        });
    }


    // ===============================================
    // Lógica da Demonstração de Monitoramento
    // ===============================================
    const startDemoBtn = document.getElementById('start-demo-btn');
    const demoStates = document.querySelectorAll('.demo-state'); // Seleciona todos os estados
    let currentStateIndex = 0;
    let demoInterval;

    // Função para mostrar um estado específico
    function showState(index) {
        // Remove a classe 'active-state' de todos e adiciona ao estado correto
        demoStates.forEach((state, i) => {
            if (i === index) {
                state.classList.add('active-state');
            } else {
                state.classList.remove('active-state');
            }
        });
    }

    // Função para iniciar a demonstração
    function startDemo() {
        // Reinicia para o estado inicial
        currentStateIndex = 0;
        showState(currentStateIndex);

        // Limpa qualquer intervalo anterior para evitar duplicação
        if (demoInterval) {
            clearInterval(demoInterval);
        }

        // Avança os estados a cada X segundos
        demoInterval = setInterval(() => {
            currentStateIndex++;
            if (currentStateIndex < demoStates.length) {
                showState(currentStateIndex);
            } else {
                clearInterval(demoInterval); // Para a demonstração no final
                // Opcional: Reiniciar automaticamente após um tempo ou exibir botão de reiniciar
                setTimeout(() => {
                    startDemo(); // Reinicia após 3 segundos
                }, 3000);
            }
        }, 1500); // Duração de cada passo: 1.5 segundos
    }

    // Event Listener para o botão "Veja a IA em Ação"
    if (startDemoBtn) {
        startDemoBtn.addEventListener('click', startDemo);
    }

    // Opcional: Iniciar demonstração no carregamento da página ou ao entrar na viewport
    startDemo(); // <-- Descomente esta linha se quiser que a demonstração inicie automaticamente!

    // Adiciona Intersection Observer para iniciar/pausar se o card entrar/sair da viewport (opcional)
    const demoCard = document.querySelector('.monitoramento-demo-card');
    if (demoCard && 'IntersectionObserver' in window) {
        let observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // console.log('Demo card entrou na viewport, iniciando demo.');
                    // startDemo(); // Descomente para iniciar se entrar na tela
                } else {
                    // console.log('Demo card saiu da viewport, pausando demo.');
                    // clearInterval(demoInterval); // Descomente para pausar se sair da tela
                }
            });
        }, { threshold: 0.5 }); // Dispara quando 50% do elemento está visível
        observer.observe(demoCard);
    }
});