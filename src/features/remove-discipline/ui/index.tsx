"use client";

import { Button } from "@/components/ui/button";
import { removeDiscipline } from "@/entities/disciplines";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { toast } from "sonner";

type Props = {
  disciplineId: number;
};

export function RemoveDiscipline({ disciplineId }: Props) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: removeDiscipline,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["disciplines_for_select"] });
      queryClient.invalidateQueries({ queryKey: ["disciplines"] });
      toast.success("Дисциплина успешно удалена");
    },
    onError: (error: any) => {
      toast.error(`Ошибка при удалении дисциплины: ${error.message}`);
    },
  });
  return (
    <Button
      variant="destructive"
      onClick={() => mutate(disciplineId)}
      disabled={isPending}
    >
      {isPending ? <Loader className="animate-spin" /> : "Удалить"}
    </Button>
  );
}
