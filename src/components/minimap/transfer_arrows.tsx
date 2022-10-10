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

export default function TransferArrows(
  props: GameProps & { participations: Participation[] },
) {
  switch (props.game.setupState) {
    case 'traits':
      // vice to the left, virtue to the right
      // TODO differentiate virtue and vice by color
      return (
        <>
          {props.participations
            .filter((p) => p.role === 'player')
            .map((p) => {
              const leftPlayer = getLeftParticipation(p, props.participations, {
                skipGm: true,
              });
              const rightPlayer = getRightParticipation(
                p,
                props.participations,
                { skipGm: true },
              );
              const fromMe = p.id === props.me.id;
              const virtueToMe = rightPlayer.id === props.me.id;
              const viceToMe = leftPlayer.id === props.me.id;

              const virtue = (
                <Arrow
                  key={`${p.id}-${rightPlayer.id}-virtue`}
                  color={
                    fromMe
                      ? youOutgoingColor
                      : virtueToMe
                        ? youIncomingColor
                        : otherColor
                  }
                  startX={distributedPointX(
                    minimapIconDistance,
                    p.position,
                    props.participations.length,
                  )}
                  startY={distributedPointY(
                    minimapIconDistance,
                    p.position,
                    props.participations.length,
                  )}
                  endX={distributedPointX(
                    minimapIconDistance,
                    rightPlayer.position,
                    props.participations.length,
                  )}
                  endY={distributedPointY(
                    minimapIconDistance,
                    rightPlayer.position,
                    props.participations.length,
                  )}
                  lateralOffset={-minimapIconDistance / 4}
                  title={`${p.name} is writing a virtue for ${rightPlayer.name}`}
                />
              );
              const vice = (
                <Arrow
                  key={`${p.id}-${leftPlayer.id}-vice`}
                  color={
                    fromMe
                      ? youOutgoingColor
                      : viceToMe
                        ? youIncomingColor
                        : otherColor
                  }
                  startX={distributedPointX(
                    minimapIconDistance,
                    p.position,
                    props.participations.length,
                  )}
                  startY={distributedPointY(
                    minimapIconDistance,
                    p.position,
                    props.participations.length,
                  )}
                  endX={distributedPointX(
                    minimapIconDistance,
                    leftPlayer.position,
                    props.participations.length,
                  )}
                  endY={distributedPointY(
                    minimapIconDistance,
                    leftPlayer.position,
                    props.participations.length,
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
          {props.participations.map((p) => {
            const leftParticipation = getLeftParticipation(
              p,
              props.participations,
              { skipGm: false },
            );
            const fromMe = p.id === props.me.id;
            const toMe = leftParticipation.id === props.me.id;
            return (
              <Arrow
                key={`${p.id}-${leftParticipation.id}-brink`}
                color={
                  fromMe
                    ? youOutgoingColor
                    : toMe
                      ? youIncomingColor
                      : otherColor
                }
                startX={distributedPointX(
                  minimapIconDistance,
                  p.position,
                  props.participations.length,
                )}
                startY={distributedPointY(
                  minimapIconDistance,
                  p.position,
                  props.participations.length,
                )}
                endX={distributedPointX(
                  minimapIconDistance,
                  leftParticipation.position,
                  props.participations.length,
                )}
                endY={distributedPointY(
                  minimapIconDistance,
                  leftParticipation.position,
                  props.participations.length,
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
