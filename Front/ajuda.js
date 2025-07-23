
    // 1. Funcionalidade do Acordeão (FAQ)
  document.addEventListener('DOMContentLoaded', () => {
    // 1. Funcionalidade do Acordeão (FAQ)
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Fecha todos os outros itens abertos
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    if (otherAnswer) {
                        otherAnswer.style.maxHeight = '0px';
                        // Zera os paddings ao fechar
                        otherAnswer.style.paddingTop = '0px';
                        otherAnswer.style.paddingBottom = '0px';
                    }
                }
            });

            // Alterna a resposta clicada
            if (isActive) {
                item.classList.remove('active');
                if (answer) {
                    answer.style.maxHeight = '0px';
                    // Zera os paddings ao fechar
                    answer.style.paddingTop = '0px';
                    answer.style.paddingBottom = '0px';
                }
            } else {
                item.classList.add('active');
                if (answer) {
                    // **CRUCIAL: Primeiro zera os paddings para obter o scrollHeight APENAS do conteúdo.**
                    answer.style.paddingTop = '0px';
                    answer.style.paddingBottom = '0px';
                    // Agora, calcula o max-height necessário: scrollHeight do conteúdo + paddings que queremos ANTES de aplicá-los
                    const contentHeight = answer.scrollHeight; // Altura real do <p>
                    const desiredPaddingTop = 15; // De acordo com o CSS
                    const desiredPaddingBottom = 15; // De acordo com o CSS
                    
                    answer.style.maxHeight = (contentHeight + desiredPaddingTop + desiredPaddingBottom) + 'px';
                    
                    // E depois aplica os paddings para que o CSS os anime
                    answer.style.paddingTop = desiredPaddingTop + 'px';
                    answer.style.paddingBottom = desiredPaddingBottom + 'px';
                }
            }
        });
    });

    // ... (restante do seu JavaScript) ...
    // 2. Funcionalidade do Chatbot (ações rápidas e simulação de resposta)
    const quickActionBtns = document.querySelectorAll('.quick-action-btn');
    const chatbotInput = document.querySelector('.chatbot-input input');
    const sendBtn = document.querySelector('.chatbot-input .send-btn');
    const chatbotMessages = document.querySelector('.chatbot-messages');
    const quantosPlanosResposta = document.querySelector('.message-bubble.show-on-click');

    quickActionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const questionText = btn.textContent.trim();

            // Simula o envio da pergunta do usuário
            const userMessage = document.createElement('div');
            userMessage.classList.add('message-bubble', 'sent'); // Crie uma classe 'sent' no CSS se quiser estilizar mensagens enviadas
            userMessage.textContent = questionText;
            // chatbotMessages.appendChild(userMessage); // Descomente se quiser mostrar a pergunta do usuário

            // Simula a resposta da Conectinha
            if (questionText.includes('Quantos planos tem?')) {
                quantosPlanosResposta.style.display = 'block'; // Mostra a resposta oculta
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight; // Rola para o final
            } else {
                // Esconde a resposta de planos se outra pergunta for feita
                quantosPlanosResposta.style.display = 'none';

                // Simula uma resposta genérica para outras perguntas
                const genericReply = document.createElement('div');
                genericReply.classList.add('message-bubble', 'received');
                genericReply.textContent = `Entendido! Para "${questionText}", a Conectinha está buscando a melhor resposta. Por favor, aguarde ou tente ser mais específico.`;
                // chatbotMessages.appendChild(genericReply);
                // chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            }
        });
    });

    sendBtn.addEventListener('click', () => {
        const userQuestion = chatbotInput.value.trim();
        if (userQuestion) {
            alert(`Sua pergunta: "${userQuestion}" seria enviada para a Conectinha.`);
            // Aqui você enviaria a pergunta para um backend/API de chatbot
            chatbotInput.value = ''; // Limpa o input
            // Esconde a resposta de planos se o usuário digitar
            quantosPlanosResposta.style.display = 'none';
        }
    });

    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendBtn.click(); // Simula o clique no botão de enviar
        }
    });

    // 3. Funcionalidade da barra de busca (apenas simulação)
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            // console.log('Buscando por:', searchInput.value);
            // Aqui você implementaria a lógica de filtragem dos FAQs
        });
    }

    // 4. Funcionalidade dos botões de filtro (apenas simulação de ativação)
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            // console.log('Filtro ativado:', button.textContent.trim());
            // Aqui você implementaria a lógica de filtragem dos FAQs por tag
        });
    });
});