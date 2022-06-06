import { hashSync } from 'bcrypt';

import { faker } from '@faker-js/faker';
import { Priority, Prisma, PrismaClient, Role, Status } from '@prisma/client';
import * as moment from 'moment';

const prisma = new PrismaClient();

const randTypes = () => {
  const randKeyStatus = Math.floor(Math.random() * Object.keys(Status).length);
  const randStatus: Status = Status[Object.keys(Status)[randKeyStatus]];

  const randKeyRole = Math.floor(Math.random() * Object.keys(Role).length);
  const randRole: Role = Role[Object.keys(Role)[randKeyRole]];

  const randKeyPriority = Math.floor(
    Math.random() * Object.keys(Priority).length,
  );
  const randPriority: Priority =
    Priority[Object.keys(Priority)[randKeyPriority]];

  return {
    randStatus,
    randPriority,
    randRole,
  };
};

const pass = Array(8)
  .fill(0)
  .map((element, index) => index + 1)
  .join('');

const salt = Number(process.env.SALT_NUMBER);

const users: Prisma.UserCreateInput[] = [
  {
    password: hashSync(pass, salt),
    username: 'david',
    role: 'MASTER',
  },
];

for (let i = 0; i < 20; i++) {
  users.push({
    password: hashSync(pass, salt),
    role: randTypes().randRole,
    username: faker.internet.userName(),
  });
}

const issues: Prisma.IssueCreateInput[] = [];

for (let i = 0; i < 230; i++) {
  const randomUser = Math.floor(Math.random() * 19 + 1);
  issues.push({
    user: { connect: { id: randomUser } },
    autor: users[randomUser].username,
    description: faker.lorem.sentence(),
    createdAt: moment(faker.date.recent(10)).format('DD/MM/YYYY'),
    issue: faker.lorem.words(3),
    priority: randTypes().randPriority,
    status: randTypes().randStatus,
    version: faker.system.semver(),
  });
}

export async function main() {
  // Prisma create query to seed models in database
  console.log(`Start seeding ...`);

  for (const a of users) {
    const user = await prisma.user.create({
      data: a,
    });
    console.log(`Created user with id: ${user.id}`);
  }

  for (const b of issues) {
    const issue = await prisma.issue.create({
      data: b,
    });
    console.log(`Created issue with id: ${issue.id}`);
  }

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
