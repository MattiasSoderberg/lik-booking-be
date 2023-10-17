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

const assets = [
  {
    name: 'häst1',
  },
  {
    name: 'häst2',
  },
];

const clients = [
  {
    firstName: 'Client',
    lastName: 'Elev',
    bornAt: '2013-03-12T00:00:00Z',
  },
];

enum SemesterPeriods {
  SPRING = 'SPRING',
  FALL = 'FALL',
}

const semesters = [
  {
    startAt: '2023-01-09T00:00:00Z',
    endAt: '2023-06-15T00:00:00Z',
    period: SemesterPeriods['SPRING'],
  },
  {
    startAt: '2023-08-16T00:00:00Z',
    endAt: '2023-12-21T00:00:00Z',
    period: SemesterPeriods['FALL'],
  },
];

const prisma = new PrismaClient();
const logger = new Logger('SEED ROLES AND PERMISSIONS');

async function main() {
  let roleCount = 0;
  let permissionCount = 0;
  let userCount = 0;
  let semestersCount = 0;
  let assetsCount = 0;
  let clientRelative = null;
  let clientAsset = null;

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
      if (result.roleId === 3) {
        clientRelative = result;
      }
    }
  }

  const existingAssets = await prisma.asset.findFirst({});
  if (!existingAssets) {
    for await (const asset of assets) {
      const result = await prisma.asset.create({ data: asset });
      if (result) {
        assetsCount++;
        if (!clientAsset) {
          clientAsset = result;
        }
      }
    }
  }

  for await (const semester of semesters) {
    const existingSemesters = await prisma.semester.findFirst({});

    if (existingSemesters) {
      break;
    }

    const year = new Date(semester.startAt).getFullYear();
    const result = await prisma.semester.create({
      data: { ...semester, year },
    });

    if (result) {
      semestersCount++;
    }
  }

  return {
    roleCount,
    permissionCount,
    userCount,
    semestersCount,
    assetsCount,
    clientRelative,
    clientAsset,
  };
}

async function createClient(relativeId: string, assetId: string) {
  const result = await prisma.client.create({
    data: {
      ...clients[0],
      relatives: { createMany: { data: [{ userId: relativeId }] } },
      assets: { createMany: { data: [{ assetId }] } },
    },
  });

  return result && 1;
}

main()
  .then(async (res) => {
    if (res?.clientRelative && res?.clientAsset) {
      const client = await createClient(
        res.clientRelative.uuid,
        res.clientAsset.uuid,
      );

      if (client) {
        logger.log(`Clients created: ${client}`);
      }
    }

    logger.log(`Roles created: ${res.roleCount}`);
    logger.log(`Permissions created: ${res.permissionCount}`);
    logger.log(`Users created: ${res.userCount}`);

    if (res.assetsCount > 0) {
      logger.log(`Assets created: ${res.assetsCount}`);
    }

    await prisma.$disconnect();
  })
  .catch(async (error) => {
    logger.error('ERROR SEEDING: ', error);
    await prisma.$disconnect();
    process.exit(1);
  });
