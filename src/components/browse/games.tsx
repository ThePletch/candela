import Link from 'next/link';
import { useRouter } from 'next/router';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import ListGroup from 'react-bootstrap/ListGroup';
import { useForm } from "react-hook-form";

import type { Game } from "@candela/types/browse/game";
import type { Participation } from "@candela/types/browse/participation";
import { GamesContext } from '@candela/util/contexts';
import {
  ModelListSubscription,
  useHttpState,
  useSubscriptionContext,
} from "@candela/util/state";

function GameParticipation(props: { participation: Participation }) {
  const background = props.participation.role === 'gm' ? 'success' : 'secondary';
  return <Badge className="m-1 p-2" bg={background}>
    <span>{props.participation.name}</span>
    <Badge bg="dark" className="ml-1">{props.participation.role}</Badge>
  </Badge>;
}

function GameListEntry(props: { game: Game }) {
  const { register, handleSubmit, formState: { isValid } } = useForm({ mode: 'onChange' });
  const router = useRouter();

  const { loading, makeRequest } = useHttpState(
    `api/games/${props.game.id}/participations`,
    "POST"
  );
  const onSubmit = async (data: Record<string, unknown>) => {
    const response = await makeRequest(data);
    console.log(response);
    router.push(`/play/${response.guid}`);
  };

  return <ListGroup.Item>
    <h5>{props.game.name}</h5>
    <div className="m-2">
      {props.game.participations.map((participation) => <GameParticipation key={participation.id} participation={participation} />)}
    </div>
    <Form onSubmit={handleSubmit(onSubmit)}>
      <InputGroup>
        <Form.Control className="col-xl-4 col-lg-6" type="text" placeholder="Your name"
          {...register('participation.name', { required: true })} />
        <Button variant="primary" disabled={loading || !isValid} type="submit">Join</Button>
      </InputGroup>
    </Form>
  </ListGroup.Item>;
}

function GameList() {
  return useSubscriptionContext(GamesContext, "Loading games...", (games) => {
    if (games.length === 0) {
      return <p>No games are recruiting right now.</p>;
    }
    return <div>
      <h3>Games currently seeking players</h3>
      <ListGroup className="m-2">
        {games.map((game) => <GameListEntry key={game.id} game={game} />)}
      </ListGroup>
    </div>;
  });
}

export default function Games() {
  return <ModelListSubscription channel="GamesChannel" context={GamesContext}>
    <GameList />
    <Link href="games/new">
      <Button variant="primary">Start your own</Button>
    </Link>
  </ModelListSubscription>;
}
