import "reflect-metadata";
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { NextFunction, Request, Response } from "express";
import * as logger from "morgan";
import * as fs from "fs";
import * as geoip from "geoip-lite";
import { INestApplication } from '@nestjs/common';

async function bootstrap() {
  const app: INestApplication<any> = await NestFactory.create(AppModule, { cors: true });

  //swagger config
  const swaggerConfig = new DocumentBuilder()
    .setTitle(process.env.APP_NAME)
    .setContact(
      "Aman Dewett",
      process.env.BACKEND_HOST,
      "amandewett@gmail.com",
    )
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  app.use((req: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', "*");
    res.header("Access-Control-Allow-Headers", "*");
    req.headers["x-forward-for"];
    const remoteAddress = req.headers['x-forwarded-for'];
    const url = `${req.baseUrl}${req.url}`;
    if (remoteAddress) {
      //get location using GEOIP package
      if (!Array.isArray(remoteAddress)) {
        const geoLocation = geoip.lookup(remoteAddress);
        console.log(`remote request address: ${req.headers['x-forwarded-for']} @${humanReadableDate()}`);
        if (geoLocation) {
          console.log(JSON.stringify(geoLocation));
          storeRemoteRequestAddresses(`${remoteAddress} => ${url} @${humanReadableDate()}\n${JSON.stringify(geoLocation)}\n`);
        }
        else {
          storeRemoteRequestAddresses(`${remoteAddress} => ${url} @${humanReadableDate()}`);
        }
      }
    }
    next();
  });
  app.use(logger("dev"));
  app.setGlobalPrefix("/api", {
    exclude: [''],
  });
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDocument);

  app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
    console.log(err.message, err);
  });

  await app.listen(process.env.PORT, function () {
    console.log(`${process.env.APP_NAME} server started with ${process.env.ENV} environment at ${process.env.PORT} port`);
  });
}

function storeRemoteRequestAddresses(ipAddress: any) {
  const filePath = `.requestRemoteAddress.log`;
  if (fs.existsSync(filePath)) {
    fs.appendFileSync(filePath, `\n${ipAddress}`);
  }
  else {
    fs.writeFileSync(filePath, ipAddress);
  }
}

function humanReadableDate() {
  const currentDateTime = new Date(Date.now());
  const day = currentDateTime.getDate();
  const month = currentDateTime.getMonth() + 1;
  const year = currentDateTime.getFullYear();

  const hour = currentDateTime.getHours();
  const minute = currentDateTime.getMinutes();
  const second = currentDateTime.getSeconds();
  return `${day}/${month}/${year} - ${hour}:${minute}:${second}`;
}

bootstrap();
