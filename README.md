# NestJS with PrismaORM server with Typescript and MongoDB example

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

<p align="center"> A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

### Requirements
- It requires NODE v16 or above to run in your machine.
- Please add .env file with variables available in .env.sample file at root of the project.
- Install NestJS module globally using:
```sh
npm i -g @nestjs/cli typeorm
```

## Setup
- Init NestJS project using below command
```sh
nest new project-name
```
- Choose between NPM or YARN
- Configure tsconfig.json according to your needs or take example from this project.
- Install Prisma as DEV dependency
```sh
npm i -D prisma
```
- Init Prisma in project using below command:
```sh
npx prisma init
```


## Installation
Install the dependencies and devDependencies and start the server.
```sh
npm i
```
## Run in development mode
```sh
npm run start:dev
```

## Directly run in typescript language (This will not emit your app to javascript in dist folder)
```sh
npm start
```

## Generate files
Generate module
```sh
nest g mo module-name
```

Generate controller
```sh
nest g co controller-name
```

Generate service
```sh
nest g s service-name
```