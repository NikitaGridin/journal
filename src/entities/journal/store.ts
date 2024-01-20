import { create } from "zustand";
import { StudentWithGrades } from "../students/api";
import { Group } from "@prisma/client";
import { Discipline } from "../disciplines/api";

interface JournalState {
  groups: Group[];
  setGroups: (groups: Group[]) => void;
  currentGroup: number;
  setCurrentGroup: (groupId: number) => void;
  students: StudentWithGrades[];
  setStudents: (students: StudentWithGrades[]) => void;
  disciplines: Discipline[];
  setDisciplines: (disciplines: Discipline[]) => void;
  current_date: string;
  set_current_date: (current_date: string) => void;
  current_discipline: number;
  set_current_discipline: (current_discipline: number) => void;
  update: boolean;
  set_update: (value: boolean) => void;
}

export const useJournalStore = create<JournalState>()((set) => ({
  currentGroup: 0,
  setCurrentGroup: (groupId) => set({ currentGroup: groupId }),
  students: [],
  setStudents: (students) => set({ students: students }),
  groups: [],
  setGroups: (groups) => set({ groups: groups }),
  disciplines: [],
  setDisciplines: (disciplines) => set({ disciplines: disciplines }),
  current_date: "",
  set_current_date: (current_date) => set({ current_date: current_date }),
  current_discipline: 0,
  set_current_discipline: (current_discipline) =>
    set({ current_discipline: current_discipline }),
  update: false,
  set_update: (value) => set({ update: value }),
}));
