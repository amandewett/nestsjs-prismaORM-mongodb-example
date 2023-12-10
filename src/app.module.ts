import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static/dist/serve-static.module';
import { join } from "path";
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './modules/user/user.module';
import { PrismaService } from './modules/prisma/prisma.service';

@Module({
  //import modules here
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    ServeStaticModule.forRoot(
      {
        rootPath: join(__dirname, '..', "public")
      }
    ),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRE_DURATION
      }
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
