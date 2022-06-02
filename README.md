## Description

Issue Tracking System backend feito com NestJs

## Installation

```bash
$ npm install

#ou

$ yarn
```

## Running the app

```bash
# copiar o .env.example para um arquivo .env e colocar os dados necessários
$ cp .env.example .env

#Inicializar os containers do docker em segundo plano
$ docker-compose up -d --remove-orphans --build

#Rodar as migrations no banco de dados
$ yarn migrate:dev
ou
$ npm run migrate:dev

#Iniciar o projeto
$ yarn start:dev
ou
$ npm run start:dev
```

## Stay in touch

- Author - [David França](https://githut.com/david-franca)

## License

[MIT licensed](LICENSE).
