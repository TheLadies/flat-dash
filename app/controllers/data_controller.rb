class DataController < ApplicationController

    def index
      # Repository.get_repos
      # Repository.make_repos
      # Repository.make_pull_requests
      @pull_count = Repository.pull_request_by_user

      respond_to do |f|
        f.html {render "#{params[:id]}.html"}
        f.json {render json: @pull_count }
      end
    end

    def show
      @pull_count = Repository.pull_request_by_user

      respond_to do |f|
        f.html {render "#{params[:id]}.html"}
        f.json {render json: @pull_count }
      end
    end

end
