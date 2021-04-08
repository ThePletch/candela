import React from 'react';
import { useForm } from 'react-hook-form';

import { makePatchRequest } from 'util/requests';


export default function TraitsForm(props) {
  const { register, handleSubmit, errors } = useForm();
  const onSubmit = data => makePatchRequest(`/api/participations/${props.participant.id}/`, data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="text" placeholder="Virtue for player on your left" name="participation[written_virtue]" ref={register({required: true})} />
      <input type="text" placeholder="Vice for player on your right" name="participation[written_vice]" ref={register({required: true})} />

      <input type="submit" />
    </form>
  );
}
