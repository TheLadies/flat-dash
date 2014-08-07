require 'active_record'
class Repository < ActiveRecord::Base
  attr_reader :client

  def self.client
    client = Octokit::Client.new(access_token: ENV['GITHUB_TOKEN'], auto_traversal: true)
    client.auto_paginate = true
    client
  end

  def client
    self.class.client
  end


  def self.get_repos
    repos = client.org_repos("flatiron-school-students")
    repos.map do |repo|
      repo.full_name
    end
  end

  # def self.make_repos
  #   repos = get_repos
  #   repos.map do |name|
  #     find_or_create_by(name: name)
  #   end
  # end

  # def get_pull_requests(repo)
  #   client.pull_requests(repo)
  # end

  def self.make_pull_requests
    get_repos.each do |repo|
      client.pull_requests(repo).each do |pull|
       # repo.get_pull_requests.each do |pull|
      find_or_create_by(repo_name: pull.base.repo.name, repo_full_name: pull.base.repo.full_name, user_login: pull.user.login, pull_created_at: pull.created_at, pull_updated_at: pull.updated_at)
      end
    end
  end

  def self.top_pull_requests
    pull_counts_array = []
    student_pulls = Repository.group(:user_login).order("count_all DESC").calculate(:count, :all)
    users = student_pulls.keys
    pulls = student_pulls.values
    users.each_with_index do |user, i|
      pull_counts_array << ({:sDate =>"today", :sTime => "13:30", :sUsername => "@"+ user, :sTimeFrame => "week", :nPullRequests => pulls[i]}) 
    end
  pull_counts_array
  end

  def self.todays_pull_requests
    pull_counts_array = []
    student_pulls = Repository.where("pull_updated_at > ?", 1.days.ago).group(:user_login).order("count_all DESC").calculate(:count, :all)
    users = student_pulls.keys
    pulls = student_pulls.values
    users.each_with_index do |user, i|
      pull_counts_array << ({:sDate =>"today", :sTime => "13:30", :sUsername => "@"+ user, :sTimeFrame => "week", :nPullRequests => pulls[i]}) 
    end
  pull_counts_array
  end

  def self.week_ago_pull_requests
    pull_counts_array = []
    student_pulls = Repository.where("pull_updated_at > ?", 1.weeks.ago).group(:user_login).order("count_all DESC").calculate(:count, :all)
    users = student_pulls.keys
    pulls = student_pulls.values
    users.each_with_index do |user, i|
      pull_counts_array << ({:sDate =>"today", :sTime => "13:30", :sUsername => "@"+ user, :sTimeFrame => "week", :nPullRequests => pulls[i]}) 
    end
  pull_counts_array
  end
 
  # def self.top_pull_requests
  #   students = []
  #   self.all.each do |repo|
  #     user = repo.user_login
  #     pull_count = self.where(user_login: user).count
  #     students << ({:sDate =>"today", :sTime => "13:30", :sUsername => "@" + user, :sTimeFrame => "week", :nPullRequests => pull_count})
  #   end
  #   return students
  # end

  # def self.last_updated_pull
  #   students = []
  #   self.all.each do |repo|
  #     # binding.pry
  #     user = repo.user_login
  #     pull_date = self.where(user_login: user).pluck(:pull_updated_at)
  #     pull_date_max = pull_date.max
  #     pull_count = self.where(user_login: user).count
  #     students << ({:sDate =>"today", :sTime => "13:30", :sUsername => "@"+ user, :sTimeFrame => "week", :nPullRequests => pull_count})
  #     # pull_date.max
  #    end  
  #    students.uniq.sort_by{|student| student[:nPullRequests] }.reverse
  #    # binding.pry
  # end

  # def self.top_pull_requests
  #   students = []
  #   users = self.all.pluck(:user_login)
  #   users.uniq.each do |user|
  #     # binding.pry
  #     pull_count = users.count(user)
  #     students << ({:sDate =>"today", :sTime => "13:30", :sUsername => "@"+ user, :sTimeFrame => "week", :nPullRequests => pull_count})
  #   end
  #   students.sort_by {|student| student[:nPullRequests] }.reverse
  # end

  # Today 
   


# Last days 7 days  

# Today 


  def self.pull_request_by_user
    
    name_collection = Repository.all.collect do |repo|
      repo.user_login
    end

    name_used = []
    pull_data = []
    
    name_collection.each do |name|
      if !name_used.include? name
        name_used << name
        pull_data << {:name => name, :value => name_collection.count(name)}
      end
    end
    pull_data
  end
end

# repos.size
# repos.first.class
# repos.first.pull_requests
# repos.first
# repos.first.full_name  (This gives the full name)
# Octokit.pull_requests(“flatiron-school-students/rake-todo-ruby-004”)

# Octokit.pull_requests(repos.first.full_name)  repository name (This gives all pull request for pull)

# Octokit.pull_requests("flatiron-school-students/rake-todo-ruby-004").first.user.login (This gives user login)
# Octokit.pull_requests("flatiron-school-students/rake-todo-ruby-004").first.created_at (This gives user pull request creation date)
# Octokit.pull_requests("flatiron-school-students/rake-todo-ruby-004").first.updated_at (This gives user pull request creation date)
# Octokit.pull_requests("flatiron-school-students/rake-todo-ruby-004").first.base.repo.name
# Octokit.pull_requests("flatiron-school-students/rake-todo-ruby-004").first.base.repo.full_name





