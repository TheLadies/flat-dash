class StudentRepository < ActiveRecord::Base
  attr_reader :client

  def self.client
    client = Octokit::Client.new(access_token: ENV['GITHUB_TOKEN'], auto_traversal: true)
    client.auto_paginate = true
    client
  end

  def client
    self.class.client
  end
  # this method creates the full name of the repos, may get rid of 
  def self.construct_names
    repository_array = []
    student_repos = Repository.select(:user_login, :repo_name).to_a.map(&:serializable_hash)
    student_repos.each do |student|
       repository_array << student["user_login"]+"/"+student["repo_name"]
    end
    repository_array
  end

   # method to check if repository exists
  def self.student_repos
    repo_array = []
    repo_total = construct_names.length
    construct_names.each_with_index do |repo_name, i|
      if client.repository?(repo_name)
        repo_array << repo_name
      end
      # puts i.to_s + ":" + repo_total.to_s
    end
    repo_array
  end

  #method to get the branches

  # def self.new_branches
  #   branches = Repository.client.branches("denineguy/fe-oo-atm-ruby-005")
  #   if branches.length > 1
  #     branches.last.name
  #   else 
  #     branches.first.name      
  #   end
  # end

  #method to get the branches
  # def self.branches 
  #   new_array = []
  #   # student_repo_names.each do |repo_name|

  #     student_repos.each do |repo_name|
  #     binding.pry
  #     branch_name = client.branches(repo_name)
  #     if branch_name.length > 1 
  #       new_array << ({repo_name => branch_name.last.name})
  #     else 
  #       new_array << ({repo_name => branch_name.first.name})
  #     end
  #   end  
  #   new_array
  # end  

  def self.branches 
    new_array = []
    # student_repo_names.each do |repo_name|
    student_repos.each do |repo_name|
      branch_name = client.branches(repo_name)
      if branch_name.length > 1 
        find_or_create_by(student_repo_name: repo_name, branch: branch_name.last.name)
      else 
        find_or_create_by(student_repo_name: repo_name, branch: branch_name.last.name)
      end
    end  
    # new_array
  end  

end
