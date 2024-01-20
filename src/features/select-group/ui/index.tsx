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
import { Group } from "@/entities/groups/api";
import { useJournalStore } from "@/entities/journal";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

type Props = {
  groups: Group[];
};

export function SelectGroup({ groups }: Props) {
  const { setCurrentGroup } = useJournalStore();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

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
                groups.find(
                  (group) =>
                    `${group.specialty}-${group.course}${group.letter}`.toLowerCase() ===
                    value
                )?.specialty
              }
              -
              {
                groups.find(
                  (group) =>
                    `${group.specialty}-${group.course}${group.letter}`.toLowerCase() ===
                    value
                )?.course
              }
              {
                groups.find(
                  (group) =>
                    `${group.specialty}-${group.course}${group.letter}`.toLowerCase() ===
                    value
                )?.letter
              }
            </span>
          ) : (
            "Выберите группу..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Найти группу..." />
          <CommandEmpty>Группа не найдена.</CommandEmpty>
          <CommandGroup>
            {groups.map((group) => (
              <CommandItem
                key={group.id}
                value={`${group.specialty}-${group.course}${group.letter}`}
                onSelect={(currentValue) => {
                  if (currentValue === value) {
                    return;
                  }
                  setValue(currentValue);
                  setCurrentGroup(group.id);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value ===
                      `${group.specialty}-${group.course}${group.letter}`.toLowerCase()
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                {group.specialty}-{group.course}
                {group.letter}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
