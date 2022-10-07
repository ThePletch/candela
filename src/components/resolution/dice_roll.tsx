import Badge from 'react-bootstrap/Badge';

type Roll = "1" | "2" | "3" | "4" | "5" | "6";

function getHopeDieColor(valueRolled: Roll) {
  switch (valueRolled) {
    case "5":
    case "6":
      return "info";
    case "1":
      return "warning";
    default:
      return "primary";
  }
}

function getRegularDieColor(valueRolled: Roll) {
  switch (valueRolled) {
    case "6":
      return "success";
    case "1":
      return "danger";
    default:
      return "secondary";
  }
}

type DieProps = {
  hopeDie: boolean;
  roll: Roll;
};

function Die(props: DieProps) {
  let color;
  if (props.hopeDie) {
    color = getHopeDieColor(props.roll);
  } else {
    color = getRegularDieColor(props.roll);
  }

  return <Badge bg={color}>{props.roll}</Badge>;
}

type DiceRollProps = {
  roller: string;
  roll: string;
  hopeDieCount: number;
};
export default function DiceRoll(props: DiceRollProps) {
  return (
    <div>
      {props.roll.split("").map((roll, i) => (
        <Die
          key={`${props.roller}-` + i}
          hopeDie={i < props.hopeDieCount}
          roll={roll as Roll}
        />
      ))}
    </div>
  );
}
