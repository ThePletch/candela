import { useState } from "react";

import Participation from "@candela/components/participation";
import type { SelfParticipation } from '@candela/types/participation';
import { GameParticipationsContext } from "@candela/util/contexts";
import { useSubscriptionContext } from "@candela/util/state";


export default function ParticipationsList(props: { me: SelfParticipation }) {
  const [visible, setVisibility] = useState(false);

  function toggleVisibility() {
    setVisibility(!visible);
  }

  return useSubscriptionContext(GameParticipationsContext, "Loading players...", (participations) => {
    return (
      <div className="participations-list-wrapper">
        <button
          type="button"
          onClick={toggleVisibility}
          className="participations-button"
        >
          Players
        </button>
        <div
          className={`collapse ${visible && "show"}`}
          id="participations-list"
        >
          <div className="participations-list">
            {participations.map((participation) => {
              return (
                <Participation
                  key={participation.id}
                  participation={participation}
                  isActiveParticipation={participation.id === props.me.id}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  });
}
