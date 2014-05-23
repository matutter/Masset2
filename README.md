Masset2
============
The second revision of My Asset Pipeline Server. 
Goal: Achieve a high level of general purpose backend code comparable to Express without a heavy reliance on external packages.

MAPS 1.0 will be a dedicated robot controller for the Pi. MAPS-RC

Required Packages
============
mongodb
socket.io
jade

DB setup
============
DB jade generated pages require a collection for each jade template
```JavaScript
db.home.insert({ title:"home page" })
```

User authentication requires two collections, one for hashing last, another for users
```JavaScript
db.cipher.insert( name:"primary cipher", cipher:"xxxxxxxxxxxxxxxxxxxxxxxxxxx" )
db.users.insert( name:"Space Ghost", admin:true, hash:"..." )
```

Session
============
Achieved by a 512byte token generator. <br>
Client-side tokens are stored in cookies. <br>
This currently depends on socket.io to send cookies. <br> 
```JavaScript
db.sessions.create({ backup:"last", sessionData:null })
```
