class CreatePrograms < ActiveRecord::Migration
  def change
    create_table :programs do |t|
      t.string :name
      t.references :company, index: true

      t.timestamps
    end
  end
end
