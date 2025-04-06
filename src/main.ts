import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaService } from 'prisma/prisma.service';
import { RolesGuard } from './acl/guards/roles.guard';
import { AppModule } from './app.module';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthMiddleware } from './auth/jwt-auth.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const jwtService = app.get(JwtService);
  app.use(new JwtAuthMiddleware(jwtService).use);

  const reflector = app.get(Reflector);
  const prisma = app.get(PrismaService);
  app.useGlobalGuards(new RolesGuard(reflector, prisma));

  const config = new DocumentBuilder()
    .setTitle('Nest RBAC API')
    .setDescription('Documentação da API com controle de acesso')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
  console.log('Swagger docs available at http://localhost:3000/docs');
}

bootstrap();
