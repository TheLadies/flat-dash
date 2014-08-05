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
    # binding.pry
    repos = client.org_repos("flatiron-school-students")
    repos.map do |repo|
      repo.full_name
      # repo.name
    end
  end

  def self.make_repos
    repos = get_repos
    repos.map do |name|
      find_or_create_by(name: name)
    end
  end

  def get_pull_requests
    client.pull_requests(name)
  end

  def self.make_pull_requests
    Repository.limit(2).all.each do |repo|
      repo.get_pull_requests.each do |pull|
      # binding.pry
      find_or_create_by(repo_name: pull.base.repo.name, repo_full_name: pull.base.repo.full_name, user_login: pull.user.login, created_at: pull.created_at, updated_at: pull.created_at)
      # puts repo.name
      # puts pull.user.login
      # puts pull.created_at
      # puts pull.updated_at
      # puts pull.base.repo.name
      # puts pull.base.repo.full_name
      end
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





