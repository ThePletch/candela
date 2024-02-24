import type { Participation } from '@candela/types/participation';
import type { GameProps } from '@candela/types/props';
import Arrow from '@candela/components/svg/arrow';
import {
  getLeftParticipation,
  getRightParticipation,
} from '@candela/state-helpers/participations';
import { distributedPointAngleRadians, positionFor, tangentFrom } from '@candela/util/circle';
import { TRAIT_ICON_DISTANCE } from './trait_icons';

const youOutgoingColor = '#6666DD';
const youIncomingColor = '#3333BB';
const otherColor = '#555555';

function color(fromMe: boolean, toMe: boolean): string {
  if (fromMe) {
    return youOutgoingColor;
  }

  if (toMe) {
    return youIncomingColor;
  }

  return otherColor;
}

export default function TransferArrows({
  game,
  me,
  participations,
}: GameProps & { participations: Participation[] }) {
  switch (game.setupState) {
    case 'traits':
      // vice to the left, virtue to the right
      // TODO differentiate virtue and vice by color
      return (
        <>
          {participations
            .filter((p) => p.role === 'player')
            .flatMap((p) => {
              const leftPlayer = getLeftParticipation(p, participations, {
                skipGm: true,
              });
              const rightPlayer = getRightParticipation(p, participations, {
                skipGm: true,
              });
              const fromMe = p.id === me.id;
              const virtueToMe = rightPlayer.id === me.id;
              const viceToMe = leftPlayer.id === me.id;

              const virtue = (
                <Arrow
                  key={`${p.id}-${rightPlayer.id}-virtue`}
                  color={color(fromMe, virtueToMe)}
                  startCoordinate={positionFor(p.position, participations.length)}
                  endCoordinate={tangentFrom(
                    positionFor(rightPlayer.position, participations.length),
                    distributedPointAngleRadians(rightPlayer.position, participations.length),
                    TRAIT_ICON_DISTANCE,
                  )}
                  title={`${p.name} is writing a virtue for ${rightPlayer.name}`}
                />
              );
              const vice = (
                <Arrow
                  key={`${p.id}-${leftPlayer.id}-vice`}
                  color={color(fromMe, viceToMe)}
                  startCoordinate={positionFor(
                    p.position,
                    participations.length,
                  )}
                  endCoordinate={tangentFrom(
                    positionFor(leftPlayer.position, participations.length),
                    distributedPointAngleRadians(leftPlayer.position, participations.length),
                    -TRAIT_ICON_DISTANCE,
                  )}
                  title={`${p.name} is writing a vice for ${leftPlayer.name}`}
                />
              );

              if (!p.hasWrittenVirtue || !p.hasWrittenVice) {
                return (
                  <>
                    {virtue}
                    {vice}
                  </>
                );
              }

              return null;
            })}
        </>
      );
    case 'brinks':
      return (
        <>
          {participations.map((p) => {
            const leftParticipation = getLeftParticipation(p, participations, {
              skipGm: false,
            });
            const fromMe = p.id === me.id;
            const toMe = leftParticipation.id === me.id;
            if (!p.hasWrittenBrink) {
              return (
                <Arrow
                  key={`${p.id}-${leftParticipation.id}-brink`}
                  color={color(fromMe, toMe)}
                  startCoordinate={positionFor(
                    p.position,
                    participations.length,
                  )}
                  endCoordinate={positionFor(
                    leftParticipation.position,
                    participations.length,
                  )}
                  title={`${p.name} is writing a brink for ${leftParticipation.name}`}
                />
              );
            }

            return <></>;
          })}
        </>
      );
    default:
      return null;
  }
}
