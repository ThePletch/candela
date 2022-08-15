import { useState } from "react";
import Participation from "@candela/components/participation";

import type {
  Participation as ParticipationType,
  SelfParticipation,
} from "@candela/types/participation";
import { withModelListSubscription } from "@candela/util/state";

type ParticipationsListProps = { participationId: number; gameId: number };

export default function ParticipationsList(props: ParticipationsListProps) {
  const [visible, setVisibility] = useState(false);

  function toggleVisibility() {
    setVisibility(!visible);
  }

  return withModelListSubscription(
    "ParticipationsChannel",
    { game_id: props.gameId },
    (participations: ParticipationType[]) => {
      const activeParticipationObj: SelfParticipation | undefined =
        participations.find((p) => p.id == props.participationId);

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
                    activeParticipationId={activeParticipationObj?.id || 0}
                  />
                );
              })}
            </div>
          </div>
        </div>
      );
    }
  );
}
