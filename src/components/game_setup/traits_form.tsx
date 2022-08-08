import { useForm } from "react-hook-form";

import type { Participation, SelfParticipation } from "types/participation";
import { activeParticipation } from "util/participations";
import { useHttpState, withModelListSubscription } from "util/state";
import type { GameProps } from "types/props";

export default function TraitsForm(props: GameProps) {
  const { register, handleSubmit } = useForm();
  const { loading, makeRequest } = useHttpState(
    `/api/participations/${props.participationId}/`,
    "PATCH"
  );
  const onSubmit = (data: Record<string, unknown>) => makeRequest(data);

  return withModelListSubscription(
    "ParticipationsChannel",
    { game_id: props.gameId },
    (participations: Participation[]) => {
      const me = activeParticipation(
        participations,
        props.participationId
      ) as SelfParticipation;
      const virtueText = `Virtue for ${me.right_player.name}`;
      const viceText = `Vice for ${me.left_player.name}`;

      return (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <em>What virtues and vices do your companions have?</em>
          </div>
          <div>
            <ul>
              <li>
                A virtue is a single word describing a positive trait a
                character possesses. It should solve more problems than it
                creates.
              </li>
              <li>
                A vice is a single word describing a weakness or flaw a
                character possesses. It should create more problems than it
                solves.
              </li>
            </ul>
            <span>
              You can burn your virtue or vice to reroll all the ones rolled in
              a conflict, but only by acting in accordance with the trait.
            </span>
          </div>

          <div className="form-group">
            <input
              className="form-control"
              type="text"
              placeholder={virtueText}
              name="participation[written_virtue]"
              ref={register({ required: true })}
            />
            <input
              className="form-control"
              type="text"
              placeholder={viceText}
              name="participation[written_vice]"
              ref={register({ required: true })}
            />

            <input
              type="submit"
              disabled={loading}
              className="btn btn-secondary btn-block"
            />
          </div>
        </form>
      );
    }
  );
}
