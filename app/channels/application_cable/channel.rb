module ApplicationCable
  class Channel < ActionCable::Channel::Base
    after_subscribe do
      transmit({identifier: @identifier, synchronized: true})
    end
  end
end
