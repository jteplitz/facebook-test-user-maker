# Facebook Test User Maker

Just a simple script to create FB test users. You just need to copy the config.json.example to config.json and add your app's facebook id and facebook secret to it. You can get that on facebook app's developer page for your app. Then, just:

    npm install
    node app

And it should return you a few fields. You can grab the login url and that'll log you in as that user. Voila! 

If you want to know more:

https://developers.facebook.com/docs/test_users/

A few things didn't seem to work for me at the time of writing, that is, you can pass in a --name field on the commandline which will get passed to FB, but it does not seem to actually name the new user that. Also, the return results should contain an email and password that you can use to log in manually - that isn't currently in the return. C'est la vie.



