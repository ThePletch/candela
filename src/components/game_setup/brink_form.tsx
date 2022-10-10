import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';

import { getLeftParticipation } from '@candela/state-helpers/participations';
import type {
  Participation,
  SelfParticipation,
} from '@candela/types/participation';
import { useHttpState } from '@candela/util/state';

type FormProps = {
  participation: SelfParticipation;
  allParticipations: Participation[];
};

function promptText(props: FormProps) {
  const leftParticipation = getLeftParticipation(
    props.participation,
    props.allParticipations,
    { skipGm: false },
  );
  if (props.participation.role == 'gm') {
    return `${leftParticipation.name} has been seen by Them. What dark secret do They know?`;
  }
  if (leftParticipation.role == 'gm') {
    return 'You have uncovered something about the nature of Them. What have you found?';
  }

  return `You have seen ${leftParticipation.name} at their lowest point. What are they hiding?`;
}

function placeholder(props: FormProps) {
  const leftParticipation = getLeftParticipation(
    props.participation,
    props.allParticipations,
    { skipGm: false },
  );
  if (props.participation.role == 'gm') {
    return "They've seen you...";
  }

  if (leftParticipation.role == 'gm') {
    return "You've seen Them...";
  }

  return "I've seen you...";
}

export default function BrinkForm(props: FormProps) {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      participation: {
        written_brink: props.participation.writtenBrink,
      },
    },
  });
  const { loading, makeRequest } = useHttpState(
    `api/participations/${props.participation.id}`,
    'PATCH',
    props.participation.guid,
  );
  const onSubmit = (data: Record<string, unknown>) => {
    makeRequest(data);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
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
          about Them. The only rule is that
          {' '}
          <strong>you cannot give Them a weakness.</strong>
        </p>
        <p>
          You can embrace your brink to reroll your entire dice pool, but acting
          according to your brink reveals it to the entire group, and can create
          a host of problems of its own.
        </p>
      </div>
      <em className="text-muted">{placeholder(props)}</em>
      <Form.Control
        as="textarea"
        placeholder="...doing something unspeakable."
        {...register('participation.written_brink', { required: true })}
      />

      <Button variant="primary" disabled={loading} type="submit">
        Submit
      </Button>
    </Form>
  );
}
