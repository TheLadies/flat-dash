# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

flatiron = Company.create(name: "Flatiron School")

ruby = Program.create(name: "Ruby 005", company_id: 1)
ios = Program.create(name: "iOS 001", company_id: 1)

jess = Student.create(name: "Jessica Rudder", username: "JessRudder", program_id: 1)
denine = Student.create(name: "Denine Guy", username: "denineguy", program_id: 1)
christina = Student.create(name: "Christina Leuci", username: "christinaleuci", program_id: 1)
joe = Student.create(name: "Joe Burgess", username: "joestheman", program_id: 2)

flatdash = Project.create(name: "Flat Dash", program_id: 1, company_id: 1)
sillyiosthing = Project.create(name: "Silly iOS Thing", program_id: 2, company_id: 1)
playlister = Project.create(name: "Playlister", program_id: 1, company_id: 1)

join1 = StudentProjects.create(student_id: 1, project_id: 1)
join2 = StudentProjects.create(student_id: 2, project_id: 1)
join3 = StudentProjects.create(student_id: 3, project_id: 1)
join4 = StudentProjects.create(student_id: 3, project_id: 3)
join5 = StudentProjects.create(student_id: 4, project_id: 2)
