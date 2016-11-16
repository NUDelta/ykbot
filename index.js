'use strict';

var Botkit = require('botkit');
var sprint_keys = require('./sprint_keys.js').module;

var token = process.env.SLACK_TOKEN;

var controller = Botkit.slackbot({
    retry: Infinity,
    debug: false
});

if (token) {
  console.log('Starting in single-team mode')
  controller.spawn({
    token: token
  }).startRTM(function (err, bot, payload) {
    if (err) {
      throw new Error(err)
    }

    console.log('Connected to Slack RTM')
  })
// Otherwise assume multi-team mode - setup beep boop resourcer connection
} else {
  console.log('Starting in Beep Boop multi-team mode')
  require('beepboop-botkit').start(controller, { debug: true })
}

controller.hears(['hello','hi'],['direct_message','direct_mention','mention'],function(bot,message) {
    bot.api.users.info({user:message.user}, (error, response) => {
        let user = response.user;

        if (user.name == "npr" || user.name == "yk") {
            bot.reply(message,{
                text: "Hello " + user.name + " ;)",
                username: "Audrey Hepburn",
                icon_emoji: ":audrey:",
            });
        }
        else {
            bot.reply(message, {
                text: "Woof!",
                username: "Stella",
                icon_emoji: ":stella:",
            });
        }

    })
});

controller.hears(['roman', 'rome', 'holiday'],['direct_message','direct_mention','mention'],function(bot,message) {
    bot.api.users.info({user:message.user}, (error, response) => {
        let user = response.user;

        if (user.name == "npr" || user.name == "yk") {
            let text = "I have to leave you now, Yongsung. I'm going to that corner there and turn. You must stay in the car and drive away. Promise not to watch me go beyond the corner, Yongsung. Just drive away and leave me as I leave you."

            bot.reply(message,{
                text: text,
                username: "Audrey Hepburn",
                icon_emoji: ":audrey:",
            });
        }
        else {
            bot.reply(message, {
                text: "Woof!",
                username: "Stella",
                icon_emoji: ":stella:",
            });
        }

    })
});

controller.hears(['fair', 'lady'],['direct_message','direct_mention','mention'],function(bot,message) {
    bot.api.users.info({user:message.user}, (error, response) => {
        let user = response.user;

        if (user.name == "npr" || user.name == "yk") {
            let text = "Just you wait, Yongsung Kim, just you wait. You'll be sorry, but your tears will be too late!"

            bot.reply(message,{
                text: text,
                username: "Audrey Hepburn",
                icon_emoji: ":audrey:",
            });
        }
        else {
            bot.reply(message, {
                text: "Woof!",
                username: "Stella",
                icon_emoji: ":stella:",
            });
        }

    })
});

controller.hears(['breakfast', 'tiffany'],['direct_message','direct_mention','mention'],function(bot,message) {
    bot.api.users.info({user:message.user}, (error, response) => {
        let user = response.user;

        if (user.name == "npr" || user.name == "yk") {
            let text = "I mean any gentleman with the slightest chic, Yongsung, will give a girl a fifty dollar bill for the powder room."

            bot.reply(message,{
                text: text,
                username: "Audrey Hepburn",
                icon_emoji: ":audrey:",
            });
        }
        else {
            bot.reply(message, {
                text: "Woof!",
                username: "Stella",
                icon_emoji: ":stella:",
            });
        }

    })
});

var not_names = "^sprint$";
controller.hears([not_names], ['direct_message','direct_mention','mention'], function(bot, message) {
    bot.api.users.info({user:message.user}, (error, response) => {
        let user = response.user;

        if (user.name in sprint_keys) {
            let urls = sprint_keys[user.name];
            for (var sprint in urls) {
                bot.reply(message, {
                    text: "Your sprint(s), master: http://drive.google.com/open?id=" + urls[sprint]),
                    icon_emoji: ":stella:"
                }
            }
        }
        else {
            bot.reply(message, "Who r u");
        }
    });
});

var names = "sprint (leesha|sameer|j-bunnie|ryanmadden|allisonsun|meg|kaldjian|alaina|kapil|npr|yk|slim|greg|katiegeorge)";
controller.hears([names], ['direct_message','direct_mention','mention'], function(bot, message) {
    let target = message.match[1];

    if (target in sprint_keys) {
        let urls = sprint_keys[target];
        for (var sprint in urls) {
            bot.reply(message, {
                text: "Your sprint(s), master: http://drive.google.com/open?id=" + urls[sprint]),
                icon_emoji: ":stella:"
            }
        }
    }
    else {
        bot.reply(message, "Who r u");
    }
});

controller.hears(['help'], ['direct_message', 'direct_mention', 'mention'], function(bot, message) {
    bot.api.users.info({user:message.user}, (error, response) => {
        let user = response.user;

        if (user.name == "yk") {
            let text = "Hi Yongsung ;) ask me about my movies!"
            bot.reply(message,{
                text: text,
                username: "Audrey Hepburn",
                icon_emoji: ":audrey:",
            });
        }
        else {
            let text = "Hi! Ask me `sprint`, and I can summon your sprint for you! Ask for `sprint <username>`, where `username` is someone's Slack username, and I'll get their sprint instead!"
            bot.reply(message, text);
        }
    });
});

controller.hears(['better', 'sasha', 'yongsung'], ['direct_message', 'direct_mention', 'mention'], function(bot, message) {
    bot.api.users.info({user:message.user}, (error, response) => {
        let user = response.user;

        if (user.name == "yk") {
            let text = "Sasha is so much cooler than you, Yongsung."
            bot.reply(message,{
                text: text,
                username: "Audrey Hepburn",
                icon_emoji: ":audrey:",
            });
        }
        else if (user.name == "npr") {
            let text = "Sasha, let's go on a Roman Holiday - without Yongsung."
            bot.reply(message,{
                text: text,
                username: "Audrey Hepburn",
                icon_emoji: ":audrey:",
            });
        }
        else {
            let text = "Woof woof! [I love everyone the same!]"
            bot.reply(message,{
                text: text,
                username: "Stella",
                icon_emoji: ":stella:",
            });
        }
    });
});
