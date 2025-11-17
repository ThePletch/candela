import type { Game } from "./game";
import type { SelfParticipation } from "./participation";

export type ParticipationProps = {
  participationId: number;
};

export type GameProps = {
  game: Game;
  me: SelfParticipation;
};
