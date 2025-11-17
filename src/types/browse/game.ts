import type { Participation } from "./participation";

export type Game = {
  id: number;
  createdAt: Date;
  name: string;
  participations: Participation[];
};
