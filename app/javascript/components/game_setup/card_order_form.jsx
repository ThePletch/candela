import React from 'react';
import { useForm } from 'react-hook-form';

import { makePatchRequest } from 'util/requests';


export default function CardOrderForm(props) {
  const { register, handleSubmit, errors } = useForm();
  const onSubmit = data => makePatchRequest(`/api/participations/${props.participant.id}/`, data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <textarea name="participation[card_order]" ref={register({required: true})} />

      <input type="submit" />
    </form>
  );
}
