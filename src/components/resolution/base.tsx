import { type ChangeEvent, type ReactNode, useState } from "react";

import type { Participation } from "types/participation";
import type { Resolution } from "types/resolution";
import { activeParticipation, getTopTrait } from "util/participations";
import { useHttpState, withModelListSubscription } from "util/state";

import DiceRoll from "./dice_roll";

export type ResolutionProps = {
  gameId: number;
  activeParticipation: Participation;
  resolution: Resolution;
};

function BurnTraitButton(props: ResolutionProps) {
  const topTrait = getTopTrait(props.activeParticipation);
  const { loading, makeRequest } = useHttpState(
    `/api/conflicts/${props.resolution.conflict.id}/resolutions/`,
    "POST",
    {
      type: "TraitResolution",
      resolution_id: props.resolution.id,
      burned_trait_type: topTrait?.type,
    }
  );

  if (!topTrait) {
    return null;
  }

  function canBurnTrait(topTrait: Participation["traits"][number]) {
    return (
      ["virtue", "vice"].includes(topTrait.type ?? "no") &&
      props.resolution.playerRollResult.includes("1")
    );
  }

  if (canBurnTrait(topTrait)) {
    if (props.resolution.parentResolution) {
      return (
        <button className="btn btn-primary" disabled>
          You cannot burn your {topTrait.type}. This result is final.
        </button>
      );
    }
    return (
      <button
        className="btn btn-primary"
        disabled={loading}
        onClick={() => makeRequest()}
      >
        Burn your {topTrait.type} ({topTrait.value}) to reroll ones.
      </button>
    );
  }

  return null;
}

function EmbraceBrinkButton(props: ResolutionProps) {
  const { loading, makeRequest } = useHttpState(
    `/api/conflicts/${props.resolution.conflict.id}/resolutions/`,
    "POST",
    {
      type: "BrinkResolution",
      resolution_id: props.resolution.id,
    }
  );

  const topTrait = getTopTrait(props.activeParticipation);

  if (!topTrait) {
    return null;
  }

  function canEmbraceBrink(topTrait: Participation["traits"][number]) {
    return (
      topTrait.type === "brink" &&
      (props.resolution.successful ||
        props.resolution.narrativeControl.id !== props.activeParticipation.id)
    );
  }

  if (canEmbraceBrink(topTrait)) {
    if (props.resolution.parentResolution != null) {
      return (
        <button className="btn btn-primary" disabled>
          You cannot embrace your brink. This result is final.
        </button>
      );
    } else {
      return (
        <button
          className="btn btn-primary"
          disabled={loading}
          onClick={() => makeRequest()}
        >
          Embrace your brink ({topTrait.value})
        </button>
      );
    }
  } else {
    return null;
  }
}

function ConfirmResultButton(props: ResolutionProps) {
  const [beneficiary, setBeneficiary] = useState<string | null>(null);
  const { loading, makeRequest } = useHttpState(
    `/api/resolutions/${props.resolution.id}/confirm`,
    "PATCH"
  );

  function confirm() {
    let body = {} as {
      beneficiary_player_id?: string;
    };

    if (beneficiary) {
      body.beneficiary_player_id = beneficiary;
    }

    makeRequest(body);
  }

  function changeBeneficiary(event: ChangeEvent<HTMLSelectElement>) {
    setBeneficiary(event.target?.value);
  }

  function playerWillDie() {
    return !props.resolution.successful && props.resolution.conflict.dire;
  }

  return withModelListSubscription(
    "ParticipationsChannel",
    { game_id: props.gameId },
    (participations: Participation[]) => {
      const resolver = activeParticipation(
        participations,
        props.resolution.participationId
      );
      if (
        playerWillDie() &&
        resolver.hopeDieCount > 0 &&
        props.resolution.type == "MartyrResolution"
      ) {
        function isValidRecipient(participation: Participation) {
          return participation.id != resolver.id && participation.role !== "gm";
        }

        return (
          <div>
            <select
              disabled={participations.length === 0}
              onChange={changeBeneficiary}
            >
              <option disabled={participations.length > 0}>
                {participations.length === 0
                  ? "Loading hope die recipients..."
                  : "Choose who will receive your hope die."}
              </option>
              <option key="0" value={undefined}>
                No one
              </option>
              {participations.filter(isValidRecipient).map((participation) => (
                <option key={participation.id} value={participation.id}>
                  {participation.name}
                </option>
              ))}
            </select>
            <button
              className="btn btn-primary"
              onClick={confirm}
              disabled={loading || beneficiary == null}
            >
              Confirm Result
            </button>
          </div>
        );
      } else {
        return (
          <button
            className="btn btn-primary"
            disabled={loading}
            onClick={confirm}
          >
            Confirm Result
          </button>
        );
      }
    }
  );
}

function ResolutionAcceptanceOptions(props: ResolutionProps) {
  const { loading: martyrLoading, makeRequest: martyr } = useHttpState(
    `/api/conflicts/${props.resolution.conflict.id}/resolutions/`,
    "POST",
    {
      type: "MartyrResolution",
      resolution_id: props.resolution.id,
    }
  );

  if (props.activeParticipation.id === props.resolution.resolver.id) {
    return (
      <div>
        <ConfirmResultButton {...props} />
        <BurnTraitButton {...props} />
        <EmbraceBrinkButton {...props} />
      </div>
    );
  } else if (
    props.resolution.conflict.dire &&
    !props.resolution.successful &&
    !props.resolution.parentResolution
  ) {
    return (
      <div>
        <button
          className="btn btn-primary"
          disabled={martyrLoading}
          onClick={() => martyr()}
        >
          Martyr yourself to save {props.resolution.resolver.name}
        </button>
      </div>
    );
  }

  return (
    <em>Waiting for {props.resolution.resolver} to resolve this conflict.</em>
  );
}

export function PlayerRollResult(props: { resolution: Resolution }) {
  return (
    <div>
      <DiceRoll
        roller="player"
        roll={props.resolution.playerRollResult}
        hopeDieCount={props.resolution.resolver.hopeDieCount}
      />
    </div>
  );
}

export function GmRollResult(props: { resolution: Resolution }) {
  return (
    <div>
      <DiceRoll
        roller="gm"
        roll={props.resolution.gmRollResult}
        hopeDieCount={0}
      />
    </div>
  );
}

type Components<T extends string> = {
  [K in T]: ReactNode;
};

type ConflictResultComponents = Components<
  | "activePlayerInfo"
  | "playerResult"
  | "gmResult"
  | "successMessage"
  | "additionalInfo"
  | "narrativeControlInfo"
  | "acceptanceOptions"
>;

export function ConflictResult(props: ConflictResultComponents) {
  return (
    <div>
      <h3>Conflict results</h3>
      <ul className="list-group">
        <li className="list-group-item">{props.activePlayerInfo}</li>
        <li className="list-group-item">
          <h5>PLAYER</h5>
          {props.playerResult}
        </li>
        <li className="list-group-item">
          <h5>GM</h5>
          {props.gmResult}
        </li>
        <li className="list-group-item">{props.successMessage}</li>
        <li className="list-group-item">{props.additionalInfo}</li>
        <li className="list-group-item">{props.narrativeControlInfo}</li>
      </ul>
      {props.acceptanceOptions}
    </div>
  );
}

// todo better indicate when someone martyrs themselves
export function BaseResolutionComponents(
  props: ResolutionProps
): ConflictResultComponents {
  function activePlayerInfo() {
    return (
      <span>{props.resolution.resolver} chose to face this conflict.</span>
    );
  }

  function successMessage() {
    return (
      <span>
        {props.resolution.resolver +
          " " +
          (props.resolution.successful ? "succeeded." : "failed.")}
      </span>
    );
  }

  function narrativeControlInfo() {
    return (
      <span>
        Narrative control will go to {props.resolution.narrativeControl.name}.
      </span>
    );
  }

  return {
    activePlayerInfo: activePlayerInfo(),
    playerResult: <PlayerRollResult resolution={props.resolution} />,
    gmResult: <GmRollResult resolution={props.resolution} />,
    additionalInfo: null,
    successMessage: successMessage(),
    narrativeControlInfo: narrativeControlInfo(),
    acceptanceOptions: <ResolutionAcceptanceOptions {...props} />,
  };
}
