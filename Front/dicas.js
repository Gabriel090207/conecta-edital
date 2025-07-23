document.addEventListener('DOMContentLoaded', () => {
    // 1. Lógica para filtros de conteúdo (abas)
    const filterButtons = document.querySelectorAll('.filter-btn');
    const filterContents = document.querySelectorAll('.filter-content');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove a classe 'active' de todos os botões de filtro
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Adiciona a classe 'active' ao botão clicado
            button.classList.add('active');

            const filterType = button.dataset.filter; // Pega o valor do data-filter do botão clicado

            // Esconde todos os blocos de conteúdo e remove a classe 'active-filter-content'
            filterContents.forEach(contentBlock => {
                contentBlock.classList.remove('active-filter-content');
            });

            // Mostra o bloco de conteúdo correspondente ao filtro clicado
            const targetContent = document.querySelector(`.filter-content[data-content="${filterType}"]`);
            if (targetContent) {
                targetContent.classList.add('active-filter-content');
            }
        });
    });

    // Opcional: Lógica para a barra de busca (simulação)
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            // console.log('Buscando por:', searchInput.value);
            // Aqui você implementaria a lógica real de busca e filtragem dos artigos
        });
    }

    // 2. Lógica para links da Navbar (ex: scroll suave ou navegação) - (Mantenha do seu código existente)
    // Se você tiver links na navbar que precisam de JS (como scroll suave para IDs de seção),
    // adicione ou mantenha essa lógica aqui.
    document.querySelectorAll(".navbar-center ul li a").forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            // Apenas para links internos que não são navegação entre páginas HTML
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const navbarHeight = document.querySelector(".navbar").offsetHeight;
                    const offsetTop = targetElement.offsetTop - navbarHeight - 20;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: "smooth"
                    });
                }
            }
        });
    });

    // 3. Lógica para ícone de notificação e menu de usuário (simulação)
    const notificationIcon = document.querySelector('.notification-icon');
    if (notificationIcon) {
        notificationIcon.addEventListener('click', () => {
            alert('Notificações! (Simulação)');
        });
    }

    const userMenu = document.querySelector('.user-menu');
    if (userMenu) {
        userMenu.addEventListener('click', () => {
            alert('Menu do usuário aberto! (Simulação)');
            // Implementar dropdown de usuário real
        });
    }
});