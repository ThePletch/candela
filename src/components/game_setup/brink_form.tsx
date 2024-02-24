import { ParticipationAttributeForm } from '@candela/components/game_setup/participation_attribute_form';
import { getLeftParticipation } from '@candela/state-helpers/participations';
import type {
  Participation,
  SelfParticipation,
} from '@candela/types/participation';

type FormProps = {
  me: SelfParticipation;
  allParticipations: Participation[];
};

function promptText(
  participation: Participation,
  leftParticipation: Participation,
) {
  if (participation.role === 'gm') {
    return `${leftParticipation.name} has been seen by Them. What dark secret do They know?`;
  }
  if (leftParticipation.role === 'gm') {
    return 'You have uncovered something about the nature of Them. What have you found?';
  }

  return `You have seen ${leftParticipation.name} at their lowest point. What are they hiding?`;
}

function placeholder(
  me: Participation,
  leftParticipation: Participation,
) {
  if (me.role === 'gm') {
    return "They've seen you...";
  }

  if (leftParticipation.role === 'gm') {
    return "You've seen Them...";
  }

  return "I've seen you...";
}

const playersBrinkInfo = (<>
  <p>
    Your brink is a risk; a way that your character could break at their
    lowest point and put the party in danger.
  </p>
  <p>
    Unlike your other cards, after you receive it, you should keep your
    own brink a secret from the party until it is used.
  </p>
  <p>
    You can embrace your brink to reroll your entire dice pool, but acting
    according to your brink reveals it to the entire group, and can create
    a host of problems of its own.
  </p>
</>);

const gmPassingToPlayerBrinkInfo = (<>
  <p>
    A Brink should represent something secret and dangerous that calls the
    character&apos;s humanity, stability, or reliability into question.
  </p>
</>);

const playerPassingToGmInfo = (<>
  <p>
    You're writing a brink for the GM, which means you get to know a secret
    about Them, the dark presence hunting you and your friends. This secret
    can be anything you want, but <strong>you cannot give Them a weakness.</strong>
  </p>
</>);

const playerPassingToPlayerInfo = (<>
  {gmPassingToPlayerBrinkInfo}
  <p>
    Your character will begin the game knowing about the brink of the
    character you&apos;re passing this brink to. It&apos;s up to you how your
    character came upon this knowledge, and whether your character shares it
    or keeps it to themselves.
  </p>
</>);

const gmBrinkInfo = (<>
  <p>
    The dark force stalking the party, Them, will know about the brink
    of the character you're passing this brink to. It's up to you how or when They use
    this information.
  </p>
</>);

function information({
  me,
  allParticipations,
}: FormProps) {
  const leftParticipation = getLeftParticipation(
    me,
    allParticipations,
    { skipGm: false },
  );
  const passingInfo = leftParticipation.role === 'gm'
    ? playerPassingToGmInfo
    : me.role === 'gm'
      ? gmPassingToPlayerBrinkInfo
      : playerPassingToPlayerInfo;
  return (<>
    <em>{promptText(me, leftParticipation)}</em>
    <div>
      {me.role === 'gm' ? gmBrinkInfo : playersBrinkInfo}
      {passingInfo}
    </div>
    <em className="text-muted">
      {placeholder(me, leftParticipation)}
    </em>
  </>);
}

export default ParticipationAttributeForm({
  fieldname: 'writtenBrink',
  information,
  fieldPlaceholder: "...doing something unspeakable.",
});
