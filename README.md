# candela
A fully-virtual web app to play the tabletop RPG Ten Candles with friends remotely.

## Technical Requirements
* This application will have a backend in Ruby on Rails
* The frontend will be in React.js using the Redux framework
* The data model will be as follows:
  * Games - Represents a full, end-to-end game of Ten Candles.
    * has_many Scene
    * has_many Player
  * Scene - Represents a single round of Ten Candles
    * belongs_to Game
  * Conflict - Represents an event with a chance of failure
    * belongs_to Scene
    * belongs_to Player (active player, nullable)
    * state
      * 
  * Players - Represents someone playing a game of Ten Candles.
    * belongs_to Game
    * role - [GM, Player]
  * 

## Business Requirements
### Mandatory for initial release
* Allows games to be started by a GM at will and joined by players by clicking a link generated at game start.
* Game View:
  * Displays the ten candles on-screen. Their 'lit' or 'unlit' status should be synchronized in real time among players.
  * Remains synchronized when the page is refreshed.
  * Displays a simulated 'circle' of players (and the GM), so players know who they will be passing cards to during setup.
  * Runs through each step of the setup phase, which the GM can start whenever all players have joined. Each step advances to the next step automatically when it concludes.
    * Trait step: the first three candles are lit. Each player (not the GM) writes a virtue and a vice. When all players have submitted their virtue and vice, automatically pass the virtue right and the vice left. The GM is skipped when determining who is to the left/right. When traits are passed, proceed to the next step.
    * Prompt the GM to introduce the module to players. The GM should have a prompt to indicate that they are done with introducing the module, which advances to the next step.
    * Prompt players to write up their character concept. This should be visible to them at all times and is not included in their stack of cards to burn. When all players have confirmed their concept, advance to the next step.
    * Light three more candles. Prompt players to write their moment, beginning with 'I will find hope...'. When all players have confirmed their moment, advance to the next step.
    * Light three more candles. Prompt players (and the GM) to write a Brink. Players passing to a player should be prompted with 'I've seen you...'. The player passing to the GM should be prompted with 'I've seen Them...'. The GM should be prompted with 'They have seen you...'. When all players and the GM have confirmed their brink, pass them to the left and advance to the next step.
    * Allow players to arrange their stack of cards. The Brink is locked to the bottom, but the virtue, vice, and moment can be arranged in any order. When players have confirmed their stack, advance to the next step.
    * Light the final candle. The game begins. Prompt the GM to record a parting message for each player in a modal. Allow them to dismiss this modal at their leisure. The modal should not otherwise restrict gameplay.
  * Allows the GM to call for a conflict or dire conflict. When a conflict is called for, a prompt is displayed to all players that allows them to roll for the conflict. Only the player who rolls for the conflict may burn their cards or use their hope die.
    * If a player has a moment at the top of their stack, they are shown a second choice: 'live moment,' which makes them the active player and burns their moment. If the conflict is a success, this grants them a hope die. They get nothing, and still lose the moment, if the conflict is a failure.
    * When a conflict is resolved, it should display whether it was successful or failed. If it succeeded, it should display who gained narrative control based on who rolled the most sixes. The GM wins ties.
    * Allows the active player to choose from available options when a roll is made. The option that is always available is 'accept result,' which ends the conflict with whatever result that dictates. Other options are available as follows:
      * If a trait is at the top of the stack and at least one 1 was rolled, 'burn trait' is available. This option rerolls all 1's and consumes the trait.
      * If a brink is at the top of the stack, 'embrace brink' is available. This option rerolls the entire pool and consumes the brink ONLY IF the final result is a failure. The first time a brink is embraced, it becomes visible to all other players. Note that brinks are NOT consumed unless the roll is a failure, but cannot be used for a reroll more than once per conflict.
    * If the conflict is a dire conflict, an option is displayed to every other player on a failed roll: "martyr yourself," which grants them narrative control, kills their character, and ends the conflict. This option should require confirmation before going through.
      * If the martyred player has a hope die, they may choose another player to pass it to.
      * Dead characters cannot be the active player in a conflict.
    * When the conflict is ended, the person with narrative control is shown a button labeled 'done narrating.' Pressing this button passes control back to the GM, who will then be able to call for the next conflict when appropriate.
  * Tracks the size of the dice pool during a scene and between scenes. Automatically updates the dice pool when a die rolls a 1 (except the Hope Die, which is not lost on a 1 roll).
  * Additionally tracks the GM's dice pool. The GM does not set aside dice on a 1 roll.
  * Allow players to see the current top card for all players (except for the Brink, which remains hidden until the first time it is used). Players can see all of their own cards at all times. Even burned cards remain visible, but should be very obviously indicated as 'burned.'
  * Simulates the transition between rounds when a candle is extinguished, rotating around the table when stating truths.
    * The first person to speak a truth is the person clockwise from the GM. Each person will be prompted with a 'truth spoken' option when it is their turn. This button will advance control to the next person in line.
    * The number of remaining truths should always be visible.
    * When there are 0 remaining truths, the GM should receive a prompt labeled 'begin scene,' which begins the scene.
  * Simulates the final round, when characters die on failing a challenge.
    * Failure no longer darkens a candle, but kills the active player. Players always narrate their own failed conflict in this round.
    * When all players are dead, the final candle should darken and the GM should be prompted with a 'done playing final messages' option. Pressing this button ends the game.
### Follow-on tasks
* The natural burning out of candles is simulated as a normal distribution, with the mean being 4 hours and a hidden standard deviation.
* Allow users to record their 'goodbye' message through the application during setup.
* Aesthetic improvements, e.g. animations for candles, burning cards, etc.
* Add prompts to the setup steps to help guide their format (e.g. 'traits are one word.' 'virtues solve more problems than they create.' etc)
* Keep track of truths stated between rounds and make them visible at all times.
  * Truths should not be tracked beyond the current scene.
