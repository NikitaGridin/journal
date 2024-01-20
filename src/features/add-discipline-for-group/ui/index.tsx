"use client";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Discipline, addDisciplineToGroup } from "@/entities/disciplines/api";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, ChevronsUpDown, Loader } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  group_id: number;
  disciplines_for_select: Discipline[];
};

export function AddDisciplineForGroud({
  disciplines_for_select,
  group_id,
}: Props) {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const [selectedDiscipline, setSelectedDiscipline] = useState(0);

  const { isPending, mutate } = useMutation({
    mutationFn: addDisciplineToGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["disciplines_for_select"],
      });
      toast.success("Предмет для группы успешно добавлен");
    },
    onError: (error: any) => {
      toast.error(
        `Ошибка при добавлении предмета для группы: ${error.message}`
      );
    },
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    mutate({ groupId: group_id, disciplineId: selectedDiscipline });
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full items-end">
      <div className="flex flex-col">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between"
            >
              {value ? (
                <span>
                  {
                    disciplines_for_select.find(
                      (discipline) => discipline.name.toLowerCase() === value
                    )?.name
                  }
                </span>
              ) : (
                "Выберите предмет..."
              )}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Найти предмет..." />
              <CommandEmpty>Предмет не найден.</CommandEmpty>
              <CommandGroup>
                {disciplines_for_select.map((discipline) => (
                  <CommandItem
                    key={discipline.id}
                    value={discipline.name}
                    onSelect={(currentValue) => {
                      if (currentValue === value) {
                        // Ничего не меняем, так как элемент уже выбран
                        return;
                      }
                      setValue(currentValue);
                      setSelectedDiscipline(discipline.id);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === discipline.name.toLowerCase()
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {discipline.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <Button type="submit" disabled={isPending || !selectedDiscipline}>
        {isPending ? <Loader className="animate-spin" /> : "Добавить"}
      </Button>
    </form>
  );
}
