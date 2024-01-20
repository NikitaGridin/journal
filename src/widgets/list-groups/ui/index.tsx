"use client";
import { getGroups } from "@/entities/groups";
import { CreateGroupForm } from "@/features/create-group";
import { RemoveGroup } from "@/features/remove-group";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";

export function ListGroupsWidget() {
  const groups = useQuery({
    queryKey: ["groups"],
    queryFn: () => getGroups(),
    refetchOnWindowFocus: false,
  });

  if (groups.isLoading)
    return (
      <div className="gap-2 border p-4 shadow-md rounded-lg space-y-2 max-h-96 overflow-auto min-h-48 flex items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    );
  if (groups.isError) return <div>Ошибка {groups.error.message}</div>;
  if (!groups.data) return <div>Нет данных</div>;

  return (
    <div>
      <h1 className="text-xl font-semibold">Все группы</h1>
      <div className="gap-2 items-start border p-4 shadow-md rounded-lg space-y-2 max-h-96 overflow-auto min-h-48">
        <CreateGroupForm />
        <div className="w-full">
          <table className="table-auto border w-full">
            <thead>
              <tr className="border bg-gray-100">
                <th className="border-r text-left pl-2">Специальность</th>
                <th className="border-r text-left pl-2">Курс</th>
                <th className="border-r text-left pl-2">Буква</th>
                <th className="border-r text-left w-10">Действие</th>
              </tr>
            </thead>
            <tbody>
              {groups.data?.map((group) => (
                <tr key={group.id} className="border">
                  <td className="border-r pl-2">{group.specialty}</td>
                  <td className="border-r pl-2">{group.course}</td>
                  <td className="border-r pl-2">{group.letter}</td>
                  <td>
                    <RemoveGroup groupId={group.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
