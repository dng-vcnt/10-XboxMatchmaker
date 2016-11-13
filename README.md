# XBox Live Matchmaker
### Find new players to team up with on XBox Live

XBox Live Matchmaker uses [XBoxAPI](https://xboxapi.com/) to find new matches for users based on their gamertag. The app finds friends of friends who are active on XBox Live and have similar gamerscores to the user.

### Technologies Used:
- HTML
- CSS
    + Bootstrap CSS
- Javascript
    + AngularJS
- Gulp
- [XBoxAPI](https://xboxapi.com/)


Use of XBoxAPI requires an API key, which the app expects as a value named "xboxKey". Users can sign up for a free or paid XboxAPI account [here](https://xboxapi.com/register).

After cloning and supplying an API key, run `bower install`, `npm install` and then `gulp serve` to run on localhost. Serving defaults to port 8080, which is configurable in the gulpfile in the 'connect' task.

## Screenshots

![Search](http://imgur.com/oCuUZwb.png)



![Results](http://imgur.com/nYQGcAQ.png)
