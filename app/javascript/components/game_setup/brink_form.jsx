import React from 'react';
import { useForm } from 'react-hook-form';

import { makePatchRequest } from 'util/requests';


export default function BrinkForm(props) {
  const { register, handleSubmit, errors } = useForm();
  const onSubmit = data => makePatchRequest(`/api/participations/${props.participant.id}/`, data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <textarea name="participation[written_brink]" ref={register({required: true})} />

      <input type="submit" />
    </form>
  );
}
