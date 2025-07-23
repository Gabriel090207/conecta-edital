document.addEventListener('DOMContentLoaded', () => {
    const backToTopButton = document.querySelector('.back-to-top-button');

    // Mostra ou esconde o botão ao rolar a página
    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) { // Mostra o botão após rolar 200px
            backToTopButton.style.display = 'flex';
        } else {
            backToTopButton.style.display = 'none';
        }
    });

    // Rola para o topo quando o botão é clicado
    backToTopButton.addEventListener('click', (e) => {
        e.preventDefault(); // Previne o comportamento padrão do link
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Rola suavemente
        });
    });

    // Inicialmente esconde o botão se a página já estiver no topo
    if (window.scrollY === 0) {
        backToTopButton.style.display = 'none';
    }
});