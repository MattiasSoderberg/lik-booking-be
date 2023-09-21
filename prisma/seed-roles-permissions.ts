import { Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

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
    conditions: { relatives: { some: { userId: '${uuid}' } } },
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

const users = [
  {
    email: 'admin@lik.com',
    firstName: 'Matte',
    lastName: 'admin',
    password: 'password',
    role: 1,
    phoneNumber: '070-1234567',
    address: {
      street: 'street',
      zipCode: '12345',
      area: 'stockholm',
    },
  },
  {
    email: 'staff@lik.com',
    firstName: 'Matte',
    lastName: 'staff',
    password: 'password',
    role: 2,
    phoneNumber: '070-1234567',
    address: {
      street: 'street',
      zipCode: '12345',
      area: 'stockholm',
    },
  },
  {
    email: 'relative@lik.com',
    firstName: 'Matte',
    lastName: 'relative',
    password: 'password',
    role: 3,
    phoneNumber: '070-1234567',
    address: {
      street: 'street',
      zipCode: '12345',
      area: 'stockholm',
    },
  },
];

const prisma = new PrismaClient();
const logger = new Logger('SEED ROLES AND PERMISSIONS');

async function main() {
  let roleCount = 0;
  let permissionCount = 0;
  let userCount = 0;

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

  for await (const user of users) {
    const { address, role, ...userData } = user;
    const hashedPassword = await hash(userData.password, 10);
    userData['password'] = hashedPassword;
    const dataToCreate = {
      ...userData,
      role: { connect: { id: role } },
    };
    if (address) {
      const { street, zipCode, area } = address;
      dataToCreate['address'] = {
        connectOrCreate: {
          where: { address_identifier: { street, zipCode, area } },
          create: address,
        },
      };
    }
    const result = await prisma.user.upsert({
      where: { email: dataToCreate.email },
      create: dataToCreate,
      update: dataToCreate,
    });
    if (result) {
      userCount++;
    }
  }
  return { roleCount, permissionCount, userCount };
}

main()
  .then(async (res) => {
    logger.log(`Roles created: ${res.roleCount}`);
    logger.log(`Permissions created: ${res.permissionCount}`);
    logger.log(`Users created: ${res.userCount}`);
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    logger.error('ERROR SEEDING: ', error);
    await prisma.$disconnect();
    process.exit(1);
  });
