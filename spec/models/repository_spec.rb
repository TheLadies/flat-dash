require 'rails_helper'

describe Repository do
  describe "#self.make_pull_requests" do
    it "creates repositories from flatiron school organization" do
      Repository.make_pull_requests
      repository = Repository.find_by(name: 'rake-todo-ruby-005')
      repo_name = repository.name
      expect(repo_name).to eq 'rake-todo-ruby-005'
    end
  end
end