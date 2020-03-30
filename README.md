# candela
A fully-virtual web app to play the tabletop RPG Ten Candles with friends remotely.

## Business Requirements
### Mandatory for initial release
* Allows games to be started by a GM at will and joined by players by clicking a link generated at game start.
* Game View:
  * Displays the ten candles on-screen. Their 'lit' or 'unlit' status should be synchronized in real time among players.
  * Remains synchronized when the page is refreshed.
  * Displays a simulated 'circle' of players (and the GM), so players know who they will be passing cards to during setup. 
  * Runs through each step of the setup phase, which the GM can start whenever all players have joined.
    * Todo elaborate on the specifics of each step
  * Allows the GM to call for a challenge, then mark that it was passed/failed.
  * Tracks the size of the dice pool during a round and between rounds.
  * Allows players to burn their traits, signaling to other players when this happens. Only when a trait is burned should it be displayed to other players.
    * Todo elaborate on the trait burning mechanic
  * Simulates the transition between rounds when a candle is extinguished, rotating around the table when stating truths.

### Follow-on tasks
* The natural burning out of candles is simulated as a normal distribution, with the mean being 4 hours and a hidden standard deviation.
* Allow users to record their 'goodbye' message through the application during setup.
* Aesthetic improvements, e.g. animations for candles, burning cards, etc.

### Intentionally not implementing:
* Dice rolling. A solved problem that would add clutter to the UI and waste dev time when it can just be done with an existing service.
