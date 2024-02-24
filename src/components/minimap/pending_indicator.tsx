import lodashIsEmpty from 'lodash/isEmpty';

import type { Game } from '@candela/types/game';
import type { Participation } from '@candela/types/participation';
import { Coordinate } from '@candela/types/svg';

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
  position,
  game,
  participation,
}: {
  position: Coordinate;
  game: Game;
  participation: Participation;
}) {
  if (isPending(participation, game.setupState)) {
    const [x, y] = position;
    return (
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dy={0.75}
        stroke="none"
        style={{ fontSize: '2px' }}
      >
        ⏳
      </text>
    );
  }

  return null;
}
