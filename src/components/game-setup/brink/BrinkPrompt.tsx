import PopupForm from "@candela/components/PopupForm";
import type { Participation } from "@candela/types/participation";
import type { GameProps } from "@candela/types/props";
import { GameParticipationsContext } from "@candela/util/contexts";
import { useHttpState, useSubscriptionContext } from "@candela/util/state";

import ProceedButton from "../ProceedButton";
import BrinkForm from "./BrinkForm";

function playerWithBrinkUnfilled(participation: Participation) {
  return !participation.hasWrittenBrink;
}

function playersWithUnfilledBrink(participations: Participation[]) {
  return participations.filter(playerWithBrinkUnfilled);
}

export default function BrinkPrompt({ game, me }: GameProps) {
  const advanceToCardOrder = useHttpState(
    `api/games/${game.id}/advance_setup_state`,
    "PATCH",
    me.guid,
    { current_setup_state: "brinks" },
  );

  return useSubscriptionContext(
    GameParticipationsContext(game.id),
    "Loading players...",
    (participations) => {
      const unfilledBrinkPlayers = playersWithUnfilledBrink(participations);
      const brinkForm = (
        <PopupForm
          label="Write your brink"
          formComplete={me.writtenBrink !== null}
        >
          <BrinkForm me={me} allParticipations={participations} />
        </PopupForm>
      );
      if (me.role === "gm") {
        return (
          <>
            <ProceedButton
              label="Proceed to Card Order"
              httpRequest={advanceToCardOrder}
              disabled={unfilledBrinkPlayers.length > 0}
              disabledTooltip="Some people are still writing their brinks."
            />
            {brinkForm}
          </>
        );
      }

      return brinkForm;
    },
  );
}
