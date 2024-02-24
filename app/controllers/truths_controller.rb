class TruthsController < ApplicationController
  before_action :require_in_scenes_game!, only: [:create]

  def show
  end

  def create
    @truth = @scene.truths.build(truth_params)
    @truth.participation_id = @active_participation.id
    @game = @scene.game

    if @truth.save
      render :show, status: :created
    else
      render json: @truth.errors, status: :unprocessable_entity
    end
  end

  private

    def require_in_scenes_game!
      set_scene
      require_in_this_game!(@scene.game, @active_participation)
    end

    # Use callbacks to share common setup or constraints between actions.
    def set_scene
      @scene = Scene.find(params[:scene_id])
    end

    # Only allow a list of trusted parameters through.
    def truth_params
      params.require(:truth).permit(:description, :participation_id)
    end
end
