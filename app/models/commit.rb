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

  def self.student_repos
    StudentRepository.select(:student_repo_name, :branch).to_a.map(&:serializable_hash)
  end

  #This methods finds all of the commits for each repository and saves it to the database
  def self.make_commit_list
    student_repos.collect do |student|
      client.commits(student["student_repo_name"], student["branch"]).each do |commit_list|
        if commit_list.author
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
       commit_array << ({:sDate => date.strftime("%F"), :sTime =>date.strftime("%R"), :sUsername => messages.user_login, :sCommitMessage => messages.commit_message, :sTimeFrame => "EVERYONE"})
    end
    commit_array
  end

  # This method picks one user at a time and shows their last 10 commit messages
  def self.user_commits
    commit_array = []
    user_logins = Commit.pluck(:user_login).uniq 
    login = user_logins.sample
    messages = Commit.where("user_login = ?", login).order("commit_created_at DESC").select(:user_login, :commit_message, :commit_created_at).limit(15)
    messages.each do |message|
      commit_array << ({:sDate => message.commit_created_at.strftime("%F"), :sTime =>message.commit_created_at.strftime("%R"),:sUsername => message.user_login, :sCommitMessage => message.commit_message, :sTimeFrame => message.user_login})
    end
    commit_array
  end

end


#Commit.client.list_commits("denineguy/validating-user-forms-ruby-005", 'working')
#The top 10 total commit counts by user
#The 10 lastest commits by user and the messages
#The 10 lastest commits by user and count 
#The latest commits for an individual and their messages  this one needs to be randomized