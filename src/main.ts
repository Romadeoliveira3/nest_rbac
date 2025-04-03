import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaService } from 'prisma/prisma.service';
import { PermissionsGuard } from './acl/guards/acl.guard';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const reflector = app.get(Reflector);
  const prisma = app.get(PrismaService);
  app.useGlobalGuards(new PermissionsGuard(reflector, prisma));


  const config = new DocumentBuilder()
    .setTitle('Nest RBAC API')
    .setDescription('Documentação da API com controle de acesso')
    .setVersion('1.0')
    .addBearerAuth() 
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  await app.listen(3000);
}
bootstrap();
