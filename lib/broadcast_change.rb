class BroadcastChange
  attr_reader :channels

  def initialize(channels)
    @channels = channels
  end

  def after_commit(record)
    self.channels.each{|c| c.broadcast_update(record) }
  end
end
