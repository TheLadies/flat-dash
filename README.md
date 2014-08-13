# Flat Dash

## Description

Flatdash is a dashboard for the Flatiron School, which provides a leaderboard for students with the most pull requests from GitHub, for the day, week and semester. The dashboard also provides a leaderboard for the commits submitted by students throughout the semester.

## Screenshots
![Pull Request Leaderboard](/public/images/pull_request.png)
</br>
![Commit Leaderboard](/public/images/commit.png)


## Background

The instructors at the Flatiron School had been seeking to implement a dashboard to better understand students progress and get some insight into their behavior with using GitHub. We decided to take on this task to learn more about the Github API and Data visualization along with being able to provide back to the school that has taught us so much by providing them a useful tool to help better educate students.

Why did you want to make this app? What was your development process
like?

## Features

- GitHub API was use to pull Git information for current students
- D3.js is used to visualize the pull request and commit information of the students
- Fog Creek's Solari dashboard is used to the Leaderboard information
- Cron Job is implemented to update the information hourly.

## Usage

How do users use your app?

The application is a dashboard that can be accessed via the web or broadcast over can be displayed over tv and the information can be cycled through utilizing auto scrolling.  This application purely provides information to the user. 

## Development/Contribution

Users are welcomed to fix or update and code they feel are causing bugs.  User are also able to suggest or code other features to this application, especially if their are other ideas for data that can be presented to the entire Flatiron school community.

Explain how people can contribute to your app. How should they write tests?
Any things in particular you'd like to see in pull requests?

## Future

We are currently working on implementing a view that will show the top repositories with pull request,  We are looking for ways to speed up the Solari grid so the information can be provided to the user quicker.  We are also currently working automate refreshing the date more frequently than every hour.

What features are you currently working on? Only mention things that you
actually are implementing. No pie-in-the-sky-never-gonna-happen stuff.

## Author

Denine Guy blog:denineguy.github.io  twitter:@sashaydoll
Christina Leuci blog:  twitter:@ChristinaLeuci
Jessica Rudder blog:   twitter:@JessRudder

## License

Flat Dash is MIT Licensed. See LICENSE for details.