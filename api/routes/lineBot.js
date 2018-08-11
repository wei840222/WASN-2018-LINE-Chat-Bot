const { Router } = require('express')
const router = Router()
var Base64 = require('js-base64').Base64;
const axios = require('axios')
axios.defaults.baseURL = process.env.BASE_URL
const line = require('@line/bot-sdk')

// create LINE SDK config from env variables
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
}

// create LINE SDK client
const client = new line.Client(config)

// register a webhook handler with middleware
// about the middleware, please refer to doc
router.post('/lineBot', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err)
      res.status(500).end()
    })
})

// simple reply function
const replyText = (token, texts) => {
  texts = Array.isArray(texts) ? texts : [texts];
  return client.replyMessage(
    token,
    texts.map((text) => ({ type: 'text', text }))
  );
};

// callback function to handle a single event
function handleEvent(event) {
  switch (event.type) {
    case 'message':
      const message = event.message;
      switch (message.type) {
        case 'text':
          return handleText(message, event.replyToken, event.source);
        default:
          throw new Error(`Unknown message: ${JSON.stringify(message)}`);
      }

    case 'postback':
      if (event.postback.data.includes('checkin')) {
        const _id = event.postback.data.split("=")[1]
        axios.get(`/api/person/?_id=${_id}`).then(response => {
          if (response.data[0].checkin !== "") {
            client.replyMessage(
              event.replyToken,
              {
                type: 'text',
                text: '已經完成報到'
              }
            )
          }
          else {
            const now = new Date(Date.now());
            axios.post(`/api/person/${_id}`, {
              uid: event.source.userId,
              checkin: now.toLocaleString("zh-TW", {
                timeZone: "Asia/Taipei",
                hour12: false
              })
            }).then(response => {
              client.replyMessage(
                event.replyToken,
                {
                  type: 'text',
                  text: '報到成功！'
                }
              )
            })
          }
        })
      }
      return;

    case 'follow':
      client.getProfile(event.source.userId)
        .then(profile => replyText(
          event.replyToken,
          [
            `${profile.displayName} 您好！`,
            `歡迎蒞臨 WASN 2018`,
            `請點擊下方選單進行報到並查詢更多資訊`,
          ]
        ));
      return;

    default:
      throw new Error(`Unknown event: ${JSON.stringify(event)}`);
  }
}

function handleText(message, replyToken, source) {
  switch (message.text) {
    case '報到':
      client.getProfile(source.userId)
        .then(profile => {
          axios.get(`/api/person?uid=${profile.userId}`)
            .then(response => {
              if (response.data.length > 0 && response.data[0].checkin !== "") {
                client.replyMessage(
                  replyToken,
                  {
                    type: 'text',
                    text: '已經完成報到'
                  }
                )
                return
              }
              else {
                axios.get(`/api/person?name64=${Base64.encodeURI(profile.displayName)}`)
                  .then(response => {
                    if (response.data.length > 0 && response.data[0].name == profile.displayName) {
                      client.replyMessage(
                        replyToken,
                        {
                          type: 'template',
                          altText: '核對報到資訊',
                          template: {
                            type: 'buttons',
                            title: "核對報到資訊",
                            text: `姓名：${profile.displayName}\n單位：${response.data[0].school}\nemail：${response.data[0].email}`,
                            actions: [
                              { label: '正確', type: 'postback', data: `checkin=${response.data[0]._id}` },
                              { label: '這不是我', type: 'uri', uri: 'line://app/1597006048-DJnXQ8r2' }
                            ]
                          }
                        }
                      )
                      return
                    }
                    else {
                      client.replyMessage(
                        replyToken,
                        {
                          type: 'template',
                          altText: '核對報到資訊',
                          template: {
                            type: 'buttons',
                            title: "核對報到資訊",
                            text: `查無${profile.displayName}的資料`,
                            actions: [
                              { label: '輸入個人資訊報到', type: 'uri', uri: 'line://app/1597006048-DJnXQ8r2' }
                            ]
                          }
                        }
                      )
                      return
                    }
                  });
              }
            })
        })
        .catch(err => console.log(err))
    default:
      console.log(`Message from ${replyToken}: ${message.text}`);
  }
}

module.exports = router
