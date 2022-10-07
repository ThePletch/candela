# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_10_03_232122) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "conflicts", force: :cascade do |t|
    t.bigint "scene_id"
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
    t.bigint "game_id"
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
    t.bigint "conflict_id"
    t.bigint "resolution_id"
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
    t.bigint "game_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "state"
    t.index ["game_id"], name: "index_scenes_on_game_id"
  end

  create_table "truths", force: :cascade do |t|
    t.bigint "participation_id"
    t.string "description"
    t.bigint "scene_id"
    t.index ["participation_id"], name: "index_truths_on_participation_id"
    t.index ["scene_id"], name: "index_truths_on_scene_id"
  end

  add_foreign_key "conflicts", "scenes"
  add_foreign_key "participations", "games"
  add_foreign_key "resolutions", "conflicts"
  add_foreign_key "resolutions", "resolutions"
  add_foreign_key "scenes", "games"
  add_foreign_key "truths", "participations"
end
