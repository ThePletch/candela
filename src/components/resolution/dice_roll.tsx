type Roll = "1" | "2" | "3" | "4" | "5" | "6";

function getHopeDieColor(valueRolled: Roll) {
  switch (valueRolled) {
    case "5":
    case "6":
      return "badge-info";
    case "1":
      return "badge-warning";
    default:
      return "badge-primary";
  }
}

function getRegularDieColor(valueRolled: Roll) {
  switch (valueRolled) {
    case "6":
      return "badge-success";
    case "1":
      return "badge-danger";
    default:
      return "badge-secondary";
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

  return <span className={`badge ${color}`}>{props.roll}</span>;
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
