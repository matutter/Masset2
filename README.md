Masset

Components  
--------------  
__Immovable__  

1. initializer.js
  > Setup instance variables and set module locals  
  > DB connections and being Cron jobs

2. server.js  
  > where connections are initialized; starts Socket handling or general POST/GET handling

3. router.js  
  > Determine how to route requests to the handler as defined by the initializer

4. handler.js  
  > Satisfies requests at the end of a pipe. 

__Optional__  
1. db_def.js  
2. form_parser.js  
3. scraper.js  
4. session.js  
5. socket_handler.js  
