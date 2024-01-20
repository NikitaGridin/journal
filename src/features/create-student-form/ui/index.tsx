"use client";
import { Button } from "@/components/ui/button";
import { createStudent } from "@/entities/students/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  groupId: number;
};

export function CreateStudentForm({ groupId }: Props) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: "",
  });

  const { isPending, mutate } = useMutation({
    mutationFn: createStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Группа успешно добавлена");
    },
    onError: (error: any) => {
      toast.error(`Ошибка при добавлении группы: ${error.message}`);
    },
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    mutate({ name: formData.name, group_id: groupId });
    setFormData({ name: "" });
  };
  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end">
      <input
        placeholder="Новый студент"
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        className="border pl-2 rounded-md h-10"
        disabled={isPending}
        required
      />
      <Button type="submit" disabled={isPending || !formData.name.length}>
        {isPending ? <Loader className="animate-spin" /> : "Добавить"}
      </Button>
    </form>
  );
}
