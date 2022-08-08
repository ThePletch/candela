import { useForm } from "react-hook-form";

import type { SelfParticipation } from "types/participation";
import { useHttpState } from "util/state";

export default function CharacterConceptForm(props: {
  participation: SelfParticipation;
}) {
  const { register, handleSubmit } = useForm();
  const { loading, makeRequest } = useHttpState(
    `/api/participations/${props.participation.id}/`,
    "PATCH"
  );

  return (
    <form onSubmit={handleSubmit(makeRequest)}>
      <em>Describe your character concept in a sentence or three.</em>
      <div>
        This should include their name, general appearance, and overall
        personality.
      </div>
      <textarea
        className="form-control"
        name="participation[character_concept]"
        ref={register({ required: true })}
      />

      <input className="btn btn-primary" disabled={loading} type="submit" />
    </form>
  );
}
