const fs = require('node:fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');
const { SlashCommandBuilder } = require('@discordjs/builders');

const commands = [
	new SlashCommandBuilder()
    	.setName('apod')
    	.setDescription('Sends a astronomy picture. New one each day'),
	new SlashCommandBuilder()
		.setName('roverimg')
		.setDescription('Sends a picture from Curiosity'),
	new SlashCommandBuilder()
		.setName('issdata')
		.setDescription('Sends real-time data of the ISS'),
	new SlashCommandBuilder()
		.setName('planetinfo')
		.setDescription('Sends info about each planet in the Solar System') 
		.addStringOption(option =>
		  	option
		  		.setName('planet')
		  		.setDescription('The planet you want info about')
		  		.setRequired(true)
		  		.addChoices({
					name: 'Mercury',
					value: 'mercury'
		  		}, {
					name: 'Venus',
					value: 'venus'
		  		}, {
					name: 'Earth',
					value: 'earth'
		  		}, {
					name: 'Mars',
					value: 'mars'
		  		}, {
					name: 'Jupiter',
					value: 'jupiter'
		  		}, {
					name: 'Saturn',
					value: 'saturn'
		  		}, {
					name: 'Uranus',
					value: 'uranus'
		  		}, {
					name: 'Neptune',
					value: 'neptune'
		  		})
		),	
]	
	.map(command => command.toJSON())

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();