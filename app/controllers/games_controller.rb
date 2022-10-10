class GamesController < ApplicationController
  before_action :set_game, only: [:show, :advance_setup_state]
  before_action :require_gm_of_game!, only: [:advance_setup_state]

  def show
  end

  def new
    @game = Game.new
  end

  def index
    @games = Game.nascent.includes(:participations)
  end

  def create
    @game = Game.new(game_params)
    @participation = @game.participations.build(role: 'gm', name: params['gm_name'])

    if @game.save
      render :created, status: :created, location: play_game_url(participation_guid: @participation.guid)
    else
      render json: @game.errors, status: :unprocessable_entity
    end
  end

  def advance_setup_state
    if @game.setup_state != params[:current_setup_state]
      render json: {}, status: :unprocessable_entity
      return
    end

    @game.transition_to_next_stage!
    render json: {}, status: :ok
  end



  def play
    @participation = Participation.find_by(guid: params[:participation_guid])
    @game = @participation.game
  end

  private

  def set_game
    @game = Game.find(params[:id])
  end

  def game_params
    params.require(:game).permit(:name)
  end

  def require_gm_of_game!
    require_gm_of_this_game!(@game, @active_participation)
  end
end
