// app.js - Meu primeiro programa Node.js

// 1. Importar o módulo HTTP (já vem com o Node.js)
const http = require('http');

// 2. Criar o servidor
const server = http.createServer((req, res) => {
  // Configurar o cabeçalho da resposta
  res.writeHead(200, {'Content-Type': 'text/plain'});
  
  // Enviar a resposta
  res.end('Ola Mundo! Meu primeiro programa em Node\n');
});

// 3. Definir a porta e iniciar o servidor
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}/`);
});