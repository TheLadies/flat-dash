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

  def self.make_commit_list
    get_commits.collect do |repo_name| 
      client.commits(repo_name).each do |commit_list|
        binding.pry
        if commit_list.author
          commit_list.commit.author.name
          # find_or_create_by(user_login: commit_list.author.login, name: commit_list.commit.author.name, commit_message: commit_list.commit.message, commit_created_at: commit_list.commit.committer.date)
        end
      end
    end.flatten
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