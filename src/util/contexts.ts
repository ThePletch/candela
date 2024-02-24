import { createContext, type Context } from 'react';

import type { Conflict } from '@candela/types/conflict';
import type { Game } from '@candela/types/game';
import type { Game as BrowseGame } from '@candela/types/browse/game';
import type { Resolution } from '@candela/types/resolution';
import type { Scene } from '@candela/types/scene';
import type { Truth } from '@candela/types/truth';
import type {
  Participation,
  SelfParticipation,
} from '@candela/types/participation';
import type { ListState, SingletonState } from '@candela/util/state';

export type ListContext<T> = Context<ListState<T>>;
export type SingletonContext<T> = Context<SingletonState<T>>;

export function createListContext<T>(): ListContext<T> {
  return createContext<ListState<T>>({
    record: [],
    loading: true,
  });
}

export function createSingletonContext<T>(): SingletonContext<T> {
  return createContext<SingletonState<T>>({
    record: null,
    loading: true,
  });
}

export const GuidContext = createSingletonContext<string>();
export const GamesContext = createListContext<BrowseGame>();

function IdBasedContext<T>(createContextThunk: () => Context<T>) {
  const IdBasedCache: Record<number | string, Context<T>> = {};

  return (id: number | string): Context<T> => {
    if (!IdBasedCache[id]) {
      IdBasedCache[id] = createContextThunk();
    }

    return IdBasedCache[id];
  };
}

function IdBasedListContext<T>() {
  return IdBasedContext<ListState<T>>(createListContext);
}

function IdBasedSingletonContext<T>() {
  return IdBasedContext<SingletonState<T>>(createSingletonContext);
}

export const MeContext = IdBasedSingletonContext<SelfParticipation>();
export const GameContext = IdBasedSingletonContext<Game>();
export const GameScenesContext = IdBasedListContext<Scene>();
export const GameParticipationsContext = IdBasedListContext<Participation>();

export const SceneConflictsContext = IdBasedListContext<Conflict>();
export const SceneTruthsContext = IdBasedListContext<Truth>();
export const ConflictResolutionsContext = IdBasedListContext<Resolution>();
