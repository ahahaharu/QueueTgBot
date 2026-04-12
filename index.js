const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

require('dotenv').config();
const { bot } = require('./src/bot/bot');

bot.start();
