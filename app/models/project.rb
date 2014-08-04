class Project < ActiveRecord::Base
  belongs_to :program
  has_one :company, through: :program
  has_many :student_projects
  has_one :student, through: :student_projects
end
