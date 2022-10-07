import { useRouter } from 'next/router';
import { useEffect } from 'react';

import Game from '@candela/components/game';
import { GameContext, MeContext } from '@candela/util/contexts';
import { GUID_STORAGE_KEY, SingletonSubscription, useSubscriptionContext } from '@candela/util/state';

function Play() {
  return useSubscriptionContext(MeContext, "Loading your information...", (me) => {
    return <SingletonSubscription channel="GameChannel" context={GameContext} params={{ id: me.gameId }} >
      <Game me={me} />
    </SingletonSubscription>
  });
}

export default function () {
  const { guid } = useRouter().query;

  useEffect(() => {
    if (typeof guid === 'string') {
      localStorage.setItem(GUID_STORAGE_KEY, guid);
    }
  });

  if (typeof guid === 'string') {
    return <SingletonSubscription channel="ParticipationChannel" context={MeContext}>
      <Play />
    </SingletonSubscription>;
  }

  return <em>Reading your ID...</em>;
}
