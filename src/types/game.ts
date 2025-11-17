export type GameState =
  | "nascent"
  | "traits"
  | "module_intro"
  | "character_concept"
  | "moments"
  | "brinks"
  | "order_cards"
  | "ready";

export type Game = {
  id: number;
  name: string;
  candlesLit: number;
  isOver: boolean;
  setupState: GameState;
};
