class AddUserLoginToRepositories < ActiveRecord::Migration
  def change
    add_index :repositories, :user_login
  end
end
