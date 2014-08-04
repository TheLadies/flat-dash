class Project < ActiveRecord::Base
  belongs_to :program
  belongs_to :company
  has_many :student_projects
  has_many :students, through: :student_projects
end
