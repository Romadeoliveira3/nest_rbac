import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AclModule } from './acl/acl.module';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule,UserModule, AuthModule, AclModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
