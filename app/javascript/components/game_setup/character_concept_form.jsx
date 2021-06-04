import React from 'react';
import { useForm } from 'react-hook-form';

import { makePatchRequest } from 'util/requests';


export default function CharacterConceptForm(props) {
  const { register, handleSubmit, errors } = useForm();
  const onSubmit = data => makePatchRequest(`/api/participations/${props.participant.id}/`, props.participant.guid, data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <em>Describe your character concept in a sentence or three.</em>
      <div className="text-muted">
        This should include their name, general appearance, and overall personality.
      </div>
      <textarea className="form-control" name="participation[character_concept]" ref={register({required: true})} />

      <input className="btn btn-primary" type="submit" />
    </form>
  );
}
