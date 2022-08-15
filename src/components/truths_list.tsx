import Truth from "@candela/components/truth";

import type { Truth as TruthObject } from "@candela/types/truth";
import { withModelListSubscription } from "@candela/util/state";

function AreWeAlive(props: { truthsAllStated: boolean }) {
  if (props.truthsAllStated) {
    return <span>...and we are alive.</span>;
  }

  return null;
}

type TruthsListProps = {
  sceneId: number;
  truthsRemaining: number;
};

export default function TruthsList(props: TruthsListProps) {
  return withModelListSubscription(
    "TruthsChannel",
    { scene_id: props.sceneId },
    (truths: TruthObject[]) => {
      // we don't want to display this for the first scene.
      if (truths.length === 0 && props.truthsRemaining === 0) {
        return <div></div>;
      }

      return (
        <div>
          <em>These things are true...</em>
          <ul>
            <li key="0">The world is dark.</li>
            {truths.map((truth) => (
              <li key={truth.id}>
                <Truth {...truth} />
              </li>
            ))}
          </ul>
          <AreWeAlive truthsAllStated={props.truthsRemaining === 0} />
        </div>
      );
    }
  );
}
