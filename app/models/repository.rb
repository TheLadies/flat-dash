class Repository < ActiveRecord::Base
  attr_reader :client

  def self.github_connection
    @client = Octokit::Client.new(access_token: ENV['GITHUB_TOKEN'], auto_traversal: true)
    @client.auto_paginate = true
  end


  def self.get_repos
    github_connection
    repos = @client.org_repositories("flatiron-school-students")
    repos.map do |repo|
      repo.name
    end
  end

  def self.make_repos
    repos = get_repos
    repos.map do |name|
      find_or_create_by(name: name)
    end
  end
end