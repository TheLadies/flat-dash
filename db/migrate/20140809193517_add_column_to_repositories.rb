class AddColumnToRepositories < ActiveRecord::Migration
  def change
    add_column :repositories, :student_repo_name, :string
  end
end
