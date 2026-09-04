export * from "./pizzas";
export * from "./acai";
export * from "./simple";

export const byId = <T extends { id: string }>(list: T[], id: string): T => {
  const found = list.find((x) => x.id === id);
  if (!found) throw new Error("Item não encontrado: " + id);
  return found;
};

export const available = <T extends { available: boolean }>(list: T[]): T[] => list.filter((x) => x.available);
