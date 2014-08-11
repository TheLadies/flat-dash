class Commit < ActiveRecord::Base
  attr_reader :client

  def self.client
    client = Octokit::Client.new(access_token: ENV['GITHUB_TOKEN'], auto_traversal: true)
    client.auto_paginate = true
    client
  end

  def client
    self.class.client
  end

  # Octokit.org_repositories('github')
  def self.get_commits
    Repository.get_repos
  end

  #This methods finds all of the commits for each repository and saves it to the database
  def self.make_commit_list
    get_commits.collect do |repo_name| 
      client.commits(repo_name).each do |commit_list|
        if commit_list.author
          # commit_list.commit.author.name
          find_or_create_by(user_login: commit_list.author.login, name: commit_list.commit.author.name, commit_message: commit_list.commit.message, commit_created_at: commit_list.commit.committer.date)
        end
      end
    end
  end

  #This method finds the top 10 users the highest commit count
  def self.top_commits_by_user
    commit_array = []
    Commit.order("commit_created_at DESC").maximum(:commit_message)
    commit_dates = Commit.group(:user_login).order("commit_created_at DESC").maximum(:commit_created_at)
    top_user_commits = Commit.group(:user_login).order("count_all DESC").calculate(:count, :all)
    users = top_user_commits.keys
    count = top_user_commits.values
    last_commit = commit_dates  
    users.each_with_index do |user, i|
      commit_array << ({:sDate => last_commit[user].strftime("%F"), :sTime => last_commit[user].strftime("%R"), :sUsername => "@"+ user, :sTimeFrame => "week", :nCommits => count[i]})
    end
    commit_array
  end

  #This method find the lastest commits by user and shows their commit message
  def self.latest_commit_messages
    commit_user = Commit.group(:user_login).select(:id).order("commit_created_at DESC").limit(15).maximum(:commit_created_at)
    commit_array = []
    commit_user.each do |user,date|
       messages = Commit.where("commit_created_at >= ?", date).find_by "user_login = ?", user
       commit_array << ({:sDate => date.strftime("%F"), :sTime =>date.strftime("%R"), :sUsername => messages.user_login, :sCommitMessage => messages.commit_message})
    end
    binding.pry
    commit_array
  end


end

# if sha != "master"
#   Commit.client.list_commits("denineguy/validating-user-forms-ruby-005")
# end
# Commit.client.list_commits("denineguy/validating-user-forms-ruby-005", sha: 'working')
#user login - client.commits("flatiron-school-students/intro-to-carrierwave-ruby-005")[1].author.login
#user name - client.commits("flatiron-school-students/intro-to-carrierwave-ruby-005")[1].commit.author.name
#message - client.commits("flatiron-school-students/intro-to-carrierwave-ruby-005")[1].commit.message
#time - client.commits("flatiron-school-students/intro-to-carrierwave-ruby-005")[1].commit.committer.date

# client.commits("flatiron-school-students/intro-to-carrierwave-ruby-005")
#     client.commits(Repository.get_repos[0])
#     client.commits("flatiron-school-students/intro-to-carrierwave-ruby-005")[1].author.login
#     client.commits("flatiron-school-students/intro-to-carrierwave-ruby-005")[1].commit.message


#The top 10 total commit counts by user
#The 10 lastest commits by user and the messages
#The 10 lastest commits by user and count 
#The latest commits for an individual and their messages  this one needs to be randomized