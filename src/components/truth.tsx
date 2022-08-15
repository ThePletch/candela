import type { Truth as TruthObject } from "@candela/types/truth";

export default function Truth(props: TruthObject) {
  return (
    <div>
      <span>{props.description}</span>
      <em> - {props.speaker.name}</em>
    </div>
  );
}
