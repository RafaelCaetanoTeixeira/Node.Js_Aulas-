// Importa os módulos necessários
const express = require('express');
const dns = require('dns');
const app = express();
const fs = require('fs');
const path = require('path');
const https = require('https'); // or 'http' for non-secure sites
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Rota principal que explica como usar
app.get('/', (req, res) => {
  res.send(`
    <h1>Consulta DNS Simples</h1>
    <p>Para consultar um site, adicione o nome na URL assim:</p>
    <p>http://localhost:3000/site/google.com</p>
  `);
});

// Rota que faz a consulta DNS
app.get('/site/:nomeSite', (req, res) => {
  const nomeSite = req.params.nomeSite;
  
  // Verifica se foi fornecido um nome de site
  if (!nomeSite) {
    return res.send('Por favor, digite um nome de site (ex: google.com)');
  }

  // Faz a consulta DNS
  dns.lookup(nomeSite, (err, enderecoIP) => {
    if (err) {
      return res.send(`Erro ao consultar ${nomeSite}: ${err.message}`);
    }
    
    res.send(`O site ${nomeSite} tem o IP: ${enderecoIP}`);
  });
});

//Rota que baixa o arquivo
app.post('/criaArquivo', (req, res)=> {
  const data = JSON.stringify(req.body);
  console.log(req.body);

  //Cria arquivo
  if(!data){
    res.send('Erro: body vazio');
    return;
  }
  // antes de gravar aqui tinha q ter a leitura do ultimo considerando data e hora, pega o nome e adiciona mais um nele
  let arquivoGravado = true;

       fs.writeFile(`Arquivos/arquivo${Date.now()}.txt`,data , (err) => {
          if (err) {
            arquivoGravado = false;
          } else {
            arquivoGravado = true;
          }
        });

  if(arquivoGravado){
    res.send('Arquivo gravado com sucesso!');

  }else{
    res.send('Erro: Arquivo não gravado');
  }
})

//Le arquivo gravado
app.get('/leArquivo/:nomeArquivo', (req, res) => {
 console.log(req.params.nomeArquivo);

  fs.readFile(`Arquivos/${req.params.nomeArquivo}.txt`, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    res.send('Error reading file:'+ err);
    return;
  }
  res.send('File content:' + data);
})
});

//Exibe arquivos gravados
const PASTA_ARQUIVOS = path.join(__dirname, 'Arquivos');

// Rota para listar arquivos
app.get('/listaArquivos', (req, res) => {
    // Verifica se a pasta existe
    if (!fs.existsSync(PASTA_ARQUIVOS)) {
        return res.send('A pasta de arquivos ainda não existe.');
    }

    // Lê os arquivos da pasta
    fs.readdir(PASTA_ARQUIVOS, (err, arquivos) => {
        if (err) {
            return res.send('Erro ao ler a pasta: ' + err.message);
        }

        // Filtra apenas arquivos .txt
        const arquivosTxt = arquivos.filter(arq => arq.endsWith('.txt'));

        if (arquivosTxt.length === 0) {
            return res.send('Nenhum arquivo .txt encontrado.');
        }

        // Cria uma lista simples em HTML
        let listaHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Arquivos Disponíveis</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    ul { list-style-type: none; padding: 0; }
                    li { margin: 10px 0; padding: 10px; background-color: #f5f5f5; border-radius: 5px; }
                    a { text-decoration: none; color: #1a73e8; }
                    a:hover { text-decoration: underline; }
                </style>
            </head>
            <body>
                <h1>Arquivos Disponíveis</h1>
                <ul>
        `;
        
        arquivosTxt.forEach(arquivo => {
           
            listaHTML += `<li>${arquivo} - <a href="/leArquivo/${arquivo.replace('.txt', '')}">Ler</a></li>`;
        });

        listaHTML += `
                </ul>
            </body>
            </html>
        `;
        
        res.send(listaHTML);
    });
});

// Rota principal que explica como usar
app.get('/retornaHTML', (req, res) => {
  res.send(`
    <h1>Consulta ao HTML Simples</h1>
    <p>Para consultar o HTML do site, adicione o nome na URL assim:</p>
    <p>http://localhost:3000/retornaHTML/google.com</p>
  `);
});

// Retorna html
app.get('/retornaHTML/:nomeSite', (req, res) => {
  const nomeSite = req.params.nomeSite;

  if (!nomeSite) {
    return res.send('Por favor, digite um nome de site (ex: google.com)');
  }

  let url = nomeSite;
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
 
  https.get(url, (httpsRes) => {
    let data = '';

    httpsRes.on('data', (chunk) => {
      data += chunk;
    });

    httpsRes.on('end', () => {
      // Enviar o HTML como resposta
      res.type('html').send(data);
    });
  }).on('error', (err) => {
    console.error('Error fetching HTML:', err.message);
    res.status(500).send('Erro ao buscar o HTML do site');
  });
});








// Inicia o servidor
app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});