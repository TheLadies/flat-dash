class CreateStudentRepositories < ActiveRecord::Migration
  def change
    create_table :student_repositories do |t|
      t.string :student_repo_name

      t.timestamps
    end
  end
end
