# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_10_03_232122) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "conflicts", force: :cascade do |t|
    t.integer "scene_id"
    t.boolean "dire"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "narrated"
    t.index ["scene_id"], name: "index_conflicts_on_scene_id"
  end

  create_table "games", force: :cascade do |t|
    t.string "name"
    t.string "setup_state"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "participations", force: :cascade do |t|
    t.string "name"
    t.integer "game_id"
    t.string "guid"
    t.string "role"
    t.integer "position"
    t.string "virtue"
    t.string "vice"
    t.string "moment"
    t.string "character_concept"
    t.string "written_virtue"
    t.string "written_vice"
    t.string "brink"
    t.string "written_brink"
    t.string "card_order"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["game_id"], name: "index_participations_on_game_id"
  end

  create_table "resolutions", force: :cascade do |t|
    t.integer "conflict_id"
    t.integer "resolution_id"
    t.integer "player_id"
    t.integer "beneficiary_player_id"
    t.string "burned_trait_type"
    t.string "type"
    t.string "player_roll_result"
    t.string "gm_roll_result"
    t.string "state"
    t.boolean "succeeded"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["conflict_id"], name: "index_resolutions_on_conflict_id"
    t.index ["resolution_id"], name: "index_resolutions_on_resolution_id"
  end

  create_table "scenes", force: :cascade do |t|
    t.integer "game_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "state"
    t.index ["game_id"], name: "index_scenes_on_game_id"
  end

  create_table "truths", force: :cascade do |t|
    t.integer "participation_id"
    t.string "description"
    t.integer "scene_id"
    t.index ["participation_id"], name: "index_truths_on_participation_id"
    t.index ["scene_id"], name: "index_truths_on_scene_id"
  end

end
