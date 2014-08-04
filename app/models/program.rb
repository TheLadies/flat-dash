class Program < ActiveRecord::Base
  belongs_to :company
  has_many :students
  
end
