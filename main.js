// Getting the required packages

// FS, Discord.js, Axios and Node-fetch
const fs = require('node:fs')
const { Client, MessageEmbed, Intents } = require('discord.js');
const { token, napikey } = require('./config.json')
const axios = require('axios')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Creating a new Client
const client = new Client({
  intents: [Intents.FLAGS.GUILDS]
});

// When the client is ready, Send a message to console
// And define the status to 'WATCHING'
client.on('ready', () => {
  client.user.setActivity('The Cosmos', { type: 'WATCHING' });
  console.log('Ready!')
})

// Does the actual command handling
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;
	
	// APOD Command
	// Sends a astronomy-related picture
	// Different every day
	if (interaction.commandName === 'apod') {
		// Defines the URI and fetches the JSON
		let uri = `https://api.nasa.gov/planetary/apod?api_key=${napikey}`
		const result = await axios.get(uri).catch(error => {
		  console.log(error)
		})
		const res = result.data
	
		// Defining variables
		let cp = res.copyright;
		let date = res.date;
		let explanation = res.explanation;
		let img = res.hdurl;
		let title = res.title;
	
		// Creating a embed
		const apodembed = new MessageEmbed()
		  .setColor('#3d2aa3')
		  .setTitle(`${title}`)
		  .setAuthor({ name: 'APOD (Astronomy Picture of the Day)'})
		  .setDescription(`${explanation}`)
		  .setImage(`${img}`)
		  .setFooter({ text: `Powered by NASA | Copyright ${cp}©`})
	
		await interaction.reply({ embeds: [apodembed] })
	
		// IssData command
		// Sends RealTime data of the Iss
		// Has a 1 second ratelimit
	} else if (interaction.commandName === 'issdata') {
		
		// Defines the URI and fetches its data
		let uri = `https://api.wheretheiss.at/v1/satellites/25544`
		interaction.reply('Fetching data...') // Fix because discord is dumb and can only reply to interactions within a 3 second timeframe
		let response = await axios.get(uri).catch(err => {
		  console.log(err)
		})
		const res = response.data;
	
		// Defining some variables
		let lat = res.latitude;
		let lon = res.longitude;
	
		// Now getting where exactly it is
		let uri2 = `https://api.wheretheiss.at/v1/coordinates/25.314075430763,158.16841737358`
		let location = await fetch(uri2).catch(err => {
		  console.log(err)
		})
		const loc = await location.json();
	
		// Defining more variables
		let country = loc.country_code
		let timezone = loc.timezone_id
		let map = loc.mapurl
	
		// Creating the embed
		const issembed = new MessageEmbed()
		  .setColor('#3d2aa3')
		  .setAuthor({ name: 'Where is the ISS?'})
		  .addFields(
			{ name: 'Latitude', value: `${lat}`, inline: true},
			{ name: 'Longitude', value: `${lon}`, inline: true},
			{ name: 'Country Code', value: `${country}`, inline: true},
			{ name: 'Timezone', value: `${timezone}`, inline: true}
		  )
		  .setFooter({ text: 'Powered by WhereIsTheISS'})
		await interaction.editReply({ content: '_ _', embeds: [issembed] })
	
		// Roverimg command
		// Gets a random image from NASA's Curiosity Rover
	} else if (interaction.commandName === 'roverimg') {
		
		// Defines the URI and Fetches Data
		interaction.reply('Fetching data...') // Same fix from earlier
		let uri = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=${napikey}`
		let response = await axios.get(uri).catch(err => {
		  console.log(err)
		})
		const res = response.data;
		
		// Generates a random number from 1 to 500
		// This number is the amount of images in the bot
		// Meaning it's 500 images but it could be more
		// On my server its running with 1000 images
		let random = Math.floor(Math.random() * 500) + 1;

		// Definining the photo url in a variable
		let img = res.photos[random].img_src;
	
		// Creating a embed
		const curiosityembed = new MessageEmbed()
		  .setColor('#3d2aa3')
		  .setAuthor({ name: 'Curiosity'})
		  .setImage(`${img}`)
		  .setFooter({ text: 'Powered by NASA'})
		
		// Editing the message sent earlier
		await interaction.editReply({ content:"_ _", embeds: [curiosityembed] })
	}

});	

// Logs into the bot
client.login(token)
