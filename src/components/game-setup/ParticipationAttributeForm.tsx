import type { ReactElement } from "react";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useForm } from "react-hook-form";

import type { SelfParticipation } from "@candela/types/participation";
import { useHttpState } from "@candela/util/state";
import {
  CamelToSnakeCase,
  camelToSnakeCase,
  type KeysToSnakeCase,
} from "@candela/util/strings";
import type { KeysWithValuesOfType } from "@candela/util/types";

type MeState = { me: SelfParticipation };
type ParticipationTextPropertyName = KeysWithValuesOfType<
  SelfParticipation,
  string | undefined
>;

type ParticipationAttributeFormProperties<
  FieldName extends ParticipationTextPropertyName,
  State = MeState,
> = {
  fieldname: FieldName;
  information: ReactElement | ((state: State) => ReactElement);
  fieldPlaceholder?:
    | SelfParticipation[FieldName]
    | ((state: State) => SelfParticipation[FieldName]);
};

type SnakeParticipation = KeysToSnakeCase<SelfParticipation>;
type NarrowedSnakeParticipation<
  FieldName extends ParticipationTextPropertyName,
> = Pick<SnakeParticipation, CamelToSnakeCase<FieldName>>;
type ParticipationFormProperties<
  FieldName extends ParticipationTextPropertyName,
> = {
  participation: NarrowedSnakeParticipation<FieldName>;
};

export default function ParticipationAttributeForm<
  FieldName extends ParticipationTextPropertyName,
  State extends MeState = MeState,
>(
  formInstanceProps: ParticipationAttributeFormProperties<FieldName, State>,
): (state: State) => ReactElement {
  return function InnerParticipationAttributeForm(state: State) {
    const databaseLevelPropName = camelToSnakeCase(
      formInstanceProps.fieldname,
    ) as keyof NarrowedSnakeParticipation<FieldName>;
    const { me } = state;
    const { register, handleSubmit } = useForm<
      ParticipationFormProperties<FieldName>
    >({
      defaultValues: {
        participation: {
          [databaseLevelPropName]: me[formInstanceProps.fieldname],
        } as ParticipationFormProperties<FieldName>["participation"],
      },
    });
    const { loading, makeRequest } = useHttpState(
      `api/participations/${me.id}`,
      "PATCH",
      me.guid,
    );

    const infoElement =
      formInstanceProps.information instanceof Function
        ? formInstanceProps.information(state)
        : formInstanceProps.information;
    const placeholder =
      formInstanceProps.fieldPlaceholder instanceof Function
        ? formInstanceProps.fieldPlaceholder(state)
        : formInstanceProps.fieldPlaceholder;
    return (
      <Form onSubmit={handleSubmit(makeRequest)}>
        {infoElement}
        <Form.Control
          as="textarea"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          {...register(`participation.${databaseLevelPropName}` as any, {
            required: true,
            value: me[
              formInstanceProps.fieldname
            ] as SelfParticipation[FieldName],
          })}
          placeholder={placeholder}
        />
        <Button variant="primary" disabled={loading} type="submit">
          {me[formInstanceProps.fieldname] ? "Update" : "Submit"}
        </Button>
      </Form>
    );
  };
}
