"use server";
import { prisma } from "@/shared/db/prisma-client";

export interface Group {
  id: number;
  specialty: string;
  course: number;
  letter: string;
}

export type GroupWithoutId = Omit<Group, "id">;

export async function getGroups(): Promise<Group[]> {
  const groups = await prisma.group.findMany();
  await prisma.$disconnect();
  return groups;
}

export async function createGroup(data: GroupWithoutId) {
  await prisma.group.create({
    data: {
      specialty: data.specialty,
      course: +data.course,
      letter: data.letter,
    },
  });
  await prisma.$disconnect();
}
export async function removeGroup(groupId: number) {
  await prisma.group.delete({
    where: { id: groupId },
  });
  await prisma.$disconnect();
}
