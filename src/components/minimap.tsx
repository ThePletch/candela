import TransferArrows from '@candela/components/minimap/transfer_arrows';
import { GAME_MAP_SIZE } from '@candela/constants';
import type { GameProps } from '@candela/types/props';
import { distributedPointAngleRadians, positionFor } from '@candela/util/circle';
import { GameParticipationsContext } from '@candela/util/contexts';
import { useSubscriptionContext } from '@candela/util/state';
import MinimapParticipation from './minimap/minimap_participation';

export default function Minimap({ game, me }: GameProps) {
  return useSubscriptionContext(
    GameParticipationsContext(game.id),
    'Loading players...',
    (participations) => (
      <svg
        preserveAspectRatio="xMidYMid meet"
        viewBox={`0 0 ${GAME_MAP_SIZE} ${GAME_MAP_SIZE}`}
        className="minimap"
      >
        {participations.map((p, i) => (
          <MinimapParticipation
            key={p.id}
            game={game}
            participation={p}
            allParticipations={participations}
            isSelf={p.id === me.id}
            position={positionFor(
              i,
              participations.length,
            )}
            angle={distributedPointAngleRadians(i, participations.length)}
          />
        ))}
        <TransferArrows game={game} me={me} participations={participations} />
      </svg>
    ),
  );
}
