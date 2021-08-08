class Truth < ApplicationRecord
	belongs_to :scene
	belongs_to :participation

  validate :scene_has_unstated_truths

  after_create do
    if scene.all_truths_stated
      scene.finish_stating_truths!
    end
  end

  def scene_has_unstated_truths
    unless scene.truths.where.not(id: self.id).count < scene.expected_truth_count
      errors[:base].add("All truths have been stated for the parent scene.")
    end
  end
end
