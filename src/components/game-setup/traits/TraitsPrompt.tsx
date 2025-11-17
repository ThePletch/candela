import PopupForm from "@candela/components/PopupForm";
import type { Participation } from "@candela/types/participation";
import type { GameProps } from "@candela/types/props";
import { GameParticipationsContext, MeContext } from "@candela/util/contexts";
import { useHttpState, useSubscriptionContexts } from "@candela/util/state";
import ProceedButton from "../ProceedButton";
import TraitsForm from "./TraitsForm";

function playerWithTraitsUnfilled(participation: Participation) {
  return (
    participation.role === "player" &&
    !(participation.hasWrittenVirtue && participation.hasWrittenVice)
  );
}

function playersWithUnfilledTraits(participations: Participation[]) {
  return participations.filter(playerWithTraitsUnfilled);
}

export default function TraitsPrompt(props: GameProps) {
  const advanceToTraits = useHttpState(
    `api/games/${props.game.id}/advance_setup_state`,
    "PATCH",
    props.me.guid,
    {
      current_setup_state: "traits",
    },
  );

  return useSubscriptionContexts(
    {
      me: {
        loadingMessage: "Loading your information...",
        context: MeContext(props.me.guid),
      },
      participations: {
        loadingMessage: "Loading players...",
        context: GameParticipationsContext(props.game.id),
      },
    },
    ({ me, participations }) => {
      const unfilledTraitPlayers = playersWithUnfilledTraits(participations);
      if (me.role === "gm") {
        return (
          <ProceedButton
            label="Proceed to Scenario"
            httpRequest={advanceToTraits}
            disabled={unfilledTraitPlayers.length > 0}
            disabledTooltip="Some players are still writing their traits."
          />
        );
      }
      return (
        <PopupForm
          label="Fill in traits"
          formComplete={me.hasWrittenVice && me.hasWrittenVirtue}
        >
          <TraitsForm me={me} allParticipations={participations} />
        </PopupForm>
      );
    },
  );
}
