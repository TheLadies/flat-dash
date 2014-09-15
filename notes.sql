SELECT user_login, MAX(pull_updated_at), COUNT(id)
FROM repositories
GROUP BY user_login
ORDER BY user_login;



Repository.select(:user_login, 'MAX(pull_updated_at) AS last_updated', 'COUNT(id) AS num_pull_requests').group(:user_login).each do |repo|
  puts "#{repo.user_login}: #{repo.last_updated}, #{repo.num_pull_requests}"
end

Repository.select(:user_login, 'MAX(pull_updated_at) AS last_updated', 'COUNT(id) AS num_pull_requests').where("pull_updated_at > ?", 10.days.ago).group(:user_login).order('COUNT(id) DESC').each do |repo|
    puts "#{repo.user_login}: #{repo.last_updated}, #{repo.num_pull_requests}"
end


def self.todays_pull_requests
    pull_counts_array = []
    pull_dates = Repository.group(:user_login).order("pull_updated_at DESC").maximum(:pull_updated_at)
    student_pulls = Repository.where("pull_updated_at > ?", 1.days.ago).group(:user_login).order("count_all DESC").calculate(:count, :all)
    users = student_pulls.keys
    count = student_pulls.values
    last_pull = pull_dates
    users.each_with_index do |user, i|
      # changes data for todays pulls
        pull_counts_array << ({:sDate => last_pull[user].strftime("%F"), :sTime => last_pull[user].strftime("%R"), :sUsername => "@"+ user, :sTimeFrame => "DAY", :nPullRequests => count[i], :name => user, :value => count[i]})     
    end
    pull_counts_array
  end 

  Repository.select(:repo_name, 'MAX(pull_updated_at) AS last_updated', 'COUNT(id) AS num_pull_requests').group(:repo_name).order('COUNT(id) DESC').each do |repo|
    puts "#{repo.repo_name}: #{repo.last_updated}, #{repo.num_pull_requests}"
  end

  def self.top_repositories
    repository_array = []
    pull_dates = Repository.group(:repo_name).order("pull_updated_at DESC").maximum(:pull_updated_at)
    top_repository = Repository.group(:repo_name).order("count_all DESC").calculate(:count, :all)
    repos = top_repository.keys
    count = top_repository.values
    last_pull = pull_dates
    top_repository.keys.each_with_index do |repo, i|
      repository_array << ({:sDate => last_pull[repo].strftime("%F"), :sTime => last_pull[repo].strftime("%R"), :sRepository => repo, :sTimeFrame => "week", :nPullRequests => count[i]})     
    end
    repository_array
  end