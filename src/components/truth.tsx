import type { Truth as TruthObject } from '@candela/types/truth';

export default function Truth({ description, speaker }: TruthObject) {
  return (
    <div>
      <span>{description}</span>
      <em>
        {' '}
        -
        {speaker.name}
      </em>
    </div>
  );
}
