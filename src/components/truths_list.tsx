import Truth from '@candela/components/truth';

import { SceneTruthsContext } from '@candela/util/contexts';
import { useSubscriptionContext } from '@candela/util/state';

function AreWeAlive({ truthsAllStated }: { truthsAllStated: boolean }) {
  if (truthsAllStated) {
    return <span>...and we are alive.</span>;
  }

  return null;
}

type TruthsListProps = {
  sceneId: number;
  truthsRemaining: number;
};

export default function TruthsList({
  sceneId,
  truthsRemaining,
}: TruthsListProps) {
  return useSubscriptionContext(
    SceneTruthsContext(sceneId),
    'Loading truths...',
    (truths) => {
      // we don't want to display this for the first scene.
      if (truths.length === 0 && truthsRemaining === 0) {
        return null;
      }

      return (
        <div>
          <em>These things are true...</em>
          <ul>
            <li key="0">The world is dark.</li>
            {truths.map((truth) => (
              <li key={truth.id}>
                <Truth id={truth.id} description={truth.description} speaker={truth.speaker} />
              </li>
            ))}
          </ul>
          <AreWeAlive truthsAllStated={truthsRemaining === 0} />
        </div>
      );
    },
  );
}
