require 'rails_helper'

RSpec.describe Participation, type: :model do
  it "generates a GUID on creation" do
    part = FactoryBot.create(:participation)
    expect(part.guid).to be_present
  end

  it "tracks the player's position in the circle" do
    first_participant = FactoryBot.create(:participation)
    second_participant = FactoryBot.create(:participation, game: first_participant.game)
    expect(first_participant.position).to eq 0
    expect(second_participant.position).to eq 1
  end

  it "determines the player to the left and right correctly" do
    game = FactoryBot.create(:game)
    first_participant, second_participant, third_participant = FactoryBot.create_list(:participation, 3, game: game)
    expect(first_participant.left_player).to eq third_participant
    expect(first_participant.right_player).to eq second_participant
    expect(second_participant.left_player).to eq first_participant
    expect(second_participant.right_player).to eq third_participant
    expect(third_participant.left_player).to eq second_participant
    expect(third_participant.right_player).to eq first_participant
  end

  it "skips the GM on request in left/right player calculations" do
    game = FactoryBot.create(:game)
    gm = FactoryBot.create(:participation, role: 'gm', game: game)
    first_participant, second_participant, third_participant = FactoryBot.create_list(:participation, 3, game: game)
    expect(first_participant.left_player(skip_gm: false)).to eq gm
    expect(first_participant.left_player(skip_gm: true)).to eq third_participant
    expect(second_participant.left_player(skip_gm: false)).to eq first_participant
    expect(second_participant.left_player(skip_gm: true)).to eq first_participant
    expect(third_participant.right_player(skip_gm: false)).to eq gm
    expect(third_participant.right_player(skip_gm: true)).to eq first_participant
  end

  it "tracks the hope dice a player gains from living their moment" do
    moment_resolution = FactoryBot.create(:moment_resolution, :succeeded)
    participant = moment_resolution.active_player
    expect(participant.hope_die_count).to eq 0
    moment_resolution.confirm!
    expect(participant.hope_die_count).to eq 1
  end

  it "tracks hope dice given to a player by dead fellow players" do
    moment_resolution = FactoryBot.create(:moment_resolution, :succeeded, :confirmed)
    hoped_participant = moment_resolution.active_player
    expect(hoped_participant.hope_die_count).to eq 1

    other_player = hoped_participant.game.participations.players.find{|x| x != hoped_participant }
    expect(other_player.hope_die_count).to eq 0
    martyrdom = FactoryBot.create(:martyr_resolution, :confirmed,
      game: hoped_participant.game,
      active_player: hoped_participant,
      beneficiary_player: other_player)
    expect(other_player.hope_die_count).to eq 1
  end

  it "marks a player as dead if they failed a dire conflict" do
    dire_conflict = FactoryBot.create(:conflict, dire: true)
    dire_resolution = FactoryBot.create(:resolution, :failed, conflict: dire_conflict)
    expect(dire_resolution.active_player.alive?).to be true
    dire_resolution.confirm!
    expect(dire_resolution.active_player.alive?).to be false
  end

  it "does not allow more than one GM per game" do
    game = FactoryBot.create(:game)
    gm_one = FactoryBot.create(:participation, game: game, role: 'gm')
    expect(gm_one).to be_valid
    gm_two = FactoryBot.build(:participation, game: game, role: 'gm')
    expect(gm_two).not_to be_valid
  end

  it "tracks the top unburned card in a player's stack" do
    game = FactoryBot.create(:game_ready)
    player_one = game.participations.players.take
    expect(player_one.top_trait).to eq "virtue"
    FactoryBot.create(:trait_resolution, :succeeded, :confirmed, burned_trait_type: '0', active_player: player_one, game: game)
    expect(player_one.top_trait).to eq "vice"
  end

  it "hides/shows the player's brink based on whether they have used it" do
    on_the_brink = FactoryBot.create(:participation_down_to_brink)
    expect(on_the_brink.top_trait).to eq "brink"
    expect(on_the_brink.top_trait_value).to eq "(hidden)"
    expect(on_the_brink.brink_embraced).to eq false

    FactoryBot.create(:brink_resolution, :succeeded, :confirmed, active_player: on_the_brink, game: on_the_brink.game)

    expect(on_the_brink.top_trait_value).to eq on_the_brink.brink
    expect(on_the_brink.brink_embraced).to eq true

  end

  it "only burns a brink if the player fails a brink reroll" do
    on_the_brink = FactoryBot.create(:participation_down_to_brink)
    expect(on_the_brink.burned_traits).not_to include("3")
    FactoryBot.create(:brink_resolution, :succeeded, :confirmed, active_player: on_the_brink, game: on_the_brink.game)
    expect(on_the_brink.burned_traits).not_to include("3")
    FactoryBot.create(:brink_resolution, :failed, :confirmed, active_player: on_the_brink, game: on_the_brink.game)
    expect(on_the_brink.burned_traits).to include("3")
  end

  it "discards a player's hope dice if they fail a brink reroll" do
    moment_resolution = FactoryBot.create(:moment_resolution, :succeeded, :confirmed)
    hoped_participant = moment_resolution.active_player
    expect(hoped_participant.hope_die_count).to eq 1
    FactoryBot.create(:brink_resolution, :failed, :confirmed, active_player: hoped_participant, game: hoped_participant.game)
    expect(hoped_participant.hope_die_count).to eq 0
  end
end
