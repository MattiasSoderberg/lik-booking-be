import { Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

export const roles = [
  {
    id: 1,
    name: 'admin',
  },
  {
    id: 2,
    name: 'staff',
  },
  {
    id: 3,
    name: 'relative',
  },
  {
    id: 4,
    name: 'client',
  },
];

export const permissions = [
  {
    id: 1,
    roleId: 1,
    action: 'manage',
    subject: 'all',
  },
  {
    id: 2,
    roleId: 2,
    action: 'manage',
    subject: 'Event',
  },
  {
    id: 3,
    roleId: 2,
    action: 'read',
    subject: 'User',
    conditions: { uuid: '${uuid}' },
  },
  {
    id: 4,
    roleId: 2,
    action: 'update',
    subject: 'User',
    conditions: { uuid: '${uuid}' },
  },
  {
    id: 5,
    roleId: 2,
    action: 'read',
    subject: 'Client',
  },
  {
    id: 6,
    roleId: 3,
    action: 'read',
    subject: 'Client',
    conditions: { relatives: { some: '${uuid}' } },
  },
  {
    id: 7,
    roleId: 3,
    action: 'create',
    subject: 'Event',
    conditions: { clientId: '${uuid}' },
  },
  {
    id: 8,
    roleId: 3,
    action: 'read',
    subject: 'Event',
    conditions: { clientId: '${uuid}' },
  },
  {
    id: 9,
    roleId: 3,
    action: 'update',
    subject: 'Event',
    conditions: { clientId: '${uuid}' },
  },
  {
    id: 10,
    roleId: 4,
    action: 'read',
    subject: 'Client',
    conditions: { uuid: '${uuid}' },
  },
];

const prisma = new PrismaClient();
const logger = new Logger('SEED ROLES AND PERMISSIONS');

async function main() {
  let roleCount = 0;
  let permissionCount = 0;
  for await (const role of roles) {
    const result = await prisma.role.upsert({
      where: { id: role.id },
      create: role,
      update: role,
    });
    if (result) {
      roleCount++;
    }
  }

  for await (const permission of permissions) {
    const result = await prisma.permission.upsert({
      where: { id: permission.id },
      create: permission,
      update: permission,
    });
    if (result) {
      permissionCount++;
    }
  }
  return { roleCount, permissionCount };
}

main()
  .then(async (res) => {
    logger.log(`Roles created: ${res.roleCount}`);
    logger.log(`Permissions created: ${res.permissionCount}`);
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    logger.error('ERROR SEEDING: ', error);
    await prisma.$disconnect();
    process.exit(1);
  });
