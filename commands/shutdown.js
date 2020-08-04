/**
    Shuts down the Bot
    DOESNT WORK RN BECAUSE OF PERMISSIONS VOODOO
**/
module.exports = {
    name: 'shutdown',
    description: 'Shut Down Bot',
    execute(message, args, config, bot, library) {

        // //////// v THIS PART DOESNT WORK v
        // if(!message.member.hasPermission('ADMINISTRATOR')) {
        //     message.channel.send('You do not have permission to shut down this bot.');
        //     return;
        // }
        // //////// ^ THIS PART DOESNT WORK ^

        // message.channel.send('Shutting Down...').then(m => {
        //     client.destroy();
        // });
    },
};
