import type { FieldPresenceFlags } from '@candela/util/types';

export type AdjacentParticipation = Omit<
  Participation,
  `left${Capitalize<string>}` | `right${Capitalize<string>}`
>;

/**
 * Fields that will be filled in during character generation.
 */
type FillableFields = {
  cardOrder?: string; // todo
  vice?: string;
  writtenVice?: string;
  virtue?: string;
  writtenVirtue?: string;
  moment?: string;
  brink?: string;
  writtenBrink?: string;
};

export type TraitType = "virtue" | "vice" | "moment" | "brink";
export type Participation = {
  id: number;
  gameId: number;
  name: string;
  alive: boolean;
  role: "player" | "gm";
  leftParticipation: AdjacentParticipation;
  rightParticipation: AdjacentParticipation;
  rightPlayer: Omit<AdjacentParticipation, "role"> & { role: "player" };
  leftPlayer: Omit<AdjacentParticipation, "role"> & { role: "player" };
  characterConcept?: string;
  hopeDieCount: number;
  traits: {
    type: TraitType;
    value: string;
    burned: boolean;
  }[];
  position: number;
} & FieldPresenceFlags<FillableFields>;

export type SelfParticipation = Participation & FillableFields;
