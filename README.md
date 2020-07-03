# candela
A fully-virtual web app to play the tabletop RPG Ten Candles with friends remotely.

## Technical Requirements
* This application will have a backend in Ruby on Rails
* The frontend will be in React.js using the Redux framework
* The data model will be as follows:
  * Games - Represents a full, end-to-end game of Ten Candles.
    * has_many Scene
    * has_many Player
    * setup_state
      * :nascent, game has just begun and is waiting for players to join
        * validation: players cannot be added to a Game unless its setup state is :nascent
      * :traits, players are assigning virtues and vices
        * validation: cannot be entered unless there are at least two players (not including the GM)
      * :module_intro, GM is introducing the module
        * validation: cannot be entered unless all non-gm players have written their virtues and vices
      * :character_concept, non-gm players are writing their character concept
      * :moments, non-gm players are writing their Moment
        * validation: cannot be entered unless all non-gm players have a character concept
      * :brinks, ALL players are assigning brinks
        * validation: cannot be entered unless all non-gm players have a moment
      * :order_cards, non-gm players are arranging their virtue, vice, and moment cards
        * validation: cannot be entered unless ALL players have a brink
      * :ready, game is ready to begin
        * validation: cannot be entered unless all players have finalized their card order
        * creates the initial Scene after advancing to this state
  * Scene - Represents a single round of Ten Candles
    * belongs_to Game
    * cannot be created unless game is in the :ready state
  * Conflict - Represents an event with a chance of failure
    * belongs_to Scene
    * has_many :resolutions
    * is_dire - bool
  * Resolution - An action taken in response to a conflict.
    * belongs_to :conflict
    * belongs_to :player
    * belongs_to :resolution (nullable, used for overrides to point at original resolution)
    * has_one :override (mirror of belongs_to :resolution)
    * belongs_to :beneficiary_player (designates a hope die recipient if this resolution killed its active player)
    * burned_trait_type - str (designates which trait was burned for a 'trait' type roll)
    * type - str, bounded list
      * 'roll' - active player rolls it
      * 'martyr' - allowed for rerolls only, on dire conflicts only, kills active player
      * 'moment' - same as 'roll,' but grants hope die if overall was a success
      * 'trait' - allowed for rerolls only, rerolls the ones from its parent resolution and burns the specified trait
        * validation: specified trait type cannot already have been burned for this player
        * validation: specified trait type must be at the top of the player's stack
      * 'brink' - allowed for rerolls only, rerolls the entire pool from its parent resolution and makes the player's brink visible
    * roll_result - str (list of dice rolled)
    * state
      * :proposed - used for actions that need to be justified to the GM. can only advance to 'rolled' by GM action
      * :rolled - dice have been rolled, but result is not finalized, either because the result has not yet been accepted or because there was an overriding action
      * :confirmed - result has been accepted by the player and no further actions can be taken
        * if there are follow-on actions here, e.g. a hope die transfer, they must be adjudicated as part of the transition to 'confirmed'
  * Participation - Represents a player's membership in a game of Ten Candles.
    * belongs_to :game
    * guid - used in URLs to let players rejoin a specific game as their playr without needing to be logged in
    * role - [GM, Player]
    * position - int (order in the circle)
    * virtue - str (virtue given to this character)
    * vice - str (vice given to this character)
    * written_virtue - str (virtue written by this player for adjacent player)
    * written_vice - str (vice written by this player for adjacent player)
    * character_concept - str
    * moment - str
    * brink - str (brink given to this character)
    * written_brink - str (brink written by this player/gm for adjacent player/gm)
    * card_order - str-ish (write custom get/sets here with validation. virtue/vice/moment are 0/1/2, a card order is represented as, e.g., 201 for moment-virtue-vice. top card is the first character.

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
  * Allows the GM to call for a conflict or dire conflict. When a conflict is called for, a prompt is displayed to all living players that allows them to roll for the conflict. Only the player who rolls for the conflict may burn their cards or use their hope die.
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
