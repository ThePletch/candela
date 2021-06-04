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
    return "You've seen them..."
  }

  return "I've seen you..."
}

export default function BrinkForm(props) {
  const { register, handleSubmit, errors } = useForm();
  const onSubmit = data => makePatchRequest(`/api/participations/${props.participant.id}/`, props.participant.guid, data);


  return (
    <form onSubmit={handleSubmit(onSubmit)}>

      <em>{promptText(props)}</em>
      <div className="text-muted">
        A Brink should finish the below sentence, and should represent something secret and dangerous
        that calls the character's human dignity into question. If you're writing a brink for the GM,
        you get to decide something about Them. The only rule is that you cannot give Them
        a weakness.

        You can embrace your brink to reroll your entire dice pool, but acting according to your brink reveals
        it to the entire group, and can create a host of problems of its own.

        Your character will always know about the brink of the character you're writing for, including if it's Them.
      </div>
      <div className="text-muted">{placeholder(props)}</div>
      <textarea
        className="form-control"
        placeholder="...doing something unspeakable."
        name="participation[written_brink]"
        ref={register({required: true})} />

      <input className="btn btn-primary" type="submit" />
    </form>
  );
}
