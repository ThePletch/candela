import type { Participation, TraitType } from '@candela/types/participation';

const traitsInOrder = ['virtue', 'vice', 'moment', 'brink'];

function getAdjacentParticipation(
  participation: Participation,
  participations: Participation[],
  { skipGm }: { skipGm: boolean },
  direction: 'left' | 'right',
): Participation {
  // avoid infinite loops if there's only one participation in the list
  if (participations.length <= 1) {
    return participation;
  }

  let targetPosition = (participation.position + (direction === 'right' ? 1 : -1))
    % participations.length;
  if (targetPosition < 0) {
    targetPosition = participations.length + targetPosition;
  }
  const targetParticipation = participations.find(
    (p) => p.position === targetPosition,
  );
  if (targetParticipation === undefined) {
    throw new Error(
      `Couldn't find participation with position ${targetPosition}.`,
    );
  }

  if (skipGm && targetParticipation.role === 'gm') {
    return getAdjacentParticipation(
      targetParticipation,
      participations,
      { skipGm },
      direction,
    );
  }

  return targetParticipation;
}

export function getLeftParticipation(
  participation: Participation,
  participations: Participation[],
  options: { skipGm: boolean },
): Participation {
  return getAdjacentParticipation(
    participation,
    participations,
    options,
    'left',
  );
}

export function getRightParticipation(
  participation: Participation,
  participations: Participation[],
  options: { skipGm: boolean },
): Participation {
  return getAdjacentParticipation(
    participation,
    participations,
    options,
    'right',
  );
}

export function getTopTrait(
  participation: Participation,
): TraitType | undefined {
  return participation.cardOrder.find(
    (trait) => participation.traits[trait]?.burned === false,
  );
}

export function getTraitId(trait: TraitType): number {
  return traitsInOrder.indexOf(trait);
}
