class ResolutionsController < ApplicationController
  before_action :require_owned_resolution!, only: [:confirm]
  before_action :require_player_in_game!, only: [:create]

  def create
    @game = @conflict.scene.game
    @resolution = @conflict.resolutions.build(resolution_params)
    @resolution.player_id = @active_participation.id

    if @resolution.save
      if ['MomentResolution', 'TraitResolution', 'BrinkResolution'].include?(@resolution.type)
        ParticipationsChannel.broadcast_update(@resolution.active_player)
      end

      render :show, status: :created
    else
      render json: @resolution.errors, status: :unprocessable_entity
    end
  end

  def confirm
    @game = @resolution.conflict.scene.game

    if params[:beneficiary_player_id]
      @resolution.beneficiary_player_id = params[:beneficiary_player_id]
    end

    if @resolution.confirm!
      if @resolution.conflict.dire? and !@resolution.successful?
        # f's in chat
        ParticipationsChannel.broadcast_update(@resolution.active_player)
      end
      render :show, status: :ok
    else
      render json: @resolution.errors, status: :unprocessable_entity
    end

  end

  private

    def require_player_in_game!
      set_conflict
      require_player_of_this_game!(@conflict.scene.game, @active_participation)
    end

    def require_owned_resolution!
      set_resolution
      if require_player_of_this_game!(@resolution.conflict.scene.game, @active_participation)
        if @resolution.active_player != @active_participation
          render_error_message("You cannot confirm another player's resolution.", status: :forbidden)
        end
      end
    end

    # Use callbacks to share common setup or constraints between actions.
    def set_conflict
      @conflict = Conflict.find(params[:conflict_id])
    end

    def set_resolution
      @resolution = Resolution.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def resolution_params
      params.require(:resolution).permit(:resolution_id, :beneficiary_player_id, :type, :burned_trait_type)
    end
end
