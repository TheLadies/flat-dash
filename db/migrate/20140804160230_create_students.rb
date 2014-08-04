class CreateStudents < ActiveRecord::Migration
  def change
    create_table :students do |t|
      t.string :username
      t.string :name
      t.references :program, index: true

      t.timestamps
    end
  end
end
