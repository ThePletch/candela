import React from 'react';
import { useForm } from 'react-hook-form';

import { makePatchRequest } from 'util/requests';


export default function MomentForm(props) {
  const { register, handleSubmit, errors } = useForm();
  const onSubmit = data => makePatchRequest(`/api/participations/${props.participant.id}/`, props.participant.guid, data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <em>What would give your character a moment of hope?</em>
      <div className="text-muted">
        Your Moment should finish the sentence "I will find hope...".
        Aim for something concrete and reasonable to achieve during the course of the story,
        and avoid being overly specific.
      </div>
      <div className="text-muted">
        Before rolling for a conflict, you can choose to live your moment if you can achieve the circumstances
        listed on your card during that conflict. Succeeding on the roll gets you a Hope die,
        a die that you can use on any conflict you roll for. Unlike a regular die, a hope die isn't lost
        when you roll a 1, and counts as a success on a roll of 5 or 6 instead of just a 6.
      </div>
      <textarea className="form-control" name="participation[moment]" placeholder="I will find hope..." ref={register({required: true})} />
      <input className="btn btn-primary" type="submit" />
    </form>
  );
}
