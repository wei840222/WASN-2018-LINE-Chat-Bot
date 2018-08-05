# WASN 2018 LINE bot

## Person RESTful API  

**POST /api/Person**  
  
add a person data  
``` shell
curl -X POST https://wasn2018tw-bot.herokuapp.com/api/person \
-H "Content-Type:application/json" \
-d '{ "uid":"123", "id":1, "name":"劉傳銘", "school":"臺北科技大學", "email":"cmliu@ntut.edu.tw", "checkin":"2018-08-26 11:50", "dinner":"2018-08-26 19:00", "lunchBox":"2018-08-27 12:00" }'
``` 
    
**GET /api/Person**  
  
Get all person list  
``` shell
curl -X GET https://wasn2018tw-bot.herokuapp.com/api/person
```  
query a person data by query string  
``` shell
curl -X GET https://wasn2018tw-bot.herokuapp.com/api/person/?id=1
```  

**POST /api/Person/:_id**  
  
update a person data  
``` shell
curl -X POST https://wasn2018tw-bot.herokuapp.com/api/person/5b632c445c20a1003ca19804 \
-H "Content-Type:application/json" \
-d '{ "uid":"456" }'
``` 

**DELETE /api/Person/:_id**  
  
update a person data  
``` shell
curl -X DELETE https://wasn2018tw-bot.herokuapp.com/api/person/5b632c445c20a1003ca19804
``` 
  
**GET /api/Person:_id**  
  
Change a person resourxe status  
``` shell
curl -X GET https://wasn2018tw-bot.herokuapp.com/api/person/5b632c445c20a1003ca19804?checkin=2018-08-26 11:30&dinner=2018-08-26 19:30
```  
``` 
  
## ENV
  
``` shell
export CHANNEL_SECRET=YOUR_CHANNEL_SECRET
export CHANNEL_ACCESS_TOKEN=YOUR_CHANNEL_ACCESS_TOKEN
export BASE_URL=https://wasn2018tw-bot.herokuapp.com/
export MONGOLAB_URI=mongodb://user:pwd@xxx.mlab.com:1234/xxx
export NODE_ENV=production
export NPM_CONFIG_PRODUCTION=false
```
  
## Webhook URL  
https://wasn2018tw-bot.herokuapp.com/api/lineBot
