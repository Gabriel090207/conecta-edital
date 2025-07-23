document.addEventListener('DOMContentLoaded', () => {
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

    dropdownToggles.forEach(toggle => {
        const dropdownMenu = toggle.nextElementSibling; // O menu associado a este toggle
        const checkboxes = dropdownMenu.querySelectorAll('input[type="checkbox"]');
        const selectAllOption = dropdownMenu.querySelector('.select-all-option'); // A opção "Todos/Todas"
        
        // Listener para o botão toggle (abrir/fechar menu)
        toggle.addEventListener('click', (event) => {
            event.stopPropagation(); // Impede que o clique se propague para o document

            // Fecha outros dropdowns abertos (se houver)
            document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                if (menu !== dropdownMenu) { // Não fechar o próprio menu se já estiver aberto
                    menu.classList.remove('show');
                    menu.previousElementSibling.classList.remove('active'); // O toggle anterior
                }
            });

            // Alterna a visibilidade do dropdown clicado
            dropdownMenu.classList.toggle('show');
            toggle.classList.toggle('active');
        });

        // Listener para o clique na opção "Todos/Todas" (agora um label sem checkbox)
        if (selectAllOption) {
            selectAllOption.addEventListener('click', () => {
                checkboxes.forEach(cb => cb.checked = false); // Desmarca todos os checkboxes
                selectAllOption.classList.add('active-option'); // Ativa a opção "Todos" visualmente
                
                // Atualiza o texto do botão toggle para "Todos Status/Categorias/Recentes"
                toggle.textContent = selectAllOption.textContent.trim(); 
                // Adiciona a seta de volta ao botão toggle
                const arrowIcon = document.createElement('i');
                arrowIcon.classList.add('fas', 'fa-chevron-down');
                toggle.appendChild(arrowIcon);
                
                // Opcional: Fechar o dropdown após a seleção
                dropdownMenu.classList.remove('show');
                toggle.classList.remove('active');
            });
        }

        // Listener para checkboxes individuais
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                if (checkbox.checked) {
                    // Se um checkbox for marcado, desativa a opção "Todos/Todas"
                    if (selectAllOption) {
                        selectAllOption.classList.remove('active-option');
                    }
                } else {
                    // Se um checkbox for desmarcado, verifica se nenhum outro está marcado
                    const anyChecked = Array.from(checkboxes).some(cb => cb.checked);
                    if (!anyChecked) {
                        // Se nenhum checkbox está marcado, ativa a opção "Todos/Todas"
                        if (selectAllOption) {
                            selectAllOption.classList.add('active-option');
                        }
                    }
                }
                
                // Atualiza o texto do botão toggle com base nas seleções
                updateToggleButtonText(toggle, dropdownMenu, selectAllOption);
                // Opcional: Fechar o dropdown após seleção única (se for multi-select, não fechar)
                // dropdownMenu.classList.remove('show');
                // toggle.classList.remove('active');
            });
        });

        // Função para atualizar o texto do botão toggle
        function updateToggleButtonText(toggleButton, menu, allOption) {
            const checkedCheckboxes = menu.querySelectorAll('input[type="checkbox"]:checked');
            const arrowIcon = toggleButton.querySelector('i.fa-chevron-down'); // Pega a seta existente

            if (allOption && allOption.classList.contains('active-option')) {
                toggleButton.textContent = allOption.textContent.trim();
            } else if (checkedCheckboxes.length === 0) {
                // Se nada está marcado e não há 'Todos' ativo, usa o 'Todos' como padrão
                if (allOption) {
                    allOption.classList.add('active-option'); // Ativa o 'Todos'
                    toggleButton.textContent = allOption.textContent.trim();
                } else {
                    toggleButton.textContent = "Nenhum selecionado"; // Fallback
                }
            } else if (checkedCheckboxes.length === 1) {
                toggleButton.textContent = checkedCheckboxes[0].parentElement.textContent.trim();
            } else {
                toggleButton.textContent = `${checkedCheckboxes.length} selecionados`;
            }
            
            // Re-adiciona a seta (garante que ela esteja sempre lá e não se duplique)
            if (arrowIcon) {
                toggleButton.appendChild(arrowIcon); // Move a seta para o final do texto
            } else {
                const newArrowIcon = document.createElement('i');
                newArrowIcon.classList.add('fas', 'fa-chevron-down');
                toggleButton.appendChild(newArrowIcon);
            }
        }


        // Inicializa o estado do botão toggle ao carregar a página
        updateToggleButtonText(toggle, dropdownMenu, selectAllOption);
    });

    // Fecha os dropdowns se clicar fora deles
    document.addEventListener('click', (event) => {
        document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
            menu.classList.remove('show');
            menu.previousElementSibling.classList.remove('active');
        });
    });

    // Impede que o clique dentro do menu dropdown o feche (apenas para checkboxes e labels)
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.addEventListener('click', (event) => {
            // Se o clique for em um checkbox ou label, não fecha o menu
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'LABEL') {
                event.stopPropagation();
            }
        });
    });

    // Funcionalidade do botão "Abrir Novo Chamado"
    const newChamadoBtn = document.querySelector('.btn-new-chamado');
    if (newChamadoBtn) {
        newChamadoBtn.addEventListener('click', () => {
            alert('Funcionalidade "Abrir Novo Chamado" em desenvolvimento!');
            // Implementar lógica para abrir modal ou formulário
        });
    }

    // Funcionalidade do botão "Abrir Meu Primeiro Chamado"
    const createFirstTicketBtn = document.querySelector('.btn-create-first-ticket');
    if (createFirstTicketBtn) {
        createFirstTicketBtn.addEventListener('click', () => {
            alert('Você clicou para abrir seu primeiro chamado!');
            // Redirecionar para o formulário de novo chamado ou abrir um modal
        });
    }
});