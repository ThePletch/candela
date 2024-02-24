import Toast from 'react-bootstrap/Toast';

import CharacterConceptForm from '@candela/components/game_setup/character_concept_form';
import PopupForm from '@candela/components/popup_form';
import ProceedButton from '@candela/components/game_setup/proceed_button';
import type { Participation } from '@candela/types/participation';
import type { GameProps } from '@candela/types/props';
import { GameParticipationsContext, MeContext } from '@candela/util/contexts';
import { useHttpState, useSubscriptionContexts } from '@candela/util/state';

function playerWithConceptUnfilled(participation: Participation) {
  return (
    participation.role === 'player' && participation.characterConcept == null
  );
}

function playersWithUnfilledConcept(participations: Participation[]) {
  return participations.filter(playerWithConceptUnfilled);
}

export default function CharacterConceptPrompt(props: GameProps) {
  const advanceToMoments = useHttpState(
    `api/games/${props.game.id}/advance_setup_state`,
    'PATCH',
    props.me.guid,
    { current_setup_state: 'character_concept' },
  );

  return useSubscriptionContexts(
    {
      participations: {
        loadingMessage: 'Loading players...',
        context: GameParticipationsContext(props.game.id),
      },
      me: {
        loadingMessage: 'Loading your information...',
        context: MeContext(props.me.guid),
      },
    },
    ({ participations, me }) => {
      const unfilledConceptPlayers = playersWithUnfilledConcept(participations);

      if (me.role === 'gm') {
        return (
          <>
            <Toast>
              <Toast.Body>
                The players will now write their character concepts. Be ready
                to answer their questions about the setting.
              </Toast.Body>
            </Toast>
            <ProceedButton
              label="Proceed to Moments"
              httpRequest={advanceToMoments}
              disabled={unfilledConceptPlayers.length > 0}
              disabledTooltip="Some players are still writing their character concept."
            />
          </>
        );
      }

      const label = me.characterConcept ? "Update your character concept" : "Write your character concept";

      return (
        <PopupForm
          label={label}
          formComplete={me.characterConcept !== null}
        >
          <CharacterConceptForm me={me} />
        </PopupForm>
      );
    },
  );
}
