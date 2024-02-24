import { ParticipationAttributeForm } from '@candela/components/game_setup/participation_attribute_form';

const information = (<>
  <em>Describe your character concept in a sentence or three.</em>
  <div>
    This should include their name, general appearance, and overall
    personality.
  </div>
</>);

export default ParticipationAttributeForm({
  fieldname: 'characterConcept',
  information,
});
