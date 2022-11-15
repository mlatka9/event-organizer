import { Request, Response } from 'express';
import { prisma } from '@event-organizer/prisma-client';

const getAll = async (req: Request, res: Response) => {
  const categories = await prisma.category.findMany();
  res.status(200).json(categories);
};

export default {
  getAll,
};
