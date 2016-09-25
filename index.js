const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

// Setting the local port to 5000
app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function(req, res){
	res.send('Hi Im Meena! I am a mental health bot. Wanna chat?')
})

// Api.ai Developer Access token
var apiAiAccessToken = "Authorization: Bearer 60866a67074344dfad478b7c9c1a0b6a";

// Api.ai Client Access token
var apiClientAccessToken = "Authorization: Bearer ac5528abc9d742beae6d0334afcf2196";

// Access token
var token = "EAAXXMBeuMEgBAFhWhZBnSwdxBVze1MCKZA6M5wKgsnoWTT1G9S4mYrom2l8eWtSoMs0ymfjfAiZCzRNYn8lxPDOWgmbvEkWZAgBW40GTfC1yzTxSyaneG5HKdoQgSOiB7gZBwDog0oZCr94FBmAsUTEEVjtMLxLPfY8VNLa3atuAZDZD"

//for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})


// Adding API endpoint to process the messages
app.post('/webhook/', function(req, res){
	messaging_events = req.body.entry[0].messaging
	//var count = 0;
	var intro = Boolean(false)
	// var nameChosen = Boolean(false);
	var name

	for (i = 0; i < messaging_events.length; i++){
		event = req.body.entry[0].messaging[i]
		sender = event.sender.id
		if (event.message && event.message.text){
			sendGreeting(sender, "I'm Meena. What's your name?")
			text = event.message.text
			if (intro == false){
				intro = Boolean(true)
				name = event.message.text
				
				//sendGreeting(sender, "Hi there " + name + " how are you feeling?")
			}
			if (intro == true){
				sendGreeting(sender, "Nice to meet you, " + name + ". Say 'hi' if you want to continue the chat!")
				continue
			}
			
			// if (nameChosen == Boolean(true) && text == 'hi'){
			// 	sendGreeting(sender, "Hi " + name + ", how are you feeling?")

			// }
			
			// if (text === 'Help' || text === 'Sad'){
			// 	sendGreeting(sender, "Do you want to talk about it?")
			// 	continue
			// }

		}
		
		if (event.postback) {
	    	text = JSON.stringify(event.postback)
	    	sendGreeting(sender, "Postback received: " + text.substring(0, 200), token)
	    	continue
        }	
	}
	res.sendStatus(200)
})

// Send Greeting 
function sendGreeting(sender, text){
	messageData = {
		text:text
	}

	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body){
		if (error){
			console.log('Error sending messages: ', error)
		}
		else if (response.body.error){
			console.log('Error: ', response.body.error)
		}
	})
}

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})



















