import { useMutation, useQueryClient } from "@tanstack/react-query";

const submitFormData = async ({ childId, responses, formVersion }) => {
  const response = await fetch("/api/form-data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ childId, responses, formVersion }),
  });

  if (!response.ok) {
    throw new Error("Failed to submit form data");
  }
  return response.json();
};

export const useSubmitFormData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitFormData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["children"] });
    },
  });
};
