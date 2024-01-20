import { Button } from "@/components/ui/button";
import { createGroup } from "@/entities/groups";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function CreateGroupForm() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    specialty: "",
    course: 1,
    letter: "",
  });

  const { isPending, mutate } = useMutation({
    mutationFn: createGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
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
    mutate(formData);
    setFormData({ specialty: "", course: 1, letter: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full items-end">
      <input
        placeholder="Специальность"
        id="specialty"
        type="text"
        name="specialty"
        className="border pl-2 h-10 rounded-md"
        disabled={isPending}
        required
        value={formData.specialty}
        onChange={handleChange}
      />

      <input
        placeholder="Курс"
        id="course"
        type="number"
        name="course"
        className="border pl-2 h-10 rounded-md"
        disabled={isPending}
        required
        value={formData.course}
        onChange={handleChange}
      />

      <input
        placeholder="Буква"
        id="letter"
        type="text"
        name="letter"
        className="border pl-2 h-10 rounded-md"
        disabled={isPending}
        required
        value={formData.letter}
        onChange={handleChange}
      />

      <Button type="submit" disabled={isPending}>
        {isPending ? <Loader className="animate-spin" /> : "Добавить"}
      </Button>
    </form>
  );
}
