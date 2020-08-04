/**
    Restarts the Bot
    DOESNT WORK RN BECAUSE OF PERMISSIONS VOODOO
**/
module.exports = {
    name: 'restart',
    description: 'Restart Bot',
    execute(message, args, config, bot, library) {

        // //////// v THIS PART DOESNT WORK v
        // if(!message.member.hasPermission('ADMINISTRATOR')) {
        //     message.channel.send('You do not have permission to shut down this bot.');
        //     return;
        // }
        // //////// ^ THIS PART DOESNT WORK ^

        // message.channel.send('Restarting...').then(m => {
        //     bot.destroy().then(() => {
        //         bot.login(config.token);
        //     });
        // });
    },
};
