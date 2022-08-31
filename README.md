# nfeBackup

Programa para backup de nfe

## Índice
- [Iniciando](#iniciando)
  - [Pré-rquisito](#pré-rquisito)
  - [Variáveis de ambiente](#variáveis-de-ambiente)
  - [Executando](#executando)
  - [Testando](#testando)
  

## Iniciando

Segue as instruções de utilização do programa.  

[Voltar ao Índice](#nfeBackup)

### Pré-rquisito
Ter os programas abaixo já instalados e rodando:

1. Ter o **NodeJs** versão **14.15.4** ou superior.

[Voltar ao Índice](#nfeBackup)

### Variáveis de ambiente
**EXTREMAMENTE IMPORTANTE**

Para que funcione em modo de desenvolvimento devé-se crie um arquivo **.env** na raiz da aplicação com algumas variáveis configuradas.

Veja o conteúdo do arquivo [.env.example](https://github.com/jairmaiag/nfebackup/blob/master/.env.example) que contem as variáveis utilizadas no sistema.

[Voltar ao Índice](#nfeBackup)
### Executando

Após baixar os fontes acesse a pasta da aplicação e execute o comando:

`npm install`

Utilize o **npm** para executar o mesmo com um dos comandos abaixo:

1. npm start
2. npm run dev

[Voltar ao Índice](#nfeBackup)
### Testando 
Uma vez que o projeto já tenha sido baixado e as dependências instaladas, é possívle fazer um teste.  
Crie um aquivo com o nome de `teste.js` e dentro destes coloque os seguinte código:  
`const dotenv = require("dotenv");   
dotenv.config();   
const service = require("./src/app/services/main");   
service();`   
No console do terminal digite `node teste.js`, o mesmo será executado e os emils baixados.  

[Voltar ao Índice](#nfeBackup)