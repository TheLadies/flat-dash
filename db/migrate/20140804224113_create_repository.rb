class CreateRepository < ActiveRecord::Migration
  def change
    create_table :repositories do |t|
      t.string :repo_name
    end
  end
end
