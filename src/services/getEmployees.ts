import type { Employee } from "@/types";

export async function getEmployees(): Promise<Employee[]> {
  const response = await fetch(
    "https://randomuser.me/api/?results=100&nat=us,dk,fr,gb&seed=asdasdasdasd",
  );
  if (!response.ok) {
    throw new Error("Failed to fetch employees");
  }

  const data = await response.json();
  return data.results;
}
