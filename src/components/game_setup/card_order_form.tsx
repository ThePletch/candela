import lodashIsEmpty from 'lodash/isEmpty';
import { type FormEvent, useEffect, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Sortable from 'sortablejs';

import type { SelfParticipation } from '@candela/types/participation';
import { useHttpState } from '@candela/util/state';

function CardListItem({
  name,
  index,
  sortable,
}: {
  name: string;
  index: number;
  sortable: boolean;
}) {
  // todo add a hamburger icon here to indicate draggability
  return (
    <ListGroup.Item
      className={sortable ? '' : 'disabled'}
      key={name}
      data-id={index}
    >
      <span>{name}</span>
    </ListGroup.Item>
  );
}

export default function CardOrderForm({
  participation,
}: {
  participation: SelfParticipation;
}) {
  const defaultSortOrder = ['virtue', 'vice', 'moment'];
  const myCardOrder = participation.cardOrder;

  const formCardOrder = lodashIsEmpty(myCardOrder) ? defaultSortOrder : myCardOrder;
  console.log(participation);
  const { loading, makeRequest } = useHttpState(
    `api/participations/${participation.id}`,
    'PATCH',
    participation.guid,
  );

  let sortManager: Sortable;

  const cardList = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardList.current) {
      sortManager = Sortable.create(cardList.current, {
        filter: '.disabled',
      });
    }
  });

  const submitCardOrder = (e: FormEvent) => {
    e.preventDefault();
    if (sortManager) {
      // slicing out the first three elements, since we aren't tracking brink's ordering
      const cardOrder = sortManager?.toArray().join('').slice(0, 3);
      console.log(cardOrder);
      return makeRequest({
        participation: {
          card_order: cardOrder,
        },
      });
    } else {
      console.warn(
        'Sort manager not initialized during sort submission, doing nothing.',
      );
      return Promise.resolve();
    }
  };

  // TODO persist card order in the form if it's already set
  return (
    <Form onSubmit={submitCardOrder}>
      <em>Click and drag to order your cards from top to bottom.</em>
      <div>
        You can only use the card on top of your pile, and can&apos;t use the
        cards below it until all the cards above them have been burned. Your
        brink must always be on the bottom.
      </div>
      <ListGroup className="card-order-group" ref={cardList}>
        {formCardOrder.map((name) => (
          <CardListItem key={name} name={name} index={defaultSortOrder.indexOf(name)} sortable />
        ))}
        <CardListItem name="brink" index={3} sortable={false} />
      </ListGroup>

      <Button variant="primary" disabled={loading} type="submit">
        Submit
      </Button>
    </Form>
  );
}
