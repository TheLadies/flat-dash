class DataController < ApplicationController

    def index
        # Repository.get_repos
        # Repository.make_repos
        data = Repository.get_pull_requests

    end
end
