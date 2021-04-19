import React from 'react';
import { useForm } from 'react-hook-form';

import { makePatchRequest } from 'util/requests';


export default function MomentForm(props) {
  const { register, handleSubmit, errors } = useForm();
  const onSubmit = data => makePatchRequest(`/api/participations/${props.participant.id}/`, props.participant.guid, data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <em>What would give your character a moment of hope?</em>
      <textarea className="form-control" name="participation[moment]" placeholder="I will find hope..." ref={register({required: true})} />
      <input className="btn btn-primary" type="submit" />
    </form>
  );
}
