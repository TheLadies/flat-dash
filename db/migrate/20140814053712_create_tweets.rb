class CreateTweets < ActiveRecord::Migration
  def change
    create_table :tweets do |t|
      t.string :name
      t.string :username
      t.string :time
      t.text :text

      t.timestamps
    end
  end
end
