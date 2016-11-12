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

var not_names = "^sprint$";
controller.hears([not_names], ['direct_message','direct_mention','mention'], function(bot, message) {
    bot.api.users.info({user:message.user}, (error, response) => {
        let user = response.user;

        if (user.name in sprint_keys) {
            let urls = sprint_keys[user.name];
            for (var sprint in urls) {
                bot.reply(message, "Your sprint(s), master: http://drive.google.com/open?id=" + urls[sprint]);
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
            bot.reply(message, "Your sprint(s), master: http://drive.google.com/open?id=" + urls[sprint]);
        }
    }
    else {
        bot.reply(message, "Who r u");
    }
});

controller.hears(['attach'],['direct_message','direct_mention'],function(bot,message) {

  var attachments = [];
  var attachment = {
    title: 'This is an attachment',
    color: '#FFCC99',
    fields: [],
  };

  attachment.fields.push({
    label: 'Field',
    value: 'A longish value',
    short: false,
  });

  attachment.fields.push({
    label: 'Field',
    value: 'Value',
    short: true,
  });

  attachment.fields.push({
    label: 'Field',
    value: 'Value',
    short: true,
  });

  attachments.push(attachment);

  bot.reply(message,{
    text: 'See below...',
    attachments: attachments,
  },function(err,resp) {
    console.log(err,resp);
  });
});

controller.hears(['dm me'],['direct_message','direct_mention'],function(bot,message) {
  bot.startConversation(message,function(err,convo) {
    convo.say('Heard ya');
  });

  bot.startPrivateConversation(message,function(err,dm) {
    dm.say('Private reply!');
  });

});
