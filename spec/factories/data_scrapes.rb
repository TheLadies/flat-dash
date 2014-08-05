# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :data_scrape do
    auth_name "MyString"
    user_name "MyString"
    repo_name "MyString"
    date "2014-08-04"
  end
end
