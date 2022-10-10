import Badge from 'react-bootstrap/Badge';

type Roll = '1' | '2' | '3' | '4' | '5' | '6';

function getHopeDieColor(valueRolled: Roll) {
  switch (valueRolled) {
    case '5':
    case '6':
      return 'info';
    case '1':
      return 'warning';
    default:
      return 'primary';
  }
}

function getRegularDieColor(valueRolled: Roll) {
  switch (valueRolled) {
    case '6':
      return 'success';
    case '1':
      return 'danger';
    default:
      return 'secondary';
  }
}

type DieProps = {
  hopeDie: boolean;
  roll: Roll;
};

function Die({ hopeDie, roll }: DieProps) {
  const color = hopeDie ? getHopeDieColor(roll) : getRegularDieColor(roll);

  return <Badge bg={color}>{roll}</Badge>;
}

type DiceRollProps = {
  roller: string;
  roll: string;
  hopeDieCount: number;
};
export default function DiceRoll({
  roller,
  roll,
  hopeDieCount,
}: DiceRollProps) {
  return (
    <div>
      {roll.split('').map((rollResult, i) => (
        <Die
          // eslint-disable-next-line react/no-array-index-key
          key={`${roller}-${i}`}
          hopeDie={i < hopeDieCount}
          roll={rollResult as Roll}
        />
      ))}
    </div>
  );
}
