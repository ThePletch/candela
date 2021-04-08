class GamesController < ApplicationController
  before_action :set_game, only: [:show, :advance_setup_state]

  # should happen after any actions that alter game state
  after_action :broadcast_game_state, only: [:advance_setup_state]

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
        format.json { render :show, status: :created, location: play_game_url(participation_guid: @participation.guid) }
      else
        format.html { render :new }
        format.json { render json: @game.errors, status: :unprocessable_entity }
      end
    end
  end

  # json only
  # todo consider how to wrap this in a transaction to avoid double-advancement race conditions
  def advance_setup_state
    if @game.setup_state != params[:current_setup_state]
      # todo what does an error look like
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
    def broadcast_game_state
      GameChannel.broadcast_update(@game)
    end

    # Use callbacks to share common setup or constraints between actions.
    def set_game
      @game = Game.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def game_params
      params.require(:game).permit(:name)
    end
end
