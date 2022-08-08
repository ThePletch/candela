type BaseScene = {
  id: number;
  truthsRemaining: number;
  basePlayerDicePool: number;
  failed: boolean;
};

type NonTransitioningScene = BaseScene & {
  state: "truths_stated";
  nextTruthStater: undefined;
};

type SceneInTransition = BaseScene & {
  state: "transitioning";
  nextTruthStater: {
    id: number;
    name: string;
  };
};

export type Scene = NonTransitioningScene | SceneInTransition;
