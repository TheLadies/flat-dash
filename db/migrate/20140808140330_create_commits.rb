class CreateCommits < ActiveRecord::Migration
  def change
    create_table :commits do |t|
      t.string :name
      t.string :user_login
      t.text :commit_message
      t.datetime :commit_created_at
    end
  end
end
