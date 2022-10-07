import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useForm } from "react-hook-form";

import type { SelfParticipation } from "@candela/types/participation";
import { useHttpState } from "@candela/util/state";

export default function TraitsForm(props: { participation: SelfParticipation }) {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      participation: {
        written_virtue: props.participation.writtenVirtue,
        written_vice: props.participation.writtenVice,
      },
    },
  });
  const { loading, makeRequest } = useHttpState(
    `api/participations/${props.participation.id}`,
    "PATCH"
  );
  const onSubmit = (data: Record<string, unknown>) => makeRequest(data);

  const virtueText = `Virtue for ${props.participation.rightPlayer.name}`;
  const viceText = `Vice for ${props.participation.leftPlayer.name}`;
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
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

      <Form.Group>
        <Form.Control
          type="text"
          placeholder={virtueText}
          {...register('participation.written_virtue', { required: true })} />
        <Form.Control
          type="text"
          placeholder={viceText}
          {...register('participation.written_vice', { required: true })} />
        <div className="d-grid gap-2">
          <Button variant="secondary"
            size="lg"
            type="submit"
            disabled={loading}
          />
        </div>
      </Form.Group>
    </Form>
  );
}
