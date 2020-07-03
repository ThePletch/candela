class ParticipationsController < ApplicationController
  before_action :set_game, only: [:new, :create]

  # GET /participations/new
  def new
    @participation = Participation.new(game: @game, role: 'player')
  end

  # POST /participations
  # POST /participations.json
  def create
    @participation = Participation.new(game: @game, role: 'player' participation_params)

    respond_to do |format|
      if @participation.save
        format.html { redirect_to @participation, notice: 'Participation was successfully created.' }
        format.json { render :show, status: :created, location: @participation }
      else
        format.html { render :new }
        format.json { render json: @participation.errors, status: :unprocessable_entity }
      end
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_game
      @game = Game.find(params[:game_id])
    end

    # Only allow a list of trusted parameters through.
    def participation_params
      params.require(:participation).permit(:name)
    end
end
