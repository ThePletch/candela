class ApplicationController < ActionController::Base
	protect_from_forgery unless: -> { request.format.json? }

  before_action :set_participation_by_guid

  protected

  def require_in_this_game!(game, participation)
    if participation.nil?
      render_error_message('Request must be authenticated as someone in this game.', status: :unauthorized)
      return false
    end

    if participation.game != game
      render_error_message('You may only perform this action on your own game.', status: :forbidden)
      return false
    end

    return true
  end

  def require_player_of_this_game!(game, participation)
    if require_in_this_game!(game, participation)
      if participation.role != 'player'
        render_error_message('Only a player may perform this action.', status: :forbidden)
        return false
      end
    end
  end

  def require_gm_of_this_game!(game, participation)
    if require_in_this_game!(game, participation)
      if participation.role != 'gm'
        render_error_message('Only the GM may perform this action.', status: :forbidden)
      end
    end
  end

  private

  def set_participation_by_guid
    if params[:participant_guid]
      @active_participation = Participation.find_by(guid: params[:participant_guid])
    end
  end

  def render_error_message(message, status:)
    render json: {errors: [message]}, status: status
  end

end
