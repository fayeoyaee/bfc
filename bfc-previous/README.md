## Set up

### Mongod
Run mongod to handle data requests, access, and management: 

```
mongod [--dbpath dir/you/save/mongo/instance] [--port 27017]
```

### Mongo
Run mongo shell to perform data queries and update: 

```
mongo [--port 27017]
```

If you check database, you should see:

```
> show dbs
bfc
> use bfc
> show collections
users
> db.users.find()
{ ... }
```

###Clean shutdown Mongod
```
ps -ax | grep mongo
kill [mongo process id] 
```

###Set up Express server
```
nodemon server.js
```

###Heroku 
Deployed on [Heroku](https://afternoon-spire-73592.herokuapp.com)