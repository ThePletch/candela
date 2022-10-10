type BaseScene = {
  id: number;
  truthsRemaining: number;
  basePlayerDicePool: number;
};

type NonTransitioningScene = BaseScene & {
  state: 'truths_stated';
  nextTruthStater: null;
};

type SceneInTransition = BaseScene & {
  state: 'transitioning';
  nextTruthStater: {
    id: number;
    name: string;
  };
};

export type Scene = NonTransitioningScene | SceneInTransition;
