import React from 'react';
import { useForm } from 'react-hook-form';

import { makePatchRequest } from 'util/requests';

export default function TraitsForm(props) {
  const { register, handleSubmit, errors } = useForm();
  const onSubmit = data => {
    makePatchRequest(`/api/participations/${props.participant.id}/`, props.participant.guid, data)
  };
  const virtueText = `Virtue for ${props.participant.right_player.name}`
  const viceText = `Vice for ${props.participant.left_player.name}`

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <em>
          What virtues and vices do your companions have?
        </em>
      </div>
      <div>
        <ul>
          <li>
            A virtue is a single word describing a positive trait a character possesses.
            It should solve more problems than it creates.
          </li>
          <li>
            A vice is a single word describing a weakness or flaw a character possesses.
            It should create more problems than it solves.
          </li>
        </ul>
        <span>
          You can burn your virtue or vice to reroll all the ones rolled in a conflict,
          but only by acting in accordance with the trait.
        </span>
      </div>

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

      <input type="submit" className="btn btn-secondary btn-block" />
    </div>
    </form>
  );
}
