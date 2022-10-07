# TODO require gm for advance setup state
class GamesController < ApplicationController
  before_action :set_game, only: [:show, :advance_setup_state]

  # GET /games/1
  # GET /games/1.json
  def show
  end

  # GET /games/new
  def new
    @game = Game.new
  end

  def index
    @games = Game.nascent.includes(:participations)
  end

  # POST /games
  # POST /games.json
  def create
    @game = Game.new(game_params)
    @participation = @game.participations.build(role: 'gm', name: params['gm_name'])

    respond_to do |format|
      if @game.save
        flash[:notice] = "Anyone who goes to this URL can play as the GM, so treat the URL like a password."
        format.html { redirect_to play_game_url(participation_guid: @participation.guid, notice: 'Game was successfully created.') }
        format.json { render :created, status: :created, location: play_game_url(participation_guid: @participation.guid) }
      else
        format.html { render :new }
        format.json { render json: @game.errors, status: :unprocessable_entity }
      end
    end
  end

  # json only
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
    # Use callbacks to share common setup or constraints between actions.
    def set_game
      @game = Game.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def game_params
      params.require(:game).permit(:name)
    end
end
