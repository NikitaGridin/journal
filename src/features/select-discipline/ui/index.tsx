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
import { Discipline } from "@/entities/disciplines/api";
import { useJournalStore } from "@/entities/journal";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  disciplines: Discipline[];
};

export function SelectDiscipline({ disciplines }: Props) {
  const { current_discipline, set_current_discipline } = useJournalStore();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    if (disciplines.length > 0 && !current_discipline) {
      set_current_discipline(disciplines[0].id);
    }
  }, [disciplines, current_discipline, set_current_discipline]);

  return (
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
                disciplines.find(
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
            {disciplines.map((discipline) => (
              <CommandItem
                key={discipline.id}
                value={discipline.name}
                onSelect={(currentValue) => {
                  if (currentValue === value) {
                    // Ничего не меняем, так как элемент уже выбран
                    return;
                  }
                  setValue(currentValue);
                  set_current_discipline(discipline.id);
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
  );
}
