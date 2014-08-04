# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :student_project, :class => 'StudentProjects' do
    student nil
    project nil
  end
end
