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
    Repository.get_repos.each do |repo_name|
    binding.pry 
      client.commits(repo_name).each do |commit|
        commit.author.loging
      end
    end
  end

end

#user login - client.commits("flatiron-school-students/intro-to-carrierwave-ruby-005")[1].author.login
#user name - client.commits("flatiron-school-students/intro-to-carrierwave-ruby-005")[1].commit.author.name
#message - client.commits("flatiron-school-students/intro-to-carrierwave-ruby-005")[1].commit.message
#time - client.commits("flatiron-school-students/intro-to-carrierwave-ruby-005")[1].commit.committer.date

# client.commits("flatiron-school-students/intro-to-carrierwave-ruby-005")
#     client.commits(Repository.get_repos[0])
#     client.commits("flatiron-school-students/intro-to-carrierwave-ruby-005")[1].author.login
#     client.commits("flatiron-school-students/intro-to-carrierwave-ruby-005")[1].commit.message