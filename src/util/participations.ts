import type { Participation } from "types/participation";

export function getTopTrait(
  participation: Participation
): Participation["traits"][number] | undefined {
  return participation.traits.find((t) => !t.burned);
}
