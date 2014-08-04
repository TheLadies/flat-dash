class Student < ActiveRecord::Base
  belongs_to :program
  has_many :student_projects
  has_many :projects, through: :student_projects
end
