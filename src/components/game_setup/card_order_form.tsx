import { type FormEvent, useEffect, useRef } from "react";

import Sortable from "sortablejs";

import type { SelfParticipation } from "@candela/types/participation";
import { useHttpState } from "@candela/util/state";

export default function CardOrderForm(props: {
  participation: SelfParticipation;
}) {
  const sortableCards = ["virtue", "vice", "moment"];

  const { loading, makeRequest } = useHttpState(
    `/api/participations/${props.participation.id}/`,
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
      <li
        className={`list-group-item ${cardProps.sortable ? "" : "disabled"}`}
        key={cardProps.index}
        data-id={cardProps.index}
      >
        <span>{cardProps.name}</span>
      </li>
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
    <form onSubmit={submitCardOrder}>
      <em>Click and drag to order your cards from top to bottom.</em>
      <div>
        You can only use the card on top of your pile, and can't use the cards
        below it until all the cards above them have been burned. Your brink
        must always be on the bottom.
      </div>
      <ul className="card-order-group list-group" ref={cardList}>
        {sortableCards.map((name, i) => (
          <CardListItem name={name} index={i} sortable={true} />
        ))}
        <CardListItem name="brink" index={3} sortable={false} />
      </ul>

      <input disabled={loading} type="submit" />
    </form>
  );
}
