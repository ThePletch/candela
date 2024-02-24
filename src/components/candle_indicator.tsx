import _ from 'lodash';
import { useEffect, useState } from 'react';

const candleDistance = 25;
const candleLightDelayMs = 500;

const dark = '#222222';
const ember = '#661100';
const orange = '#DDAA00';
const yellow = '#FFEE00';
const white = '#FFFFFF';
const brightBlue = '#BBBBFF';
const black = '#000000';

function candleAngleRadians(index: number): number {
  return index * ((Math.PI * 2) / 10) - Math.PI / 2;
}

function candleX(index: number): number {
  return candleDistance * Math.cos(candleAngleRadians(index)) + 45;
}

function candleY(index: number): number {
  return candleDistance * Math.sin(candleAngleRadians(index)) + 45;
}

function Candle({
  lit,
  dicePool,
  x,
  y,
}: {
  lit: boolean;
  dicePool: boolean;
  x: number;
  y: number;
}) {
  function outerColor() {
    return lit ? orange : dark;
  }

  function outerRiseColor() {
    return lit ? outerColor() : black;
  }

  function innerColor() {
    return lit ? yellow : dark;
  }

  function coreColor() {
    return lit ? white : dark;
  }
  function subcoreColor() {
    if (lit) {
      return dicePool ? brightBlue : white;
    }

    return ember;
  }

  return (
    <svg>
      <circle
        key="outer-highest"
        cx={x}
        cy={y - 4}
        r="2"
        style={{ fill: outerRiseColor() }}
      />
      <circle
        key="outer-high"
        cx={x}
        cy={y - 1.5}
        r="4"
        style={{ fill: outerRiseColor() }}
      />
      <circle key="outer" cx={x} cy={y} r="5" style={{ fill: outerColor() }} />

      <circle
        key="inner-high"
        cx={x}
        cy={y - 2}
        r="2"
        style={{ fill: innerColor() }}
      />
      <circle
        key="inner"
        cx={x}
        cy={y + 0.5}
        r="3.5"
        style={{ fill: innerColor() }}
      />
      <circle
        key="core"
        cx={x}
        cy={y + 2}
        r="3"
        style={{ fill: coreColor() }}
      />
      <circle
        key="subcore"
        cx={x}
        cy={y + 3.5}
        r="1.5"
        style={{ fill: subcoreColor() }}
      />
    </svg>
  );
}

/**
 * Renders a circle of candles.
 * Tracks props and state values separately, since we
 * light/extinguish candles one-by-one over time rather than immediately syncing
 * to the props value.
 */
export default function CandleIndicator({
  lit,
  dicePool,
}: {
  lit: number;
  dicePool: number;
}) {
  let candleUpdater: NodeJS.Timer;
  let dicePoolUpdater: NodeJS.Timer;

  const [litState, setLit] = useState(0);
  const [dicePoolState, setDicePool] = useState(0);

  function cleanup() {
    clearTimeout(candleUpdater);
    clearTimeout(dicePoolUpdater);
  }

  function incrementCandleLitness() {
    if (litState > lit) {
      setLit(litState - 1);
    } else if (litState < lit) {
      setLit(litState + 1);
    }
  }

  function incrementDicePool() {
    if (dicePoolState > dicePool) {
      setDicePool(dicePoolState - 1);
    } else if (dicePoolState < dicePool) {
      setDicePool(dicePoolState + 1);
    }
  }

  function setUpCandleUpdater() {
    clearTimeout(candleUpdater);
    candleUpdater = setTimeout(incrementCandleLitness, candleLightDelayMs);
  }

  function setUpDicePoolUpdater() {
    clearTimeout(dicePoolUpdater);
    dicePoolUpdater = setTimeout(incrementDicePool, candleLightDelayMs);
  }

  useEffect(() => {
    if (litState !== lit) {
      setUpCandleUpdater();
    }

    return cleanup;
  }, [litState, lit]);

  useEffect(() => {
    if (dicePoolState !== dicePool) {
      setUpDicePoolUpdater();
    }

    return cleanup;
  }, [dicePoolState, dicePool]);

  function renderCandle(index: number) {
    return (
      <Candle
        key={index}
        x={candleX(index)}
        y={candleY(index)}
        lit={index < litState}
        dicePool={index < dicePoolState}
      />
    );
  }

  return (
    <svg
      preserveAspectRatio="xMidYMid meet"
      viewBox="0 0 90 90"
      className="candle-indicator"
    >
      {_.times(10, (index) => renderCandle(index))}
    </svg>
  );
}
