class CreateStudentProjects < ActiveRecord::Migration
  def change
    create_table :student_projects do |t|
      t.references :student, index: true
      t.references :project, index: true

      t.timestamps
    end
  end
end
