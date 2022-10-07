import type { Conflict } from '@candela/types/conflict';
import type { Game } from '@candela/types/game';
import type { Game as BrowseGame } from '@candela/types/browse/game';
import type { Resolution } from '@candela/types/resolution';
import type { Scene } from '@candela/types/scene';
import type { Truth } from '@candela/types/truth';
import type { Participation, SelfParticipation } from '@candela/types/participation';
import { createListContext, createSingletonContext, type ListContext } from '@candela/util/state';

export const MeContext = createSingletonContext<SelfParticipation>();

export const GamesContext = createListContext<BrowseGame>();
export const GameContext = createSingletonContext<Game>();
export const GameScenesContext = createListContext<Scene>();
export const GameParticipationsContext = createListContext<Participation>();

function IdBasedListContext<T>() {
  const IdBasedCache: Record<number, ListContext<T>> = {};

  return function (id: number): ListContext<T> {
    if (!IdBasedCache[id]) {
      IdBasedCache[id] = createListContext<T>();
    }

    return IdBasedCache[id];
  }
}

export const SceneConflictsContext = IdBasedListContext<Conflict>();
export const SceneTruthsContext = IdBasedListContext<Truth>();
export const ConflictResolutionsContext = IdBasedListContext<Resolution>();
