import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useHttpState } from '@candela/util/state';

export default function GameForm() {
  const { register, handleSubmit } = useForm();
  const router = useRouter();

  const { loading, makeRequest } = useHttpState<{ gmGuid: string }>(
    'api/games',
    'POST',
    '',
  );
  const onSubmit = async (data: Record<string, unknown>) => {
    const response = await makeRequest(data);
    router.push(`/play/${response.gmGuid}`);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <h3>
        Start a New Game
        <br />
        <small className="text-muted">You'll be the GM.</small>
      </h3>

      <Form.Group>
        <Form.Label htmlFor="game[name]">Game name</Form.Label>
        <Form.Control
          type="text"
          {...register('game[name]', { required: true })}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label htmlFor="gm_name">Your name</Form.Label>
        <Form.Control
          type="text"
          {...register('gm_name', { required: true })}
        />
      </Form.Group>

      <Button variant="primary" disabled={loading} type="submit">
        Submit
      </Button>
    </Form>
  );
}
