import React, { useEffect } from "react";
import { useJournalStore } from "@/entities/journal";

export function SelectDate() {
  const { set_current_date, current_date } = useJournalStore();

  useEffect(() => {
    const currentDate = new Date();
    const currentYearMonth = currentDate.toISOString().slice(0, 7);
    set_current_date(currentYearMonth);
  }, [set_current_date]);

  return (
    <input
      id="date"
      type="month"
      className="border p-2 h-10 rounded-md hover:cursor-pointer hover:bg-gray-100 transition-all"
      value={current_date}
      onChange={(e) => set_current_date(e.target.value)}
    />
  );
}
