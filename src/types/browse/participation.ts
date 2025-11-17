import { ParticipationRole } from "../participation";

export type Participation = {
  id: number;
  name: string;
  role: ParticipationRole;
};
