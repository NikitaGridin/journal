"use client";
import { Button } from "@/components/ui/button";
import { createDiscipline } from "@/entities/disciplines";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function CreateDisciplineForm() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: "",
  });

  const { isPending, mutate } = useMutation({
    mutationFn: createDiscipline,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["disciplines"] });
      toast.success("Дисциплина успешно добавлена");
    },
    onError: (error: any) => {
      toast.error(`Ошибка при добавлении дисциплины: ${error.message}`);
    },
  });
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    mutate(formData);
    setFormData({ name: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full items-end">
      <input
        placeholder="Название"
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        className="border pl-2 h-10 rounded-md"
        disabled={isPending}
        required
      />
      <Button type="submit" disabled={isPending || !formData.name.length}>
        {isPending ? <Loader className="animate-spin" /> : "Добавить"}
      </Button>
    </form>
  );
}
