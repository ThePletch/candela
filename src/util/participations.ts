import type { Participation, SelfParticipation } from "types/participation";

export function activeParticipation(
  participations: Participation[],
  id: number
): SelfParticipation {
  const participation = participations.find((p) => p.id === id);
  if (!participation) {
    throw new Error(`Active participant ID ${id} not in list.`);
  }
  return participation as SelfParticipation;
}

export function getTopTrait(
  participation: Participation
): Participation["traits"][number] | undefined {
  return participation.traits.find((t) => !t.burned);
}
