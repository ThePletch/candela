import type { SelfParticipation } from "types/participation";
import { useHttpState } from "util/state";

import { useForm } from "react-hook-form";

type FormProps = { participation: SelfParticipation };

function promptText(props: FormProps) {
  if (props.participation.role == "gm") {
    return `${props.participation.left_participation.name} has been seen by Them. What dark secret do They know?`;
  } else {
    if (props.participation.left_participation.role == "gm") {
      return "You have uncovered something about the nature of Them. What have you found?";
    }

    return `You have seen ${props.participation.left_participation.name} at their lowest point. What are they hiding?`;
  }
}

function placeholder(props: FormProps) {
  if (props.participation.role == "gm") {
    return "They've seen you...";
  }

  if (props.participation.left_participation.role == "gm") {
    return "You've seen Them...";
  }

  return "I've seen you...";
}

export default function BrinkForm(props: FormProps) {
  const { register, handleSubmit } = useForm();
  const { loading, makeRequest } = useHttpState(
    `/api/participations/${props.participation.id}/`,
    "PATCH"
  );
  const onSubmit = (data: Record<string, unknown>) => makeRequest(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <em>{promptText(props)}</em>
      <div>
        <p>
          A Brink should represent something secret and dangerous that calls the
          character's humanity, stability, or reliability into question.
        </p>
        <p>
          Unlike the other cards you've filled out, you should keep your own
          brink a secret from the party until it is used.
        </p>
        <p>
          Your character will begin the game knowing about the brink of the
          character you're passing this brink to, including if it's Them. It's
          up to you how your character came upon this knowledge, and whether
          your character shares this knowledge or keeps it to themselves.
        </p>
        <p>
          If you're writing a brink for the GM, you get to describe something
          about Them. The only rule is that{" "}
          <strong>you cannot give Them a weakness.</strong>
        </p>
        <p>
          You can embrace your brink to reroll your entire dice pool, but acting
          according to your brink reveals it to the entire group, and can create
          a host of problems of its own.
        </p>
      </div>
      <em className="text-muted">{placeholder(props)}</em>
      <textarea
        className="form-control"
        placeholder="...doing something unspeakable."
        name="participation[written_brink]"
        ref={register({ required: true })}
      />

      <input className="btn btn-primary" disabled={loading} type="submit" />
    </form>
  );
}
