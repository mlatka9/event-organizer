import { prisma } from './prisma-client';

const clearDB = async () => {
  console.log('clear db start');
  const tablenames = await prisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

  const tables = tablenames
    .map(({ tablename }) => tablename)
    .filter((name) => name !== '_prisma_migrations')
    .map((name) => `"public"."${name}"`)
    .join(', ');

  await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);

  const categoriesNames = [
    { id: '1', name: 'sport' },
    { id: '2', name: 'popkultura' },
    { id: '3', name: 'books' },
  ];

  try {
    await prisma.category.createMany({
      data: categoriesNames,
    });
  } catch (err) {
    console.log(err);
  }

  console.log('clear db end');
};

export { clearDB };
