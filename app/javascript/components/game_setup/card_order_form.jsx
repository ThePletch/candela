import React from 'react';
import { useForm } from 'react-hook-form';

import Sortable from 'sortablejs';

import { makePatchRequest } from 'util/requests';


export default class CardOrderForm extends React.Component {
  sortableCards = ['virtue', 'vice', 'moment'];

  cardListItem (name, index, sortable) {
	// todo add a hamburger icon here to indicate draggability
	return (<li className={`list-group-item ${sortable ? "" : "disabled"}`} key={index} data-id={index}>
		<span>{name}</span>
	</li>);
  }

  submitCardOrder (e) {
  	e.preventDefault();
  	// slicing out the first three elements, since we aren't tracking brink's ordering
  	const cardOrder = this.sortable.toArray().join("").slice(0, 3);
	makePatchRequest(`/api/participations/${this.props.participant.id}/`, this.props.participant.guid, {
		participation: {
			card_order: cardOrder,
		}
	});
  }

  sortableContainersDecorator(componentBackingInstance) {
    // check if backing instance not null
    if (componentBackingInstance) {
      this.sortable = Sortable.create(componentBackingInstance, {
      	filter: ".disabled"
      });
    }
  };
  render() {
	  return (
	    <form onSubmit={this.submitCardOrder.bind(this)}>
	  		<em>Order your cards.</em>
	    	<ul className="list-group" ref={this.sortableContainersDecorator.bind(this)}>
				{this.sortableCards.map((name, i) => this.cardListItem(name, i, true))}
				{this.cardListItem('brink', 3, false)}
	    	</ul>

	      <input type="submit" />
	    </form>
	  );
  }
}