import type { ReactElement } from 'react';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';

import type { SelfParticipation } from '@candela/types/participation';
import { useHttpState } from '@candela/util/state';
import { camelToSnakeCase, type KeysToSnakeCase } from '@candela/util/strings';
import type { KeysWithValuesOfType } from '@candela/util/types';

type MeState = { me: SelfParticipation };

type ParticipationAttributeFormProperties<FieldName extends KeysWithValuesOfType<SelfParticipation, string>, State = MeState> = {
  fieldname: FieldName;
  information: ReactElement | ((state: State) => ReactElement);
  fieldPlaceholder?: string | ((state: State) => string);
};

type ParticipationFormProperties = { participation: KeysToSnakeCase<SelfParticipation> };

export function ParticipationAttributeForm<
  FieldName extends keyof SelfParticipation,
  State extends MeState = MeState
>(
  props: ParticipationAttributeFormProperties<FieldName, State>,
): (state: State) => ReactElement {
  const databaseLevelPropName = camelToSnakeCase(props.fieldname);

  return (state: State) => {
    const me = state.me;
    const { register, handleSubmit } = useForm<ParticipationFormProperties>({
      defaultValues: {
        participation: {
          [databaseLevelPropName]: me[props.fieldname],
        },
      },
    });
    const { loading, makeRequest } = useHttpState(
      `api/participations/${me.id}`,
      'PATCH',
      me.guid,
    );

    const infoElement = props.information instanceof Function ? props.information(state) : props.information;
    const placeholder = props.fieldPlaceholder instanceof Function ? props.fieldPlaceholder(state) : props.fieldPlaceholder;
    return (
      <Form onSubmit={handleSubmit(makeRequest)}>
        {infoElement}
        <Form.Control
          as="textarea"
          {...register(`participation.${databaseLevelPropName}`, { required: true, value: (me[props.fieldname] as any) })}
          placeholder={placeholder}
        />
        <Button variant="primary" disabled={loading} type="submit">
          {me[props.fieldname] ? "Update" : "Submit"}
        </Button>
      </Form>
    );
  };
}
