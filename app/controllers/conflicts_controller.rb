class ConflictsController < ApplicationController
  before_action :set_conflict, only: [:finish_narration]
  before_action :require_gm_of_scene!, only: [:create]
  before_action :require_gm_of_conflict!, only: [:finish_narration]

  def create
    @conflict = @scene.conflicts.build(conflict_params)

    if @conflict.save
      render :show, status: :created
    else
      render json: @conflict.errors, status: :unprocessable_entity
    end
  end

  def finish_narration
    @scene = @conflict.scene
    @conflict.narrated = true

    if @conflict.save
      render :show, status: :ok
    else
      render json: @conflict.errors, status: :unprocessable_entity
    end
  end

  # todo add handling for post-conflict narration

  private

  def require_gm_of_scene!
    set_scene
    require_gm_of_this_game!(@scene.game, @active_participation)
  end

  def require_gm_of_conflict!
    set_conflict
    require_gm_of_this_game!(@conflict.scene.game, @active_participation)
  end

  def set_scene
    @scene = Scene.find(params[:scene_id])
  end

  def set_conflict
    @conflict = Conflict.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def conflict_params
    params.require(:conflict).permit(:dire)
  end
end
