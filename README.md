# WASN 2018 LINE bot

## Person RESTful API  

**POST /api/person**  
  
add a person data  
``` shell
curl -X POST SERVER_URL/api/person \
-H "Content-Type:application/json" \
-d '{ "id":1, "name":"王小明", "school":"讀大葉成大業", "phone":"0987654321", "vegetarian":false }'
``` 
    
**GET /api/person**  
  
Get all person list  
``` shell
curl -X GET SERVER_URL/api/person
```  
query a person data by query string  
``` shell
curl -X GET SERVER_URL/api/person/?id=1
```  

**POST /api/person/:_id**  
  
update a person data  
``` shell
curl -X POST SERVER_URL/api/person/5b632c445c20a1003ca19804 \
-H "Content-Type:application/json" \
-d '{ "uid":"456" }'
``` 

**DELETE /api/person/:_id**  
  
update a person data  
``` shell
curl -X DELETE SERVER_URL/api/person/5b632c445c20a1003ca19804
``` 
  
**GET /api/person:_id**  
  
Change a person resourxe status  
``` shell
curl -X GET SERVER_URL/api/person/5b632c445c20a1003ca19804?checkin=2018-08-26 11:30&dinner=2018-08-26 19:30
```   
  
**GET /api/config**  
  
Get config  
``` shell
curl -X GET SERVER_URL/api/config
```  

**POST /api/config**  
  
update config  
``` shell
curl -X POST SERVER_URL/api/config \
-H "Content-Type:application/json" \
-d '{ "lunchBox":"{"start":"2018-08-26 13:00:00", "end":"2018-08-26 14:00:00"}" }'
``` 

**POST /api/config/admins**  
  
Add admin user  
``` shell
curl -X POST SERVER_URL/api/config \
-H "Content-Type:application/json" \
-d '{ "userName": "xxx", "passwd": "xxx" }'
```  

**POST /api/config/admins/auth**  
  
update config  
``` shell
curl -X POST SERVER_URL/api/config \
-H "Content-Type:application/json" \
-d '{ "userName": "xxx", "passwd": "xxx" }'
``` 
  
## ENV
  
``` shell
export NPM_CONFIG_PRODUCTION=false
export BASE_URL=SERVER_URL
export MONGOLAB_URI=mongodb://user:pwd@xxx.mlab.com:1234/xxx
export CHANNEL_SECRET=YOUR_CHANNEL_SECRET
export CHANNEL_ACCESS_TOKEN=YOUR_CHANNEL_ACCESS_TOKEN
```
  
## Webhook URL  
SERVER_URL/api/lineBot
