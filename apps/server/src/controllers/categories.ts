import { Request, Response } from 'express';
import { prisma } from '@event-organizer/prisma-client';

const create = async (req: Request, res: Response) => {
  const categoriesNames = req.body as string[];
  await prisma.category.deleteMany();
  await prisma.category.createMany({
    data: categoriesNames.map((name) => ({ name })),
  });

  const categories = await prisma.category.findMany({});
  res.status(200).json(categories);
};

const getAll = async (req: Request, res: Response) => {
  const categories = await prisma.category.findMany();
  res.status(200).json(categories);
};

export default {
  getAll,
  create,
};
