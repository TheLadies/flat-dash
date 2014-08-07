class ChangeColumnName < ActiveRecord::Migration
  def change
    add_column :repositories, :pull_created_at, :datetime
    add_column :repositories, :pull_updated_at, :datetime
  end
end
