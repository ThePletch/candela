class ResolutionBeneficiaryValidator < ActiveModel::Validator
  def validate(resolution)
    if resolution.conflict.dire? and resolution.rolled? and !resolution.successful?
      validate_for_dying_player(resolution)
    else
      if resolution.beneficiary_player.present? and resolution.successful?
        resolution.errors.add(:beneficiary_player_id, "You haven't died, so you keep your hope die")
      end
    end
  end

  private

  def validate_for_dying_player(resolution)
    if resolution.active_player.hope_die_count(as_of: resolution.created_at) > 0
      validate_for_dying_player_with_hope_dice(resolution)
    elsif resolution.beneficiary_player.present?
      resolution.errors.add(:beneficiary_player_id, "You have no hope die to bequeath, so you can't choose a beneficiary")
    end
  end

  def validate_for_dying_player_with_hope_dice(resolution)
    if resolution.beneficiary_player.present?
      if resolution.type == 'MartyrResolution'
        validate_hope_dice_recipient(resolution)
      else
        resolution.errors.add(:beneficiary_player_id, "You can only grant a player your hope die if you died martyring yourself.")
      end
    elsif resolution.confirmed? and resolution.type == 'MartyrResolution'
      resolution.errors.add(:beneficiary_player_id, "You must specify the beneficiary of your hope die before confirming")
    end
  end

  def validate_hope_dice_recipient(resolution)
    if resolution.beneficiary_player.game == resolution.active_player.game
      if resolution.beneficiary_player.gm?
        resolution.errors.add(:beneficiary_player_id, "You can't bequeath a hope die to the GM")
      elsif resolution.beneficiary_player == resolution.active_player
        resolution.errors.add(:beneficiary_player_id, "You can't bequeath a hope die to yourself")
      end
    else
      resolution.errors.add(:beneficiary_player_id, "You can only bequeath a hope die to players in this game")
    end
  end
end
