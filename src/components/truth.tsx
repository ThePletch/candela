import type { Truth as TruthType } from "@candela/types/truth";

export default function Truth({ description, speaker }: TruthType) {
  return (
    <div>
      <span>{description}</span>
      <em> -{speaker.name}</em>
    </div>
  );
}
