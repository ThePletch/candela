import type { TraitCardType } from "./participation";

export type BaseResolution = {
  id: number;
  successful: boolean;
  confirmed: boolean;
  conflict: {
    id: number;
    dire: boolean;
  };
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

export type NonOverrideResolution = BaseResolution & {
  parentResolution: undefined;
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

export type MomentResolution = NonOverrideResolution & {
  type: "MomentResolution";
};

export type RollResolution = NonOverrideResolution & {
  type: "RollResolution";
};

export type TraitResolution = OverrideResolution & {
  type: "TraitResolution";
  burnedTrait: {
    type: TraitCardType;
  };
};

export type Resolution =
  | BrinkResolution
  | MartyrResolution
  | MomentResolution
  | RollResolution
  | TraitResolution;
