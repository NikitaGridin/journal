"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { removeStudent } from "@/entities/students";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  studentId: number;
};

export function RemoveStudent({ studentId }: Props) {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationFn: removeStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Студент успешно удалён");
      setOpen(false);
    },
    onError: (error: any) => {
      toast.error(`Ошибка при удалении студента: ${error.message}`);
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Удалить</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Вы уверены что хотите удалить студента?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Студент и вся связанная с ним информация будет удалена!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            variant="destructive"
            onClick={() => mutate(studentId)}
            disabled={isPending}
          >
            {isPending ? <Loader className="animate-spin" /> : "Удалить"}
          </Button>
          <AlertDialogCancel>Закрыть</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
