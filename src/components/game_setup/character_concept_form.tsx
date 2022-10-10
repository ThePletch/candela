import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';

import type { SelfParticipation } from '@candela/types/participation';
import { useHttpState } from '@candela/util/state';

export default function CharacterConceptForm(props: { me: SelfParticipation }) {
  const { register, handleSubmit } = useForm();
  const { loading, makeRequest } = useHttpState(
    `api/participations/${props.me.id}`,
    'PATCH',
    props.me.guid,
  );

  return (
    <Form onSubmit={handleSubmit(makeRequest)}>
      <em>Describe your character concept in a sentence or three.</em>
      <div>
        This should include their name, general appearance, and overall
        personality.
      </div>
      <Form.Control
        as="textarea"
        {...register('participation[character_concept]', { required: true })}
      />

      <Button variant="primary" disabled={loading} type="submit">
        Submit
      </Button>
    </Form>
  );
}
