import { type FormEvent, useEffect, useRef } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Sortable from "sortablejs";

import type { SelfParticipation } from "@candela/types/participation";
import { useHttpState } from "@candela/util/state";

export default function CardOrderForm(props: {
  participation: SelfParticipation;
}) {
  const sortableCards = ["virtue", "vice", "moment"];

  const { loading, makeRequest } = useHttpState(
    `api/participations/${props.participation.id}`,
    "PATCH"
  );

  let sortManager: Sortable;

  const cardList = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (cardList.current && !sortManager) {
      sortManager = Sortable.create(cardList.current, {
        filter: ".disabled",
      });
    }
  });

  function CardListItem(cardProps: {
    name: string;
    index: number;
    sortable: boolean;
  }) {
    // todo add a hamburger icon here to indicate draggability
    return (
      <ListGroup.Item
        className={cardProps.sortable ? "" : "disabled"}
        key={cardProps.index}
        data-id={cardProps.index}
      >
        <span>{cardProps.name}</span>
      </ListGroup.Item>
    );
  }

  function submitCardOrder(e: FormEvent) {
    e.preventDefault();
    if (sortManager) {
      // slicing out the first three elements, since we aren't tracking brink's ordering
      const cardOrder = sortManager?.toArray().join("").slice(0, 3);
      makeRequest({
        participation: {
          card_order: cardOrder,
        },
      });
    } else {
      console.warn("Sort manager not initialized, doing nothing.");
    }
  }

  return (
    <Form onSubmit={submitCardOrder}>
      <em>Click and drag to order your cards from top to bottom.</em>
      <div>
        You can only use the card on top of your pile, and can't use the cards
        below it until all the cards above them have been burned. Your brink
        must always be on the bottom.
      </div>
      <ListGroup className="card-order-group" ref={cardList as any}>
        {sortableCards.map((name, i) => (
          <CardListItem key={i} name={name} index={i} sortable={true} />
        ))}
        <CardListItem name="brink" index={3} sortable={false} />
      </ListGroup>

      <Button variant="primary" disabled={loading} type="submit" />
    </Form>
  );
}
