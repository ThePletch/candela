import React from 'react';
import { useForm } from 'react-hook-form';

import { makePatchRequest } from 'util/requests';

function promptText (props) {
	console.log(props)
	if (props.participant.role == 'gm') {
		return `${props.participant.left_participant.name} has been seen by Them. What dark secret do They know?`
	} else {
		if (props.participant.left_participant.role == 'gm') {
			return "You know a secret about the nature of Them. What have you uncovered?"
		}

		return `You know a secret about ${props.participant.left_participant.name}. What are they hiding?`
	}
}

function placeholder (props) {
  	if (props.participant.role == 'gm') {
  		return "They've seen you..."
  	}

	if (props.participant.left_participant.role == 'gm') {
		return "You've seen them...'"
	}

	return "I've seen you..."
}

export default function BrinkForm(props) {
  const { register, handleSubmit, errors } = useForm();
  const onSubmit = data => makePatchRequest(`/api/participations/${props.participant.id}/`, props.participant.guid, data);


  return (
    <form onSubmit={handleSubmit(onSubmit)}>

      <em>{promptText(props)}</em>
      <textarea
      	className="form-control"
      	placeholder={placeholder(props)}
      	name="participation[written_brink]"
      	ref={register({required: true})} />

      <input className="btn btn-primary" type="submit" />
    </form>
  );
}
