import lodashIsEmpty from 'lodash/isEmpty';

import type { Game } from '@candela/types/game';
import type { Participation } from '@candela/types/participation';

// TODO Mark GM pending when no players are pending in a player-driven step
function isPending(
  participation: Participation,
  setupState: Game['setupState'],
): boolean {
  const isPlayer = participation.role !== 'gm';
  switch (setupState) {
    case 'nascent':
    case 'module_intro':
      return !isPlayer;
    case 'traits':
      return (
        isPlayer
        && !(participation.hasWrittenVirtue && participation.hasWrittenVice)
      );
    case 'character_concept':
      return isPlayer && !participation.characterConcept;
    case 'moments':
      return isPlayer && !participation.hasMoment;
    case 'brinks':
      return !participation.hasWrittenBrink;
    case 'order_cards':
      return isPlayer && lodashIsEmpty(participation.cardOrder);
    default:
      return false;
  }
}

export default function PendingIndicator({
  x,
  y,
  game,
  participation,
}: {
  x: number;
  y: number;
  game: Game;
  participation: Participation;
}) {
  if (isPending(participation, game.setupState)) {
    return (
      <text
        x={x}
        y={y}
        dy={2.5}
        dx={1}
        stroke="none"
        fill="#ffffff"
        style={{ fontSize: '3px' }}
      >
        ...
      </text>
    );
  }

  return null;
}
