"use client";
import { getDisciplines } from "@/entities/disciplines";
import { RemoveDiscipline } from "@/features/remove-discipline";
import { CreateDisciplineForm } from "@/features/create-discipline";
import { Loader } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export function ListDisciplinesWidget() {
  const disciplines = useQuery({
    queryKey: ["disciplines"],
    queryFn: () => getDisciplines(),
    refetchOnWindowFocus: false,
  });

  if (disciplines.isLoading)
    return (
      <div className="gap-2 flex items-center justify-center border p-4 shadow-md rounded-lg space-y-2 max-h-96 overflow-auto min-h-48">
        <Loader className="animate-spin" />
      </div>
    );
  if (disciplines.isError) return <div>Ошибка {disciplines.error.message}</div>;
  if (!disciplines.data) return <div>Нет данных</div>;

  return (
    <div>
      <h1 className="text-xl font-semibold">Все предметы</h1>
      <div className="gap-2 items-start border p-4 shadow-md rounded-lg space-y-2 max-h-96 overflow-auto min-h-48">
        <CreateDisciplineForm />
        <div className="w-full overflow-auto">
          <table className="table-auto border w-full">
            <thead>
              <tr className="border bg-gray-100">
                <th className="border-r text-left  pl-2">Название</th>
                <th className="border-r text-left w-10">Действие</th>
              </tr>
            </thead>
            <tbody>
              <>
                {disciplines.data.map((discipline) => (
                  <tr key={discipline.id} className="border">
                    <td className="pl-2">{discipline.name}</td>
                    <td>
                      <RemoveDiscipline disciplineId={discipline.id} />
                    </td>
                  </tr>
                ))}
              </>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
