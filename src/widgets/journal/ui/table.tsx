import { useJournalStore } from "@/entities/journal";
import {
  addOrUpdateGradeToStudent,
  getStudentsByGroupDisciplineWithMarks,
} from "@/entities/students";
import { StudentWithGrades } from "@/entities/students/api";
import { RemoveStudent } from "@/features/remove-student";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function getDaysInMonth(year: number, month: number): Date[] {
  const daysInMonth = new Date(year, month, 0).getDate();
  const days = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    days.push(date);
  }

  return days;
}
function getGradeForDay(student: StudentWithGrades, day: Date) {
  const gradesForDay = student.grades.filter(
    (grade) =>
      new Date(grade.date).getFullYear() === day.getFullYear() &&
      new Date(grade.date).getMonth() === day.getMonth() &&
      new Date(grade.date).getDate() === day.getDate()
  );

  return gradesForDay.length > 0 ? gradesForDay[0].grade : "";
}

const getColorForGrade = (grade: string | null) => {
  if (grade === "+") {
    return "bg-green-400";
  } else if (grade === "-") {
    return "bg-red-400";
  } else {
    switch (grade) {
      case "2":
        return "bg-red-400";
      case "3":
        return "bg-orange-400";
      case "4":
        return "bg-yellow-400";
      case "5":
        return "bg-green-400";
      default:
        return "white";
    }
  }
};

// ______________________________________________________________________ //

export const Table = () => {
  const { current_date, current_discipline, currentGroup } = useJournalStore();

  const currentDate = new Date(current_date);

  const students = useQuery({
    queryKey: ["students", currentGroup, current_discipline, current_date],
    queryFn: () =>
      getStudentsByGroupDisciplineWithMarks(
        currentGroup,
        current_discipline,
        currentDate
      ),
    refetchOnWindowFocus: false,
  });

  const daysInMonth = getDaysInMonth(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1
  );
  const handleGradeChange = async (
    studentId: number,
    dayIndex: number,
    value: string
  ) => {
    const gradeDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      dayIndex
    );
    mutate({
      studentId: studentId,
      disciplineId: current_discipline,
      grade: value.trim(),
      date: gradeDate,
    });
  };
  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationFn: addOrUpdateGradeToStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["students"],
      });
      toast.success("Оценка успешно поставлена");
    },
    onError: (error: any) => {
      toast.error(`Ошибка при постановке оценки: ${error.message}`);
    },
  });

  if (students.isLoading) return <Loader className="animate-spin" />;
  if (students.isFetching) return <Loader className="animate-spin" />;
  if (students.isError) return <div>Ошибка</div>;
  if (!students.data) return <div>Нет данных</div>;

  return (
    <div>
      {isPending && (
        <div className="fixed w-full h-screen flex justify-center items-center top-0 left-0 bg-black/40 backdrop-blur-sm text-white">
          <Loader className="animate-spin w-96" size={80} />
        </div>
      )}
      <div>Студентов: {students.data?.length}</div>
      <table className="table-auto border w-full">
        <thead>
          <tr className="border bg-gray-100">
            <th className="border-r text-left w-64">ФИО</th>
            {daysInMonth.map((day, index) => (
              <th
                key={index}
                className={`border-r w-6 text-center ${
                  day.getDate() === new Date().getDate() &&
                  day.getMonth() === new Date().getMonth() &&
                  day.getFullYear() === new Date().getFullYear()
                    ? "bg-green-400"
                    : ""
                }`}
              >
                {day.getDate()}
              </th>
            ))}
            <th className="border-r text-left w-10 text-center">Действие</th>
          </tr>
        </thead>
        <tbody>
          {students.data?.map((student) => (
            <tr key={student.id} className="border">
              <td className="border-r flex justify-between items-center pl-2">
                <div>{student.name}</div>
              </td>
              {daysInMonth.map((day, index) => (
                <td key={index}>
                  <input
                    maxLength={1}
                    type="text"
                    className={`w-full border text-center ${getColorForGrade(
                      getGradeForDay(student, day)
                    )}`}
                    value={getGradeForDay(student, day) || ""}
                    onChange={(e) =>
                      handleGradeChange(student.id, index + 1, e.target.value)
                    }
                  />
                </td>
              ))}
              <td className="text-center">
                <RemoveStudent studentId={student.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
