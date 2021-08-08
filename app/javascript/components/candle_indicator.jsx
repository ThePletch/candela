import React from 'react'
import PropTypes from 'prop-types'

class Candle extends React.Component {
    static propTypes = {
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        lit: PropTypes.bool.isRequired,
    }

    dark = "#222222";
    orange = "#DDAA00";
    yellow = "#FFEE00";
    white = "#FFFFFF";
    brightBlue = "#BBBBFF";
    black = "#000000";

    outerColor() {
        return this.props.lit ? this.orange : this.dark;
    }

    outerRiseColor() {
        return this.props.lit ? this.outerColor() : this.black;
    }

    innerColor() {
        return this.props.lit ? this.yellow : this.dark;
    }

    coreColor() {
        return this.props.lit ? this.white : this.dark;
    }
    subcoreColor() {
        if (this.props.lit) {
            return this.props.dicePool ? this.brightBlue : this.white
        }

        return this.dark;
    }
    render() {
        return (
            <svg>
                <circle
                    key="outer-highest"
                    cx={this.props.x}
                    cy={this.props.y - 4}
                    r="2"
                    style={{fill: this.outerRiseColor()}}
                />
                <circle
                    key="outer-high"
                    cx={this.props.x}
                    cy={this.props.y - 1.5}
                    r="4"
                    style={{fill: this.outerRiseColor()}}
                />
                <circle
                    key="outer"
                    cx={this.props.x}
                    cy={this.props.y}
                    r="5"
                    style={{fill: this.outerColor()}}
                />

                <circle
                    key="inner-high"
                    cx={this.props.x}
                    cy={this.props.y - 2}
                    r="2"
                    style={{fill: this.innerColor()}}
                />
                <circle
                    key="inner"
                    cx={this.props.x}
                    cy={this.props.y + 0.5}
                    r="3.5"
                    style={{fill: this.innerColor()}}
                />
                <circle
                    key="core"
                    cx={this.props.x}
                    cy={this.props.y + 2}
                    r="3"
                    style={{fill: this.coreColor()}}
                />
                <circle
                    key="subcore"
                    cx={this.props.x}
                    cy={this.props.y + 3.5}
                    r="1.5"
                    style={{fill: this.subcoreColor()}}
                />
            </svg>
        );
    }
}

export default class CandleIndicator extends React.Component {
    static propTypes = {
        lit: PropTypes.number.isRequired,
    }

    constructor(props) {
        super(props);
        this.state = {
            lit: 0,
            dicePool: 0
        };
    }

    candleDistance = 40;
    candleLightDelayMs = 500;

    setUpCandleUpdater() {
      clearInterval(this.candleUpdater);
    this.candleUpdater = setInterval(this.incrementCandleLitness.bind(this), this.candleLightDelayMs);
    }

    setUpDicePoolUpdater() {
      clearInterval(this.dicePoolDelay);
      clearInterval(this.dicePoolUpdater);
      this.dicePoolUpdater = setInterval(this.incrementDicePool.bind(this), this.candleLightDelayMs);
    }

    componentDidMount() {
      this.setUpCandleUpdater();
      this.dicePoolDelay = setTimeout(this.setUpDicePoolUpdater.bind(this), this.candleLightDelayMs / 2);
    }

    componentDidUpdate(prevProps) {
      if (prevProps.lit != this.props.lit) {
        this.setUpCandleUpdater();
      }

      if (prevProps.dicePool != this.props.dicePool) {
        this.setUpDicePoolUpdater();
      }
    }

    componentWillUnmount() {
      clearInterval(this.candleUpdater);
      clearInterval(this.dicePoolUpdater);
      clearInterval(this.dicePoolDelay);
    }

    incrementCandleLitness() {
      if (this.state.lit > this.props.lit) {
        this.setState({
          lit: this.state.lit - 1,
        })
      } else if (this.state.lit < this.props.lit) {
        this.setState({
          lit: this.state.lit + 1,
        })
      } else if (this.state.lit == this.props.lit) {
        clearInterval(this.candleUpdater);
      }
    }

    incrementDicePool() {
      if (this.state.dicePool > this.props.dicePool) {
        this.setState({
          dicePool: this.state.dicePool - 1,
        })
      } else if (this.state.dicePool < this.props.dicePool) {
        this.setState({
          dicePool: this.state.dicePool + 1,
        })
      } else if (this.state.dicePool == this.props.dicePool) {
        clearInterval(this.dicePoolUpdater);
      }
    }

    candleAngleRadians(index) {
        return index * (Math.PI * 2 / 10) - (Math.PI / 2);
    }

    candleX(index) {
        return this.candleDistance * Math.cos(this.candleAngleRadians(index)) + 45;
    }

    candleY(index) {
        return this.candleDistance * Math.sin(this.candleAngleRadians(index)) + 45;
    }

    renderCandle(n) {
        return (<Candle
            key={n}
            x={this.candleX(n)}
            y={this.candleY(n)}
            lit={n < this.state.lit}
            dicePool={n < this.state.dicePool}
        />);
    }

    render() {
        return (
            <svg preserveAspectRatio="xMidYMid meet" viewBox="0 0 90 90" className="candle-indicator">
                {_.times(10, n => { return this.renderCandle(n) })}
            </svg>
        );
    }
}
