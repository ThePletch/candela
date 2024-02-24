class BroadcastChange
  attr_reader :channels, :parent_mappings

  # parent_mappings are tuples of channels and procs to extract a parent
  # from a record
  def initialize(channels, parent_mappings = [])
    @channels = channels
    @parent_mappings = parent_mappings
  end

  def after_commit(record)
    self.channels.each{|c| c.broadcast_update(record) }
    self.parent_mappings.each do |parent_mapping|
      puts parent_mapping
      channel, parent_extractor = parent_mapping
      puts channel
      puts parent_extractor
      channel.broadcast_update(parent_extractor.call(record))
    end
  end
end
