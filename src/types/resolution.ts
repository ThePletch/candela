export type BaseResolution = {
  id: number;
  successful: boolean;
  confirmed: boolean;
  conflict: {
    id: number;
    dire: boolean;
  };
  participationId: number;
  narrativeControl: {
    id: number;
    name: string;
  };
  parentResolution?: Resolution;
  playerRollResult: string;
  gmRollResult: string;
  resolver: {
    id: number;
    name: string;
    hopeDieCount: number;
  };
};

export type OverrideResolution = BaseResolution & {
  parentResolution: Resolution;
};

export type BrinkResolution = OverrideResolution & {
  type: "BrinkResolution";
};

export type MartyrResolution = OverrideResolution & {
  type: "MartyrResolution";
};

export type MomentResolution = BaseResolution & {
  type: "MomentResolution";
};

export type RollResolution = BaseResolution & {
  type: "RollResolution";
};

export type TraitResolution = OverrideResolution & {
  type: "TraitResolution";
  burnedTrait: {
    type: "virtue" | "vice";
    value: string;
  };
};

export type Resolution =
  | BrinkResolution
  | MartyrResolution
  | MomentResolution
  | RollResolution
  | TraitResolution;
