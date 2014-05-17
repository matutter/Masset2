MAPS 2.0
============
The second revision of My Asset Pipeline Server. 
Goal: Achieve a high level of general purpose backend code comparable to Express without a heavy reliance on external packages.

MAPS 1.0 will be a dedicated robot controller for the Pi. MAPS-RC

Required Packages
============
mongodb
socket.io
jade

DB create statements
============
1.	DB jade generated pages require a collection for each jade template
		db.home.insert({ title:"home page" })
2.	User authentication requires two collections, one for hashing last, another for users
		db.cipher.insert( name:"primary cipher", cipher:"xxxxxxxxxxxxxxxxxxxxxxxxxxx" )
		db.users.insert( name:"Space Ghost", admin:true, hash:"..." )


Session
============
Achieved by a 512byte token generator, tokens are retrieved through cookies.
This currently depends on socket.io to send cookies. 