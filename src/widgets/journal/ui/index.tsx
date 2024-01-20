"use client";
import { SelectGroup } from "@/features/select-group";
import { useJournalStore } from "@/entities/journal";
import { CreateStudentForm } from "@/features/create-student-form";
import { getDisciplines, getDisciplinesForGroup } from "@/entities/disciplines";
import { SelectDiscipline } from "@/features/select-discipline";
import { AddDisciplineForGroud } from "@/features/add-discipline-for-group";
import { SelectDate } from "@/features/select-date";
import { Table } from "./table";
import { useQuery } from "@tanstack/react-query";
import { getGroups } from "@/entities/groups";

export function JournalWidget() {
  const { currentGroup } = useJournalStore();

  const disciplines = useQuery({
    queryKey: ["disciplines"],
    queryFn: () => getDisciplines(),
    refetchOnWindowFocus: false,
  });

  const disciplines_for_select = useQuery({
    queryKey: ["disciplines_for_select", currentGroup],
    queryFn: () => getDisciplinesForGroup(currentGroup),
    refetchOnWindowFocus: false,
  });

  const groups = useQuery({
    queryKey: ["groups"],
    queryFn: () => getGroups(),
    refetchOnWindowFocus: false,
  });

  return (
    <div>
      <h1 className="text-xl font-semibold">Журнал</h1>
      <div className="flex gap-2 items-start border p-4 shadow-md rounded-lg">
        <div className="w-full space-y-4">
          <div className="flex gap-4 items-end justify-between">
            <div className="flex gap-2">
              <SelectGroup groups={groups.data ?? []} />
              {currentGroup ? (
                <>
                  <SelectDiscipline
                    disciplines={disciplines_for_select.data ?? []}
                  />
                  <SelectDate />
                </>
              ) : null}
            </div>
            {currentGroup ? (
              <div className="flex gap-2">
                <AddDisciplineForGroud
                  group_id={currentGroup}
                  disciplines_for_select={disciplines.data ?? []}
                />
                <CreateStudentForm groupId={currentGroup} />
              </div>
            ) : null}
          </div>
          {currentGroup ? <Table /> : null}
        </div>
      </div>
    </div>
  );
}
