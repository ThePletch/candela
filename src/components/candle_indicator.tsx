import _ from "lodash";
import { useEffect, useState } from "react";

function Candle(props: {
  lit: boolean;
  dicePool: boolean;
  x: number;
  y: number;
}) {
  const dark = "#222222";
  const orange = "#DDAA00";
  const yellow = "#FFEE00";
  const white = "#FFFFFF";
  const brightBlue = "#BBBBFF";
  const black = "#000000";

  function outerColor() {
    return props.lit ? orange : dark;
  }

  function outerRiseColor() {
    return props.lit ? outerColor() : black;
  }

  function innerColor() {
    return props.lit ? yellow : dark;
  }

  function coreColor() {
    return props.lit ? white : dark;
  }
  function subcoreColor() {
    if (props.lit) {
      return props.dicePool ? brightBlue : white;
    }

    return dark;
  }

  return (
    <svg>
      <circle
        key="outer-highest"
        cx={props.x}
        cy={props.y - 4}
        r="2"
        style={{ fill: outerRiseColor() }}
      />
      <circle
        key="outer-high"
        cx={props.x}
        cy={props.y - 1.5}
        r="4"
        style={{ fill: outerRiseColor() }}
      />
      <circle
        key="outer"
        cx={props.x}
        cy={props.y}
        r="5"
        style={{ fill: outerColor() }}
      />

      <circle
        key="inner-high"
        cx={props.x}
        cy={props.y - 2}
        r="2"
        style={{ fill: innerColor() }}
      />
      <circle
        key="inner"
        cx={props.x}
        cy={props.y + 0.5}
        r="3.5"
        style={{ fill: innerColor() }}
      />
      <circle
        key="core"
        cx={props.x}
        cy={props.y + 2}
        r="3"
        style={{ fill: coreColor() }}
      />
      <circle
        key="subcore"
        cx={props.x}
        cy={props.y + 3.5}
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
export default function CandleIndicator(props: {
  lit: number;
  dicePool: number;
}) {
  let candleUpdater: NodeJS.Timer;
  let dicePoolDelay: NodeJS.Timer;
  let dicePoolUpdater: NodeJS.Timer;

  let [lit, setLit] = useState(0);
  let [dicePool, setDicePool] = useState(props.dicePool);

  const candleDistance = 40;
  const candleLightDelayMs = 500;

  function setUpCandleUpdater() {
    clearInterval(candleUpdater);
    candleUpdater = setInterval(incrementCandleLitness, candleLightDelayMs);
  }

  function setUpDicePoolUpdater() {
    clearInterval(dicePoolDelay);
    clearInterval(dicePoolUpdater);
    dicePoolUpdater = setInterval(incrementDicePool, candleLightDelayMs);
  }

  useEffect(() => {
    setUpCandleUpdater();
    dicePoolDelay = setTimeout(setUpDicePoolUpdater, candleLightDelayMs / 2);

    return cleanup;
  }, []);

  useEffect(() => {
    if (lit != props.lit) {
      setUpCandleUpdater();
    }

    if (dicePool != props.dicePool) {
      setUpDicePoolUpdater();
    }

    return cleanup;
  }, [lit, dicePool]);

  function cleanup() {
    clearInterval(candleUpdater);
    clearInterval(dicePoolUpdater);
    clearInterval(dicePoolDelay);
  }

  function incrementCandleLitness() {
    if (lit > props.lit) {
      setLit(lit - 1);
    } else if (lit < props.lit) {
      setLit(lit + 1);
    } else if (lit == props.lit) {
      clearInterval(candleUpdater);
    }
  }

  function incrementDicePool() {
    if (dicePool > props.dicePool) {
      setDicePool(dicePool - 1);
    } else if (dicePool < props.dicePool) {
      setDicePool(dicePool + 1);
    } else if (dicePool == props.dicePool) {
      clearInterval(dicePoolUpdater);
    }
  }

  function candleAngleRadians(index: number): number {
    return index * ((Math.PI * 2) / 10) - Math.PI / 2;
  }

  function candleX(index: number): number {
    return candleDistance * Math.cos(candleAngleRadians(index)) + 45;
  }

  function candleY(index: number): number {
    return candleDistance * Math.sin(candleAngleRadians(index)) + 45;
  }

  function renderCandle(index: number) {
    return (
      <Candle
        key={index}
        x={candleX(index)}
        y={candleY(index)}
        lit={index < lit}
        dicePool={index < dicePool}
      />
    );
  }

  return (
    <svg
      preserveAspectRatio="xMidYMid meet"
      viewBox="0 0 90 90"
      className="candle-indicator"
    >
      {_.times(10, (index: number) => {
        return renderCandle(index);
      })}
    </svg>
  );
}
