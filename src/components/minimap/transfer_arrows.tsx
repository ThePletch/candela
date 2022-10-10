import type { Participation } from '@candela/types/participation';
import type { GameProps } from '@candela/types/props';
import Arrow from '@candela/components/svg/arrow';
import {
  getLeftParticipation,
  getRightParticipation,
} from '@candela/state-helpers/participations';
import { distributedPointX, distributedPointY } from '@candela/util/circle';

const youOutgoingColor = '#6666DD';
const youIncomingColor = '#3333BB';
const otherColor = '#555555';
const minimapIconDistance = 40;

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
            .map((p) => {
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
                  startX={distributedPointX(
                    minimapIconDistance,
                    p.position,
                    participations.length,
                  )}
                  startY={distributedPointY(
                    minimapIconDistance,
                    p.position,
                    participations.length,
                  )}
                  endX={distributedPointX(
                    minimapIconDistance,
                    rightPlayer.position,
                    participations.length,
                  )}
                  endY={distributedPointY(
                    minimapIconDistance,
                    rightPlayer.position,
                    participations.length,
                  )}
                  lateralOffset={-minimapIconDistance / 4}
                  title={`${p.name} is writing a virtue for ${rightPlayer.name}`}
                />
              );
              const vice = (
                <Arrow
                  key={`${p.id}-${leftPlayer.id}-vice`}
                  color={color(fromMe, viceToMe)}
                  startX={distributedPointX(
                    minimapIconDistance,
                    p.position,
                    participations.length,
                  )}
                  startY={distributedPointY(
                    minimapIconDistance,
                    p.position,
                    participations.length,
                  )}
                  endX={distributedPointX(
                    minimapIconDistance,
                    leftPlayer.position,
                    participations.length,
                  )}
                  endY={distributedPointY(
                    minimapIconDistance,
                    leftPlayer.position,
                    participations.length,
                  )}
                  lateralOffset={-minimapIconDistance / 2}
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
      // TODO hide brink arrow if brink written
      return (
        <>
          {participations.map((p) => {
            const leftParticipation = getLeftParticipation(p, participations, {
              skipGm: false,
            });
            const fromMe = p.id === me.id;
            const toMe = leftParticipation.id === me.id;
            return (
              <Arrow
                key={`${p.id}-${leftParticipation.id}-brink`}
                color={color(fromMe, toMe)}
                startX={distributedPointX(
                  minimapIconDistance,
                  p.position,
                  participations.length,
                )}
                startY={distributedPointY(
                  minimapIconDistance,
                  p.position,
                  participations.length,
                )}
                endX={distributedPointX(
                  minimapIconDistance,
                  leftParticipation.position,
                  participations.length,
                )}
                endY={distributedPointY(
                  minimapIconDistance,
                  leftParticipation.position,
                  participations.length,
                )}
                lateralOffset={-minimapIconDistance / 4}
                title={`${p.name} is writing a brink for ${leftParticipation.name}`}
              />
            );
          })}
        </>
      );
    default:
      return null;
  }
}
