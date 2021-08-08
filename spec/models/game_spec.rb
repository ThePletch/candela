require 'rails_helper'

RSpec.describe Game, type: :model do
  it "starts in the nascent state" do
    expect(FactoryBot.create(:game)).to be_nascent
  end

  it "has no candles lit when nascent" do
    new_game = FactoryBot.create(:game)
    expect(new_game).to be_nascent
    expect(new_game.candles_lit).to be 0
  end

  it "requires two players to begin setup" do
    new_game = FactoryBot.create(:game)
    expect(new_game.may_transition_to_next_stage?).to be false
    FactoryBot.create(:participation, role: 'gm', game: new_game)
    expect(new_game.may_transition_to_next_stage?).to be false
    FactoryBot.create(:participation, role: 'player', game: new_game)
    expect(new_game.may_transition_to_next_stage?).to be false
    FactoryBot.create(:participation, role: 'player', game: new_game)
    expect(new_game.may_transition_to_next_stage?).to be true
    new_game.transition_to_next_stage!
  end

  it "has 3 candles lit during the traits stage" do
    game = FactoryBot.create(:game_in_traits_stage)
    expect(game.candles_lit).to eq 3
  end

  it "requires traits to move on to the module intro" do
    game = FactoryBot.create(:game_in_traits_stage)
    expect(game.may_transition_to_next_stage?).to be false

    game.participations.players.each do |player|
      expect(game.may_transition_to_next_stage?).to be false
      player.update(written_virtue: player.name + ' virtue')
      expect(game.may_transition_to_next_stage?).to be false
      player.update(written_vice: player.name + ' vice')
    end

    expect(game.may_transition_to_next_stage?).to be true
    game.transition_to_next_stage!
  end

  it "swaps around traits in a circle when traits stage ends" do
    game = FactoryBot.create(:game_in_traits_stage, players_count: 3)

    game.participations.players.each do |player|
      player.written_virtue = player.name + ' Virtue'
      player.written_vice = player.name + ' Vice'
      player.save!
    end

    game.transition_to_next_stage!

    first_player, second_player, third_player = game.participations.players
    expect(first_player.virtue).to eq third_player.written_virtue
    expect(first_player.vice).to eq second_player.written_vice
    expect(second_player.virtue).to eq first_player.written_virtue
    expect(second_player.vice).to eq third_player.written_vice
    expect(third_player.virtue).to eq second_player.written_virtue
    expect(third_player.vice).to eq first_player.written_vice
  end

  it "has 3 candles lit during the module intro stage" do
    game = FactoryBot.create(:game_in_module_intro)
    expect(game.candles_lit).to eq 3
  end

  it "doesn't require anything extra to move past the module intro" do
    game = FactoryBot.create(:game_in_module_intro)
    expect(game.may_transition_to_next_stage?).to be true
    game.transition_to_next_stage!
  end

  it "has 3 candles lit during the concepts stage" do
    game = FactoryBot.create(:game_in_concepts_stage)
    expect(game.candles_lit).to eq 3
  end

  it "requires character concepts to move onto moments" do
    game = FactoryBot.create(:game_in_concepts_stage)
    expect(game.may_transition_to_next_stage?).to be false

    game.participations.players.each do |player|
      expect(game.may_transition_to_next_stage?).to be false
      player.update(character_concept: player.name + ' concept')
    end

    expect(game.may_transition_to_next_stage?).to be true
    game.transition_to_next_stage!
  end

  it "has 6 candles lit during the moments stage" do
    game = FactoryBot.create(:game_in_moments_stage)
    expect(game.candles_lit).to eq 6
  end

  it "requires moments to move onto brinks" do
    game = FactoryBot.create(:game_in_moments_stage)
    expect(game.may_transition_to_next_stage?).to be false

    game.participations.players.each do |player|
      expect(game.may_transition_to_next_stage?).to be false
      player.update(moment: player.name + ' moment')
    end

    expect(game.may_transition_to_next_stage?).to be true
    game.transition_to_next_stage!
  end

  it "has 9 candles lit during the brinks stage" do
    game = FactoryBot.create(:game_in_brinks_stage)
    expect(game.candles_lit).to eq 9
  end

  it "requires brinks to move on to card ordering stage" do
    game = FactoryBot.create(:game_in_brinks_stage)
    expect(game.may_transition_to_next_stage?).to be false

    game.participations.each do |player|
      expect(game.may_transition_to_next_stage?).to be false
      player.update(written_brink: player.name + ' brink')
    end

    expect(game.may_transition_to_next_stage?).to be true
    game.transition_to_next_stage!
  end

  it "passes brinks to the left, including the GM, when the brinks stage completes" do
    game = FactoryBot.create(:game_in_brinks_stage)

    game.participations.each do |player|
      player.update(written_brink: player.name + ' brink')
    end

    game.transition_to_next_stage!

    # one of these players is the GM but their GM-ness doesn't affect the business logic,
    # they're just included in this round unlike the traits round.
    # note that we need to reload the association, since it's cached by the call above.
    first_player, second_player, third_player = game.participations.reload
    expect(first_player.brink).to eq second_player.written_brink
    expect(second_player.brink).to eq third_player.written_brink
    expect(third_player.brink).to eq first_player.written_brink
  end

  it "has 9 candles lit during the card ordering stage" do
    game = FactoryBot.create(:game_in_card_ordering_stage)
    expect(game.candles_lit).to eq 9
  end

  it "requires cards to be ordered to start the game" do
    game = FactoryBot.create(:game_in_card_ordering_stage)
    expect(game.may_transition_to_next_stage?).to be false

    game.participations.players.each do |player|
      expect(game.may_transition_to_next_stage?).to be false
      player.update(card_order: '012')
    end

    expect(game.may_transition_to_next_stage?).to be true
    game.transition_to_next_stage!
  end

  it "has 10 candles lit at the start of the game" do
    game = FactoryBot.create(:game_ready)
    expect(game.candles_lit).to eq 10
  end

  it "extinguishes a candle when each scene is failed" do
    game = FactoryBot.create(:game_ready)
    failed_first_scene = FactoryBot.create(:scene, :failed, game: game)

    expect(game.candles_lit).to eq 9
  end

  # this is time zone dependent and will fail in the ten minutes after daylight savings time ends
  it "can calculate candles lit as of a given timestamp" do
    game = FactoryBot.create(:game_ready)
    failed_first_scene = FactoryBot.create(:scene, :failed, game: game, created_at: DateTime.current)
    active_scene = FactoryBot.create(:scene)
    expect(game.reload.candles_lit(as_of: 10.minutes.ago)).to eq 10
  end
end
