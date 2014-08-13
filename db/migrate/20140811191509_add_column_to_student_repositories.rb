class AddColumnToStudentRepositories < ActiveRecord::Migration
  def change
    add_column :student_repositories, :branch, :string
  end
end
