import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  
  const permissions = [
    'create_user',
    'delete_user',
    'view_user',
    'create_post',
    'delete_post',
  ];

  const createdPermissions = await Promise.all(
    permissions.map((name) =>
      prisma.permission.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  );

  // 2. Roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: { name: 'admin' },
  });

  const userRole = await prisma.role.upsert({
    where: { name: 'user' },
    update: {},
    create: { name: 'user' },
  });

  // 3. Associar permissões à role "admin" (todos os tipos de permissões)

  await Promise.all(
    createdPermissions.map((permission) =>
      prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: adminRole.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      })
    )
  );

  // 4. Associar permissões à role "user" (apenas permissões de visualização)
  // Exemplo: "user" pode visualizar e atualizar o perfil, mas não criar ou deletar usuários.

  // for (const permission of createdPermissions) {
  //   if (['view_profile', 'update_profile'].includes(permission.name)) {
  //     await prisma.rolePermission.upsert({
  //       where: {
  //         roleId_permissionId: {
  //           roleId: userRole.id,
  //           permissionId: permission.id,
  //         },
  //       },
  //       update: {},
  //       create: {
  //         roleId: userRole.id,
  //         permissionId: permission.id,
  //       },
  //     });
  //   }
  // }

  // 5. Criar um usuário admin com senha "admin123"

  const password = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password,
      roleId: adminRole.id,
    },
  });

  console.log('Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro no seed: ', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
