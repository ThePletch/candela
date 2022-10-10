import CharacterConceptForm from '@candela/components/game_setup/character_concept_form';
import PopupForm from '@candela/components/popup_form';
import ProceedButton from '@candela/components/game_setup/proceed_button';
import type { Participation } from '@candela/types/participation';
import type { GameProps } from '@candela/types/props';
import { GameParticipationsContext, MeContext } from '@candela/util/contexts';
import { useHttpState, useSubscriptionContexts } from '@candela/util/state';

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
      function playersWithUnfilledConcept(participations: Participation[]) {
        return participations.filter(playerWithConceptUnfilled);
      }

      function playerWithConceptUnfilled(participation: Participation) {
        return (
          participation.role === 'player'
          && participation.characterConcept == null
        );
      }

      const unfilledConceptPlayers = playersWithUnfilledConcept(participations);

      if (me.role === 'gm') {
        return (
          <ProceedButton
            label="Proceed to Moments"
            httpRequest={advanceToMoments}
            disabled={unfilledConceptPlayers.length > 0}
            disabledTooltip="Some players are still writing their character concept."
          />
        );
      }

      return (
        <PopupForm
          label="Write your character concept"
          formComplete={me.characterConcept !== null}
        >
          <CharacterConceptForm me={me} />
        </PopupForm>
      );
    },
  );
}