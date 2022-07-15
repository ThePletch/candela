SCREEN LAYOUT

Top-right embedded square (the Minimap):
    * Large off-white circle in the center (the bowl)
        * Mousing over the bowl once the game begins displays:
            * The number of candles still lit
            * The current dice pool for the players
            * Your personal dice pool (only if you have at least one hope die)
    * Circle of candles, lighting synced (candles are circles)
        * Yellow or dark gray based on status
            * When there is an active scene, blue circle in the corner of each candle to represent the dice pool
    * Circle of squares, one per player, around the candles
        * Other players are white when alive, red when not
        * GM is always blue
        * Current player is green when alive, orange when not
        * All players gain a small blue circle in the corner of their icon when they have a hope die
        * A '...' icon displays next to any player currently being prompted for something
            * A player's name should always be visible when such an icon is present
        * For setup phases that involve passing cards, arrows should display pointing out from/in toward the current character, indicating where their cards are going and coming from
            * Inbound arrows should be curved inward
            * Outbound arrows should be curved outward
            * To ensure that 3-player games don't overlap arrows, the 'virtue' and 'vice' arrows should be slightly offset (e.g. having the virtue arrow render slightly further out from the line) and differently colored
                * Mousing over any arrow should show what card will be transferred.
    * Mousing over a player shows their name and a brief snippet of their character concept
        * [potentially] Their current top card type, but not its value
    * Clicking a player expands their information in the Info Pane
        * Character name at the top (with the player name in a lighter weight font)
            * Player name is editable at all times by either that player or by the GM
        * Character bio beneath that
        * Then ALL cards
            * Cards have their type in the top-right in bold, then (when expanded) their text in normal weight font
            * Collapsed cards can be clicked to expand
                * Expanded cards can be collapsed by clicking anywhere outside of the card (or on the top bar where the type is listed)
            * Burned cards should always start collapsed
            * Top card should start expanded, and should be a brighter color
                * Top card values are automatically visible (EXCEPT for brinks)
                    * Brinks become visible when used
            * Bottom cards start collapsed, and their value is hidden unless either:
                * The observing player gave them that card
                * The observing player is playing the displayed character
        * At the bottom, there are links to play/spectate as the chosen player
            * Only visible to either the player themselves or the GM
Rectangle dominating remainder of right sidebar below the Minimap (the Info Pane)
    * Info pane has tabs at the bottom
        * Contextual tab (labeled with whatever character you're looking at)
        * Truths (should only be displayed once the second scene begins)
        * Rules/Help

Main panel 
    * Large top bar labeling the current 'phase'
        * During setup, this should say 'The Beginning: ' and label the current setup stage, e.g.:
            * Declaring your Traits
            * Discovering the scenario
            * Envisioning your character
            * Planning your Moment
            * Uncovering your Brink
            * Ordering your cards
        * During the game, the top bar should indicate the current scene, e.g. 'The first scene'/'The second scene'
            * The last two scenes, rather than 'the ninth' and 'the tenth', should say 'the penultimate scene' and 'the final scene'
    * SETUP PHASES
        * Short blurb at the top about the current phase, what it represents
        * List of limitations and requirements
        * Suggestions/examples
            * Expandable/collapsible
        * Mechanics
            * Expandable/collapsible
        * The box to fill things in
        * Button to 'CONFIRM' that changes to 'Go back and edit' once submitted
    * Specific setup phase layouts that might differ:
        * TRAITS
            * Screen divided in two (except on very small screens)
            * Limitations
            * This Virtue/Vice will go to [name]
            * Submit together
        * BRINK
            * Contextual info displayed ONLY IF passing to the GM/receiving from the GM
        * CARD ORDER
            * Markers indicate "the top of your pile" and "the bottom of your pile"
            * Hint about moments (unless it's very simple, wise not to put it at the top)
    * GAME
        * When no conflict is occurring, display a gray button: "Darken a candle immediately and narrate the end of this scene"
            * Don't submit this without a confirmation dialog
        * VERY big text when a conflict occurs
            * Screen-dominating red button "FACE THE CHALLENGE"
                * Small text beneath it indicating the players dice pool ("You will be rolling [n] dice(, including your 1 hope die [if applicable])")
            * If their moment has not yet been burned, "LIVE YOUR MOMENT" in blue
                * Button text should include (in smaller font) the content of the character's moment, prefaced with 'I will find hope...'
                * Button is disabled unless their moment is at the top of their stack, with mouseover text to indicate that this is why it is disabled.
        * For a resolution, display the player and GM rolls side-by-side.
            * Sixes should be colored green on both sides
            * Hope dice should be colored cyan, and tinted green when rolling a five or six
            * Ones, except hope dice, should be highlighted in red for the player
                * GM ones should not appear in red
            * Display the result (SUCCESS/FAILURE) in big text
            * Indicate the number of successes in big font beneath each, highlighting the victor and indicating that they will narrate the outcome of this scene
            * Indicate the number of dice that will be lost on the player side.
                * Do not display this for rolls where the player failed (since the scene will end rather than the dice pool decreasing)
            * List the consequences of the result at the bottom in a list
                * "[person] will narrate the outcome of this conflict."
                * [if the players failed] "The scene will end."
                    * If it's the final scene, replace this with "[name] will die."
                * [if a failed dire conflict] "Great harm will come to [name]."
                    * If at least one other character is alive, show to this player in italics: "Your friends may sacrifice their life to save you, if they choose."
            * Below that, show the following large buttons to the player who rolled:
                * Accept this result
                    * If a failed dire conflict or a failure in the final scene, change to "Accept your fate"
                        * If a failed dire conflict, display in the list below: "You will be gravely harmed."
                        * If the final scene, display in the list below: "You will die."
                    * If a failure (and not the final scene), display in the list below: "This will end the current scene."
                * Burn your virtue/vice to reroll ones
                    * Mousing over this should highlight the ones the player rolled in orange.
                    * Display in the list below: "Your character must act according to your trait ([trait]) to burn it."
                    * Display in the list below: "You will reroll the [n] ones rolled."
                    * Should not display if your virtue/vice is not at the top of the stack
                    * Should display, but be disabled if no ones were rolled
                        * If disabled for this reason, display: "You have no ones to reroll."
                * Embrace your brink to reroll all of your dice
                    * Display in the list below: "Your character must behave according to your brink ("I've seen you...[brink]") to embrace it. This is likely to badly complicate the situation."
                    * Display in the list below: "If your reroll is a failure, you will be consumed by your brink, unable to embrace it again."
                    * Mousing over this should highlight the entire roll in orange.
                    * Should not display if your brink is not at the top of the stack
                    * If player has not yet used their brink, display in the list below: "This will reveal your brink to everyone."
            * To players other than the one who rolled, show these buttons:
                * Darken a candle immediately and narrate the end of this scene
                    * This should not display unless the roll was not a failure
                * Martyr yourself to save [character]
                    * This should only display for a failed dire conflict, and only if the character is alive
                    * Display in the list below: This will kill you to save [name], but allow you to narrate the end of the scene.

