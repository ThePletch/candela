class ScenesController < ApplicationController
  before_action :set_game, only: [:create]

  # should happen after any actions that alter game state
  after_action :broadcast_state, only: [:create]

  def show
  end

  def create
    @scene = @game.scenes.build(scene_params)

    if @scene.save
      render :show, status: :created
    else
      render json: @scene.errors, status: :unprocessable_entity
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_game
      @game = Game.find(params[:game_id])
    end

    # Only allow a list of trusted parameters through.
    def scene_params
      params.require(:scene).permit(:name)
    end

    def broadcast_state
      GamesChannel.broadcast_update(@game)
    end
end
