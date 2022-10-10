import type { FieldPresenceFlags } from '@candela/util/types';

/**
 * Fields that will be filled in during character generation.
 */
type FillableFields = {
  vice?: string;
  writtenVice?: string;
  virtue?: string;
  writtenVirtue?: string;
  moment?: string;
  brink?: string;
  writtenBrink?: string;
};

export type TraitType = 'virtue' | 'vice' | 'moment' | 'brink';
export type Participation = {
  id: number;
  gameId: number;
  name: string;
  alive: boolean;
  role: 'player' | 'gm';
  characterConcept?: string;
  hopeDieCount: number;
  traits: {
    [Key in TraitType]?: {
      burned: boolean;
      value: string;
    };
  };
  cardOrder: TraitType[];
  position: number;
} & FieldPresenceFlags<FillableFields>;

export type SelfParticipation = Participation &
FillableFields & {
  guid: string;
};
