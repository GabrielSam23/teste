const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const fs = require('fs');

// Caminho para o arquivo de dados
const dataPath = path.join(__dirname, 'data.json');

// Lê o valor inicial das ações do arquivo, ou define um valor padrão se o arquivo não existir
let stockValue;
try {
    stockValue = JSON.parse(fs.readFileSync(dataPath)).stockValue;
} catch (error) {
    console.log('Erro ao ler o arquivo de dados:', error);
    stockValue = 100; // Valor padrão caso o arquivo não exista ou ocorra algum erro na leitura
}

// Atualiza o valor das ações aleatoriamente a cada 5 segundos
setInterval(() => {
    const randomChange = Math.floor(Math.random() * 11) - 5; // Alteração aleatória entre -5 e +5
    stockValue += randomChange;
    console.log(`O valor da bolsa atualizou para: ${stockValue}`);

    // Salva o novo valor das ações no arquivo
    fs.writeFileSync(dataPath, JSON.stringify({ stockValue }));

    io.emit('stock-update', stockValue);
}, 20000);

// Define a pasta 'public' como o diretório de arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Define a rota para a raiz do site
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

http.listen(3000, () => {
    console.log('Servidor está rodando na porta 3000');
});

// Configura o Socket.io para transmitir atualizações do valor das ações para o front-end
io.on('connection', (socket) => {
    console.log('Um usuário conectado');

    // Envia imediatamente o valor atual das ações ao estabelecer conexão com o cliente
    socket.emit('stock-update', stockValue);

    // Trata o evento de solicitação de atualização do valor das ações
    socket.on('refresh-stock', () => {
        // Envia imediatamente o valor atualizado das ações
        io.emit('stock-update', stockValue);
    });
});
