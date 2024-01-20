"use client";

import { Button } from "@/components/ui/button";
import { removeGroup } from "@/entities/groups";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { toast } from "sonner";

type Props = {
  groupId: number;
};

export function RemoveGroup({ groupId }: Props) {
  const queryClient = useQueryClient();

  const removeGroupMutation = useMutation({
    mutationFn: removeGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast.success("Группа успешно удалена");
    },
    onError: (error: any) => {
      toast.error(`Ошибка при удалении группы: ${error.message}`);
    },
  });

  return (
    <Button
      variant="destructive"
      onClick={() => removeGroupMutation.mutate(groupId)}
      disabled={removeGroupMutation.isPending}
    >
      {removeGroupMutation.isPending ? (
        <Loader className="animate-spin" />
      ) : (
        "Удалить"
      )}
    </Button>
  );
}
