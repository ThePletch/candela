type AdjacentParticipation = Omit<
  Participation,
  `left_${string}` | "right_${string}"
>;

export type TraitType = "virtue" | "vice" | "moment" | "brink";
export type Participation = {
  id: number;
  name: string;
  alive: boolean;
  role: "player" | "gm";
  hasWrittenVice: boolean;
  hasWrittenVirtue: boolean;
  hasMoment: boolean;
  hasCardOrder: boolean;
  hasBrink: boolean;
  left_participation: AdjacentParticipation;
  right_participation: AdjacentParticipation;
  right_player: Omit<AdjacentParticipation, "role"> & { role: "player" };
  left_player: Omit<AdjacentParticipation, "role"> & { role: "player" };
  characterConcept?: string;
  hopeDieCount: number;
  traits: {
    type: TraitType;
    value: string;
    burned: boolean;
  }[];
  position: number;
};

export type SelfParticipation = Participation & {
  cardOrder?: string; // todo
  vice?: string;
  writtenVice?: string;
  virtue?: string;
  writtenVirtue?: string;
  moment?: string;
  brink?: string;
};
