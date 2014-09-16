
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
        find_or_create_by(repo_name: pull.base.repo.name, repo_full_name: pull.base.repo.full_name, user_login: pull.user.login, pull_created_at: pull.created_at, pull_updated_at: pull.updated_at)
      end
    end
  end

# #sqlite3 arel method 
#   def self.top_pull_requests 
#     pull_counts_array = []
#     pull_dates = Repository.select(:user_login).group(:user_login).order("pull_updated_at DESC").maximum(:pull_updated_at)
#     student_pulls = Repository.group(:user_login).order("count_all DESC").calculate(:count, :all)
#     users = student_pulls.keys
#     count = student_pulls.values
#     last_pull = pull_dates
#     users.each_with_index do |user, i|
#       pull_counts_array << ({:sDate => last_pull[user].strftime("%F"), :sTime => last_pull[user].strftime("%R"), :sUsername => "@"+ user, :sTimeFrame => "SEMESTER", :nPullRequests => count[i], :name => user, :value => count[i]})     
#     end
#     pull_counts_array
#   end

#   # sqlite3 arel method
#   def self.todays_pull_requests
#     pull_counts_array = []
#     pull_dates = Repository.group(:user_login).order("pull_updated_at DESC").maximum(:pull_updated_at)
#     student_pulls = Repository.where("pull_updated_at > ?", 1.days.ago).group(:user_login).order("count_all DESC").calculate(:count, :all)
#     users = student_pulls.keys
#     count = student_pulls.values
#     last_pull = pull_dates
#     users.each_with_index do |user, i|
#       # changes data for todays pulls
#         pull_counts_array << ({:sDate => last_pull[user].strftime("%F"), :sTime => last_pull[user].strftime("%R"), :sUsername => "@"+ user, :sTimeFrame => "DAY", :nPullRequests => count[i], :name => user, :value => count[i]})     
#     end
#     pull_counts_array
#   end 

#   # sqlite3 arel method
#   def self.week_ago_pull_requests
#     pull_counts_array = []
#     pull_dates = Repository.group(:user_login).order("pull_updated_at DESC").maximum(:pull_updated_at)
#     student_pulls = Repository.where("pull_updated_at > ?", 1.weeks.ago).group(:user_login).order("count_all DESC").calculate(:count, :all)
#     users = student_pulls.keys
#     count = student_pulls.values
#     last_pull = pull_dates
#     users.each_with_index do |user, i|
#       # changes data for week pulls
#       pull_counts_array << ({:sDate => last_pull[user].strftime("%F"), :sTime => last_pull[user].strftime("%R"), :sUsername => "@"+ user, :sTimeFrame => "WEEK", :nPullRequests => count[i], :name => user, :value => count[i]})     
#     end
#     pull_counts_array
#   end

#   # sqlite3 arel method
#   def self.top_repositories
#     repository_array = []
#     pull_dates = Repository.group(:repo_name).order("pull_updated_at DESC").maximum(:pull_updated_at)
#     top_repository = Repository.group(:repo_name).order("count_all DESC").calculate(:count, :all)
#     repos = top_repository.keys
#     count = top_repository.values
#     last_pull = pull_dates
#     top_repository.keys.each_with_index do |repo, i|
#       repository_array << ({:sDate => last_pull[repo].strftime("%F"), :sTime => last_pull[repo].strftime("%R"), :sRepository => repo, :sTimeFrame => "week", :nPullRequests => count[i]})     
#     end
#     repository_array
#   end


#   # sqlite3 arel method
#   def self.bottom_repositories
    # repository_array = []
#     pull_dates = Repository.group(:repo_name).order("pull_updated_at DESC").maximum(:pull_updated_at)
#     bottom_repository = Repository.group(:repo_name).order("count_all ASC").calculate(:count, :all)
#     repos = bottom_repository.keys
#     count = bottom_repository.values
#     last_pull = pull_dates
#     bottom_repository.keys.each_with_index do |repo, i|
#       repository_array << ({:sDate => last_pull[repo].strftime("%F"), :sTime => last_pull[repo].strftime("%R"), :sRepository => repo, :sTimeFrame => "week", :nPullRequests => count[i]})
#     end
#     repository_array     
#   end

  #This method is for the heart/floating dot page 
  def self.list_of_users
    user_list = []

    student_pulls = Repository.group(:user_login).order("count_all DESC").calculate(:count, :all)
    users = student_pulls.keys

    users.each_with_index do |user, i|
      user_list << ({:id => rand(0..6), :name => user, :r => rand(15..75)})     
    end
    user_list
  end
  

  # def self.top_pull_requests
    pull_counts_array = []
    pull_dates = Repository.select(:user_login, 'MAX(pull_updated_at) AS last_updated', 'COUNT(id) AS num_pull_requests').group(:user_login).order('COUNT(id) DESC')
    pull_dates.each do |repo|
      pull_counts_array << ({:sDate => repo.last_updated.to_datetime.strftime("%F"), :sTime => repo.last_updated.to_datetime.strftime("%R"), :sUsername => "@"+ "#{repo.user_login}", :sTimeFrame => "SEMESTER", :nPullRequests => "#{repo.num_pull_requests}", :name => "#{repo.user_login}", :value => "#{repo.num_pull_requests}"})     
    end
    pull_counts_array  
  end


  def self.todays_pull_requests  # changes data for todays pulls
    pull_counts_array = []
    pull_dates = Repository.select(:user_login, 'MAX(pull_updated_at) AS last_updated', 'COUNT(id) AS num_pull_requests').where("pull_updated_at > ?", 1.days.ago).group(:user_login).order('COUNT(id) DESC')
    pull_dates.each do |repo|
      puts "#{repo.user_login}: #{repo.last_updated}, #{repo.num_pull_requests}"
        pull_counts_array << ({:sDate => repo.last_updated.to_datetime.strftime("%F"), :sTime => repo.last_updated.to_datetime.strftime("%R"), :sUsername => "@"+ "#{repo.user_login}", :sTimeFrame => "DAY", :nPullRequests => "#{repo.num_pull_requests}", :name => "#{repo.user_login}", :value => "#{repo.num_pull_requests}"})     
    end
    pull_counts_array
  end  

# changes data for 1 week pulls
  def self.week_ago_pull_requests  
    pull_counts_array = []
    pull_dates = Repository.select(:user_login, 'MAX(pull_updated_at) AS last_updated', 'COUNT(id) AS num_pull_requests').where("pull_updated_at > ?", 1.weeks.ago).group(:user_login).order('COUNT(id) DESC')
    pull_dates.each do |repo|
      puts "#{repo.user_login}: #{repo.last_updated}, #{repo.num_pull_requests}"
        pull_counts_array << ({:sDate => repo.last_updated.to_datetime.strftime("%F"), :sTime => repo.last_updated.to_datetime.strftime("%R"), :sUsername => "@"+ "#{repo.user_login}", :sTimeFrame => "WEEK", :nPullRequests => "#{repo.num_pull_requests}", :name => "#{repo.user_login}", :value => "#{repo.num_pull_requests}"})     
    end
    pull_counts_array
  end

  def self.top_repositories
    repository_array = []
    pull_dates = Repository.select(:repo_name, 'MAX(pull_updated_at) AS last_updated', 'COUNT(id) AS num_pull_requests').group(:repo_name).order('COUNT(id) DESC')
    pull_dates.each do |repo|
      repository_array << ({:sDate => repo.last_updated.to_datetime.strftime("%F"), :sTime => repo.last_updated.to_datetime.strftime("%R"), :sRepository => "@"+ "#{repo.repo_name}", :sTimeFrame => "WEEK", :nPullRequests => "#{repo.num_pull_requests}", :name => "#{repo.repo_name}", :value => "#{repo.num_pull_requests}"})     
    end
    repository_array
  end

  def self.bottom_repositories
    repository_array = []
    pull_dates = Repository.select(:repo_name, 'MAX(pull_updated_at) AS last_updated', 'COUNT(id) AS num_pull_requests').group(:repo_name).order('COUNT(id)')
    pull_dates.each do |repo|
      repository_array << ({:sDate => repo.last_updated.to_datetime.strftime("%F"), :sTime => repo.last_updated.to_datetime.strftime("%R"), :sRepository => "@"+ "#{repo.repo_name}", :sTimeFrame => "WEEK", :nPullRequests => "#{repo.num_pull_requests}", :name => "#{repo.repo_name}", :value => "#{repo.num_pull_requests}"})     
    end
    repository_array     
  end


  # def self.pull_request_by_user #//can get rid of 
    
  #   name_collection = Repository.all.collect do |repo|
  #     repo.user_login
  #   end

  #   name_used = []
  #   pull_data = []
    
  #   name_collection.each do |name|
  #     if !name_used.include? name
  #       name_used << name
  #       pull_data << {:name => name, :value => name_collection.count(name)}
  #     end
  #   end
  #   pull_data
  # end

end

# Octokit.pull_requests(repos.first.full_name)  repository name (This gives all pull request for pull)
# Octokit.pull_requests("flatiron-school-students/rake-todo-ruby-004").first.user.login (This gives user login)

# repo, read:org, read:repo_hook, user 



