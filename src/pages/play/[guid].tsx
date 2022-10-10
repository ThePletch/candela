import { useRouter } from 'next/router';

import Game from '@candela/components/game';
import { GameContext, MeContext } from '@candela/util/contexts';
import {
  SingletonSubscription,
  useSubscriptionContext,
} from '@candela/util/state';

function Play(props: { guid: string }) {
  return useSubscriptionContext(
    MeContext(props.guid),
    'Loading your information...',
    (me) => {
      const gameIdParams = { id: me.gameId, ...props };
      return (
        <SingletonSubscription
          channel="GameChannel"
          context={GameContext(me.gameId)}
          params={gameIdParams}
        >
          <Game me={me} />
        </SingletonSubscription>
      );
    },
  );
}

export default function PlayPage() {
  const { guid: rawGuid } = useRouter().query;

  const guid = (rawGuid as string | undefined) || '';

  return (
    <SingletonSubscription
      channel="ParticipationChannel"
      context={MeContext(guid)}
      params={{ guid }}
    >
      <Play guid={guid} />
    </SingletonSubscription>
  );
}
