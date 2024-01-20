"use server";
import { prisma } from "@/shared/db/prisma-client";
import { Omit } from "@prisma/client/runtime/library";

export interface Student {
  id: number;
  name: string;
  group_id: number;
}
export type StudentWithoutId = Omit<Student, "id">;
export interface StudentWithGrades {
  grades: {
    id: number;
    grade: string | null;
    date: Date;
  }[];
  id: number;
  name: string;
  group_id: number;
}

export async function getStudentsByGroupDisciplineWithMarks(
  groupId: number,
  disciplineId: number,
  date: Date
): Promise<StudentWithGrades[]> {
  try {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const studentsWithGrades = await prisma.student.findMany({
      where: {
        group_id: groupId,
      },
      include: {
        grades: {
          where: {
            discipline_id: disciplineId,
            date: {
              gte: startOfMonth,
              lte: endOfMonth,
            },
          },
          select: {
            id: true,
            grade: true,
            date: true,
          },
        },
      },
    });

    return studentsWithGrades;
  } finally {
    await prisma.$disconnect();
  }
}

export async function createStudent(student: StudentWithoutId) {
  try {
    await prisma.student.create({
      data: {
        name: student.name,
        group: {
          connect: {
            id: student.group_id,
          },
        },
      },
    });
    return true;
  } catch (error) {
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

export async function removeStudent(studentId: number): Promise<boolean> {
  try {
    await prisma.student.delete({
      where: { id: studentId },
    });
    return true;
  } catch (error) {
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

export async function addOrUpdateGradeToStudent(data: {
  studentId: number;
  disciplineId: number;
  grade: string | null;
  date: Date;
}) {
  try {
    const existingGrade = await prisma.studentGrade.findFirst({
      where: {
        student_id: data.studentId,
        discipline_id: data.disciplineId,
        date: data.date,
      },
    });

    if (existingGrade?.grade != null) {
      await prisma.studentGrade.update({
        where: { id: existingGrade.id },
        data: { grade: data.grade },
      });
    } else {
      await prisma.studentGrade.create({
        data: {
          student: { connect: { id: data.studentId } },
          discipline: { connect: { id: data.disciplineId } },
          grade: data.grade,
          date: data.date,
        },
      });
    }
  } catch (error) {
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
}
