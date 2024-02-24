module ApplicationCable
  class AuthorizedChannel < ApplicationCable::Channel
    before_subscribe do
      reject unless current_user.present?
    end

    def current_user
      @current_user ||= ::Participation.find_by(guid: params[:guid])
    end
  end
end
