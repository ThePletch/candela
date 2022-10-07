import ListGroup from 'react-bootstrap/ListGroup';

import type {
  Participation,
  TraitType,
} from "@candela/types/participation";

type TraitCardProps = {
  burned: boolean;
  giverRole: Participation["role"];
  holderRole: Participation["role"];
  isTop: boolean;
  type: TraitType;
  value: string;
};

export default function TraitCard(props: TraitCardProps) {
  function pretext(): string {
    switch (props.type) {
      case "brink":
        if (props.giverRole == 'gm') {
            return "They've seen you...";
        }

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

  return (
    <ListGroup.Item key={props.type} active={props.isTop}>
      <h6>{props.type}</h6>
      <div>
        <em>{pretext()}</em>
      </div>
      <span>{props.value}</span>
    </ListGroup.Item>
  );
}
