import type { Game } from '@candela/types/game';
import type { SelfParticipation } from '@candela/types/participation';

export type ParticipationProps = {
  participationId: number;
};

export type GameProps = {
  game: Game;
  me: SelfParticipation;
};
