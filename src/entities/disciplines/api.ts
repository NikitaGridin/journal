"use server";
import { prisma } from "@/shared/db/prisma-client";

export interface Discipline {
  id: number;
  name: string;
}

export type DisciplineWithoutId = Omit<Discipline, "id">;

export async function getDisciplines(): Promise<Discipline[]> {
  try {
    const disciplines = await prisma.discipline.findMany();
    return disciplines;
  } finally {
    await prisma.$disconnect();
  }
}

export async function createDiscipline(
  data: DisciplineWithoutId
): Promise<boolean> {
  try {
    await prisma.discipline.create({
      data,
    });
    return true;
  } catch (error) {
    return false;
  } finally {
    await prisma.$disconnect();
  }
}
export async function removeDiscipline(disciplineId: number): Promise<boolean> {
  try {
    await prisma.discipline.delete({
      where: { id: disciplineId },
    });
    return true;
  } catch (error) {
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

export async function getDisciplinesForGroup(
  groupId: number
): Promise<Discipline[]> {
  try {
    const groupDisciplines = await prisma.groupDiscipline.findMany({
      where: { group_id: groupId },
      include: {
        discipline: true,
      },
    });

    const disciplines = groupDisciplines.map(
      (groupDiscipline) => groupDiscipline.discipline
    );

    return disciplines;
  } finally {
    await prisma.$disconnect();
  }
}
export async function addDisciplineToGroup(data: {
  groupId: number;
  disciplineId: number;
}): Promise<void> {
  await prisma.groupDiscipline.create({
    data: {
      group: {
        connect: {
          id: data.groupId,
        },
      },
      discipline: {
        connect: {
          id: data.disciplineId,
        },
      },
    },
  });
}
