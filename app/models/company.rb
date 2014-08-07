class Company < ActiveRecord::Base
  has_many :programs
  has_many :students, through: :programs
  has_many :projects, through: :students
end
