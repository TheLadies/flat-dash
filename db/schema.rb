# encoding: UTF-8
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

ActiveRecord::Schema.define(version: 20140809193517) do

  create_table "commits", force: true do |t|
    t.string   "name"
    t.string   "user_login"
    t.text     "commit_message"
    t.datetime "commit_created_at"
  end

  create_table "companies", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "programs", force: true do |t|
    t.string   "name"
    t.integer  "company_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "programs", ["company_id"], name: "index_programs_on_company_id"

  create_table "projects", force: true do |t|
    t.string   "name"
    t.integer  "program_id"
    t.integer  "company_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "projects", ["company_id"], name: "index_projects_on_company_id"
  add_index "projects", ["program_id"], name: "index_projects_on_program_id"

  create_table "repositories", force: true do |t|
    t.string   "repo_name"
    t.string   "repo_full_name"
    t.string   "user_login"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.datetime "pull_created_at"
    t.datetime "pull_updated_at"
    t.string   "student_repo_name"
  end

  add_index "repositories", ["user_login"], name: "index_repositories_on_user_login"

  create_table "student_project", force: true do |t|
    t.integer  "student_id"
    t.integer  "project_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "student_project", ["project_id"], name: "index_student_project_on_project_id"
  add_index "student_project", ["student_id"], name: "index_student_project_on_student_id"

  create_table "student_repositories", force: true do |t|
    t.string   "student_repo_name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "students", force: true do |t|
    t.string   "username"
    t.string   "name"
    t.integer  "program_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "students", ["program_id"], name: "index_students_on_program_id"

end
