import type { ReactElement } from "react";
import { useForm } from "react-hook-form";

import { useHttpState } from "@candela/util/state";

export default function MomentForm(props: {
  participation: { id: number };
}): ReactElement {
  const { register, handleSubmit } = useForm();
  const { loading, makeRequest } = useHttpState(
    `/api/participations/${props.participation.id}/`,
    "PATCH"
  );

  return (
    <form onSubmit={handleSubmit(makeRequest)}>
      <em>What would give your character a moment of hope?</em>
      <div>Your Moment should finish the sentence "I will find hope...".</div>
      <div>
        Aim for something concrete and reasonable to achieve during the course
        of the story, and avoid being overly specific.
      </div>
      <div>
        Before rolling for a conflict, you can choose to live your moment by
        clicking the "Live Moment" button, if you can do the thing written on
        your card during that conflict. Succeeding on the roll gets you a Hope
        die, a die that you can use on any conflict you roll for. Unlike a
        regular die, a hope die isn't lost when you roll a 1, and counts as a
        success on a roll of 5 or 6 instead of just a 6.
      </div>
      <div>
        Failing to live your moment has no additional negative effects, but you
        will burn your moment and be unable to live it in the future.
      </div>
      <em>I will find hope...</em>
      <textarea
        className="form-control"
        {...register('participation[moment]', { required: true })}
        placeholder="...when [event]/...in [situation]" />
      <input className="btn btn-primary" disabled={loading} type="submit" />
    </form>
  );
}
