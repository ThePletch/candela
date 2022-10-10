import type { ReactElement } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';

import type { SelfParticipation } from '@candela/types/participation';
import { useHttpState } from '@candela/util/state';

export default function MomentForm(props: {
  me: SelfParticipation;
}): ReactElement {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      participation: {
        moment: props.me.moment,
      },
    },
  });
  const { loading, makeRequest } = useHttpState(
    `api/participations/${props.me.id}`,
    'PATCH',
    props.me.guid,
  );

  return (
    <Form onSubmit={handleSubmit(makeRequest)}>
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
      <Form.Control
        as="textarea"
        {...register('participation.moment', { required: true })}
        placeholder="...when [event]/...in [situation]"
      />
      <Button variant="primary" disabled={loading} type="submit">
        Submit
      </Button>
    </Form>
  );
}
