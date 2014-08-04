class Company < ActiveRecord::Base
  has_many :students, through: :programs
  has_many :programs
end
