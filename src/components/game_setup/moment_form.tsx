import { ParticipationAttributeForm } from '@candela/components/game_setup/participation_attribute_form';

const information = (<>
  <em>What would give your character a moment of hope?</em>
  <p>
    Your Moment should finish the sentence &quot;I will find hope...&quot;.
  </p>
  <p>
    Aim for something concrete and reasonable to achieve during the course
    of the story, and avoid being overly specific.
  </p>
  <p>
    Before rolling for a conflict, you can choose to live your moment by
    clicking the &quot;Live Moment&quot; button, if you can do the thing
    written on your card during that conflict. Succeeding on the roll gets
    you a Hope die, a die that you can use on any conflict you roll for.
    Unlike a regular die, a hope die isn&apos;t lost when you roll a 1, and
    counts as a success on a roll of 5 or 6 instead of just a 6.
  </p>
  <p>
    Failing to live your moment has no additional negative effects, but you
    will burn your moment and be unable to live it in the future.
  </p>
  <em>I will find hope...</em>
</>);

export default ParticipationAttributeForm({
  fieldname: 'moment',
  information,
  fieldPlaceholder: "...when [event]/...in [situation]",
});
