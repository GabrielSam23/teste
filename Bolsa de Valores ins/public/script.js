const socket = io();
const stockValueElement = document.getElementById('stock-value');
const updateInfoElement = document.getElementById('update-info');
const quantityInput = document.getElementById('quantity');
const totalPriceElement = document.getElementById('total-price');
const buyButton = document.getElementById('buy-button');


// Função para atualizar o valor das ações e mostrar o aviso
function updateStockValue(newValue) {
    stockValueElement.textContent = `Valor das Ações: $${newValue}`;
    updateInfoElement.textContent = 'Valor atualizado!';
    setTimeout(() => {
        updateInfoElement.textContent = ''; // Limpa o aviso após 3 segundos
    }, 3000);
}

// Recebe atualizações do valor das ações do servidor e atualiza na página
socket.on('stock-update', (newValue) => {
    updateStockValue(newValue);
});

// Atualiza o preço total das ações com base na quantidade selecionada
// Atualiza o preço total das ações com base na quantidade selecionada
const updateTotalPrice = () => {
    const quantity = parseInt(quantityInput.value);
    const stockValue = parseFloat(stockValueElement.textContent.replace('Valor das Ações: $', ''));
    
    if (isNaN(quantity) || isNaN(stockValue)) {
        totalPriceElement.textContent = '';
    } else {
        const totalPrice = quantity * stockValue;
        totalPriceElement.textContent = `Preço Total: $${totalPrice}`;
    }
};

// Atualiza o preço total ao alterar a quantidade de ações
quantityInput.addEventListener('input', updateTotalPrice);

// Realiza a compra das ações ao clicar no botão "Comprar Ações"
buyButton.addEventListener('click', () => {
    const quantity = parseInt(quantityInput.value);
    const stockValue = parseFloat(stockValueElement.textContent.replace('Valor das Ações: $', ''));
    const totalPrice = quantity * stockValue;
    alert(`Você comprou ${quantity} ações por um total de $${totalPrice}.`);
});

