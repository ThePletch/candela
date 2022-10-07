import classNames from "classnames";
import _ from "lodash";
import { useState } from "react";
import type {
  Participation as ParticipationType,
  TraitType,
} from "@candela/types/participation";

type ParticipationProps = {
  participation: ParticipationType;
  isActiveParticipation: boolean;
};

function Bio(props: Pick<ParticipationType, "role" | "characterConcept">) {
  if (props.role === "player") {
    return <p className="character-concept">{props.characterConcept}</p>;
  } else {
    return null;
  }
}

function AliveFooter(props: Pick<ParticipationType, "role" | "alive">) {
  if (props.role == "player") {
    return (
      <div
        className={`alive-footer card-footer ${
          props.alive ? "bg-success" : "bg-secondary"
        }`}
      >
        <small>{props.alive ? "Fighting for survival." : "Passed on."}</small>
      </div>
    );
  } else {
    return null;
  }
}

type TraitCardProps = {
  burned: boolean;
  holderRole: ParticipationType["role"];
  isTop: boolean;
  type: TraitType;
  value: string;
};

function TraitCard(props: TraitCardProps) {
  function pretext(): string {
    switch (props.type) {
      case "brink":
        // if (props.giverRole == 'gm') {
        //     return "They've seen you...";
        // }

        if (props.holderRole == "gm") {
          return "I've seen Them...";
        }

        return "I've seen you...";
      case "virtue":
        return "";
      case "vice":
        return "";
      case "moment":
        return "I will find hope...";
    }
  }

  const classes = classNames({
    "trait-card": true,
    burned: props.burned,
    "active-trait": props.isTop,
    "inactive-trait": !props.isTop,
  });

  return (
    <li key={props.type} className={classes}>
      <h6 className="trait-type">{props.type}</h6>
      <div className="trait-pretext">
        <em>{pretext()}</em>
      </div>
      <span className="trait-value">{props.value}</span>
    </li>
  );
}

function TraitCardList(props: ParticipationProps) {
  return (
    <ul className="trait-list">
      {props.participation.traits.map((trait, i) => (
        <TraitCard
          key={i}
          burned={trait.burned}
          holderRole={props.participation.role}
          isTop={i === 0}
          type={trait.type}
          value={trait.value}
        />
      ))}
    </ul>
  );
}

function HopeDieIndicator(props: ParticipationProps) {
  if (
    props.participation.role == "player" &&
    props.participation.hopeDieCount > 0
  ) {
    return (
      <div className="hope-dice-indicator">
        <span className="hope-dice-pretext">Found hope.</span>
        {_.times(props.participation.hopeDieCount, (n) => {
          return (
            <span
              key={`hope-${props.participation.id}-${n}`}
              className="hope-die-badge"
            >
              &nbsp;
            </span>
          );
        })}
      </div>
    );
  }

  return null;
}

export default function Participation(props: ParticipationProps) {
  const [collapsed, setCollapsed] = useState(true);

  function toggleCollapsed() {
    setCollapsed(!collapsed);
  }

  const participationClasses = classNames({
    participation: true,
    active: props.isActiveParticipation,
    inactive: !props.isActiveParticipation,
    collapsed,
    [props.participation.role]: true,
  });

  return (
    <div className={participationClasses}>
      <div className="participation-info" onClick={toggleCollapsed}>
        <div className="participation-main-block">
          <h4 className="participation-name">{props.participation.name}</h4>
          <h6 className="participation-type">
            <div className="participation-role">{props.participation.role}</div>
            {props.isActiveParticipation && (
              <div>
                <small className="is-character">Your character</small>
              </div>
            )}
          </h6>
        </div>
        <Bio {...props.participation} />
        <TraitCardList {...props} />
        <HopeDieIndicator {...props} />
        <div className="expand-prompt">Click to expand</div>
      </div>
      <AliveFooter {...props.participation} />
    </div>
  );
}
