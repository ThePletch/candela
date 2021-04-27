import React from 'react';
import { useForm } from 'react-hook-form';

import { makePatchRequest } from 'util/requests';

export default function TraitsForm(props) {
  const { register, handleSubmit, errors } = useForm();
  const onSubmit = data => {
  	console.log(data);
  	console.log(props);
  	makePatchRequest(`/api/participations/${props.participant.id}/`, props.participant.guid, data)
  };
  const virtueText = `Virtue for ${props.participant.left_player.name}`
  const viceText = `Vice for ${props.participant.right_player.name}`

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <em>What virtues and vices do your companions have?</em>
      <div className="form-group">
	    <input
	    	className="form-control"
	    	type="text"
	    	placeholder={virtueText}
	    	name="participation[written_virtue]"
	    	ref={register({required: true})} />
	    <input
	    	className="form-control"
	    	type="text"
	    	placeholder={viceText}
	    	name="participation[written_vice]"
	    	ref={register({required: true})} />

	    <input type="submit" />
	  </div>
    </form>
  );
}
