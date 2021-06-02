class ParticipationsController < ApplicationController
  layout 'games'
  before_action :set_game, only: [:new, :create]
  before_action :set_participation, only: [:update]

  # should happen after any actions that alter game state
  after_action :broadcast_participant_state, only: [:create, :update]

  # GET /participations/new
  def new
    @participation = @game.participations.build(role: 'player')
  end

  def create
    @participation = @game.participations.build(participation_params.merge(role: 'player'))

    respond_to do |format|
      if @participation.save
        flash[:notice] = "Anyone who goes to this URL can play as your character, so treat the URL like a password."
        format.html { redirect_to play_game_path(participation_guid: @participation.guid) }
        format.json { render :show, status: :created, location: @participation }
      else
        format.html { render :new }
        format.json { render json: @participation.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    if @participation.update(participation_params)
      render json: {}, status: :ok
    else
      render json: @participation.errors, status: :unprocessable_entity
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_game
      @game = Game.find(params[:game_id])
    end

    def set_participation
      @participation = Participation.find(params[:id])
    end

    # user can change their name at any point, but can only update specific
    # attributes of their character at each setup stage. once game begins,
    # character attributes are fixed.
    def permitted_params_by_setup_state
      if not @participation
        return []
      end

      case @participation.game.setup_state
      when 'traits'
        # note that players cannot modify :virtue or :vice, since those attributes are
        # transferred to them from an adjacent player
        [:written_virtue, :written_vice]
      when 'character_concept'
        [:character_concept]
      when 'moments'
        [:moment]
      when 'brinks'
        # note that players cannot modify :brink, since that attribute is transferred to
        # them from an adjacent player
        [:written_brink]
      when 'order_cards'
        [:card_order]
      else
        []
      end
    end

    # Only allow a list of trusted parameters through.
    def participation_params
      params.require(:participation).permit(:name, *permitted_params_by_setup_state)
    end

    def broadcast_participant_state
      ParticipantsChannel.broadcast_update(@participation)
    end
end
