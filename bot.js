var tracery = require('tracery-grammar')
var Client = require('node-rest-client').Client
var Twit = require('twit')
var client = new Client()

var apiRoot = "http://poetrydb.org/"

var apiOptions =
{
	"origin": "#inputAndSearch#;#linecount#",
	"linecount": ["1", "2", "3", "4"],
	"inputAndSearch": [
		"author/#author#",
		"title/#noun#",
		"title/#noun.s#"
	],
	"noun": [
		"bird",
		"happiness",
		"sun",
		"night",
		"sweater",
		"boot",
		"leaf",
		"autumn",
		"foliage",
		"car",
		"tree",
		"flower",
		"boat",
		"water"
	],
	"author": [
		"shakespeare",
		"emily dickinson"
	]
}

var processedGrammar = tracery.createGrammar(apiOptions);

processedGrammar.addModifiers(tracery.baseEngModifiers);

var endpoint = processedGrammar.flatten("#origin#");
endpoint = apiRoot + endpoint

function makeTweet() {
	client.get(endpoint, (data, res) => {
		if (!data) {
			makeTweet()
		} else {
			var tweet = 'author: ' + data[0].author + '\n' + 'title: ' + data[0].title + '\n' + 'first line: ' + data[0].lines[0] + '...'
			var T = new Twit(
			{
			    consumer_key:         process.env.TWITTER_CONSUMER_KEY
			  , consumer_secret:      process.env.TWITTER_CONSUMER_SECRET
			  , access_token:         process.env.TWITTER_ACCESS_TOKEN
			  , access_token_secret:  process.env.TWITTER_ACCESS_TOKEN_SECRET
			}
			)


			T.post('statuses/update', { status: tweet }, function(err, data, response) {
			  // console.log(data)
				// console.log(err)
				// console.log(response)
			})
		}
	})
}

makeTweet()
