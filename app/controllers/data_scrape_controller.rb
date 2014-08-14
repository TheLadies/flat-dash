class DataScrapeController < ApplicationController
  protect_from_forgery except: :solari_data
  def index
    @tweets = Tweet.all
  end

  def semester
      def solari_pull_semester
        json = Repository.top_pull_requests().to_json

        render json: json, callback: params[:callback]
      end
  end

  def week
    def solari_pull_week
      
      json = Repository.week_ago_pull_requests().to_json
      render json: json, callback: params[:callback]
    end
  end

  def day
    def todays_pull_requests
      json = Repository.todays_pull_requests().to_json

      render json: json, callback: params[:callback]
    end
  end

  def commits
    def latest_commit_messages
      json = Commit.latest_commit_messages().to_json

      render json: json, callback: params[:callback]
    end
  end

  def highlight
    def user_commits
      json = Commit.user_commits().to_json

      render json: json, callback: params[:callback]
    end
  end  

  def heart
    def list_of_users
      json = Repository.list_of_users().to_json

      render json: json, callback: params[:callback]
    end
  end

end