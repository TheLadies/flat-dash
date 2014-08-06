class AddAttributesToRepositories < ActiveRecord::Migration
  def change
    add_column :repositories, :repo_full_name, :string
    add_column :repositories, :user_login, :string
    add_column :repositories, :created_at, :datetime
    add_column :repositories, :updated_at, :datetime
  end
end
