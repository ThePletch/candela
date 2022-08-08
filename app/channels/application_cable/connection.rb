module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

  	def connect
      self.current_user = Participation.find_by(guid: cookies['participation_guid'])
      reject_unauthorized_connection if self.current_user.nil?
  	end
  end
end
