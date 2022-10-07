import type { Participation } from '@candela/types/browse/participation';

export type Game = {
  id: number;
  createdAt: Date;
  name: string;
  participations: Participation[];
};
