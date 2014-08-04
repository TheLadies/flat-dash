class Project < ActiveRecord::Base
  belongs_to :program
  belongs_to :company
end
