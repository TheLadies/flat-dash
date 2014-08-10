
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
    pull_dates = Repository.group(:user_login).order("pull_updated_at DESC").maximum(:pull_updated_at)
    student_pulls = Repository.group(:user_login).order("count_all DESC").calculate(:count, :all)
    users = student_pulls.keys
    count = student_pulls.values
    last_pull = pull_dates
    users.each_with_index do |user, i|
      # changes data_scrape for semester pulls
        pull_counts_array << ({:sDate => last_pull[user].strftime("%F"), :sTime => last_pull[user].strftime("%R"), :sUsername => "@"+ user, :sTimeFrame => "SEMESTER", :nPullRequests => count[i], :name => user, :value => count[i]})     
    end
    pull_counts_array
  end


  def self.todays_pull_requests
    pull_counts_array = []
    pull_dates = Repository.group(:user_login).order("pull_updated_at DESC").maximum(:pull_updated_at)
    student_pulls = Repository.where("pull_updated_at > ?", 1.days.ago).group(:user_login).order("count_all DESC").calculate(:count, :all)
    users = student_pulls.keys
    count = student_pulls.values
    last_pull = pull_dates
    users.each_with_index do |user, i|
      # changes data for todays pulls
        pull_counts_array << ({:sDate => last_pull[user].strftime("%F"), :sTime => last_pull[user].strftime("%R"), :sUsername => "@"+ user, :sTimeFrame => "TODAY", :nPullRequests => count[i]})     
    end
    pull_counts_array
  end  

  def self.week_ago_pull_requests
    pull_counts_array = []
    pull_dates = Repository.group(:user_login).order("pull_updated_at DESC").maximum(:pull_updated_at)
    student_pulls = Repository.where("pull_updated_at > ?", 1.weeks.ago).group(:user_login).order("count_all DESC").calculate(:count, :all)
    users = student_pulls.keys
    count = student_pulls.values
    last_pull = pull_dates
    users.each_with_index do |user, i|
      # changes data for week pulls
        pull_counts_array << ({:sDate => last_pull[user].strftime("%F"), :sTime => last_pull[user].strftime("%R"), :sUsername => "@"+ user, :sTimeFrame => "WEEK", :nPullRequests => count[i]})     
    end
    pull_counts_array
  end

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

  def self.top_repositories
    repository_array = []
    pull_dates = Repository.group(:repo_name).order("pull_updated_at DESC").maximum(:pull_updated_at)
    top_repository = Repository.group(:repo_name).order("count_all DESC").calculate(:count, :all)
    repos = top_repository.keys
    count = top_repository.values
    last_pull = pull_dates
    top_repository.keys.each_with_index do |repo, i|
      repository_array << ({:sDate => last_pull[repo].strftime("%F"), :sTime => last_pull[repo].strftime("%R"), :sRepository => repo, :sTimeFrame => "week", :nPullRequests => count[i]})     
    end
    repository_array
  end

  def self.bottom_repositories
    repository_array = []
    pull_dates = Repository.group(:repo_name).order("pull_updated_at DESC").maximum(:pull_updated_at)
    bottom_repository = Repository.group(:repo_name).order("count_all ASC").calculate(:count, :all)
    repos = bottom_repository.keys
    count = bottom_repository.values
    last_pull = pull_dates
    bottom_repository.keys.each_with_index do |repo, i|
      repository_array << ({:sDate => last_pull[repo].strftime("%F"), :sTime => last_pull[repo].strftime("%R"), :sRepository => repo, :sTimeFrame => "week", :nPullRequests => count[i]})
    end
    repository_array     
  end

  def self.student_repo_names
    repository_array = []
    student_repos = Repository.select(:user_login, :repo_name).to_a.map(&:serializable_hash)
    student_repos.each do |student|
       repository_array << student["user_login"]+"/"+student["repo_name"]
    end
    repository_array
  end

  #This gets the branch name for all of the repos

  def self.branches 
    new_array = []
    student_repo_names.each do |repo_name|
      if Repository.client.repository?(repo_name) == true
        branch_name = Repository.client.branches(repo_name)
        if branch_name.length > 1 
          new_array << (branch_name.last.name)
        else 
          new_array << (branch_name.first.name)
        end
      end  
    end
    new_array
  end  

  # method to check if repository exists
  def self.repo
    repo_array = []
    student_repo_names.each do |repo_name|
      if Repository.client.repository?(repo_name)
        repo_array << repo_name
      end
    end
    repo_array
  end

  #method to get the branches

  def self.new_branches
    branches = Repository.client.branches("denineguy/fe-oo-atm-ruby-005")
    if branches.length > 1
      branches.last.name
    else 
      branches.first.name 
    end
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





