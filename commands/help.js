/**
    Display a help message with Discord markdown
**/
module.exports = {
    name: 'help',
    description: 'Help Message',
    cooldown: 3,
    execute(message, args, config, bot, db) {
        message.channel.send(`\`\`\`ini
            \n[Command Prefix]: ${config.prefix}\`\`\`\n\`\`\`bash
            \n\"help\": Display help message.
            \n\"library\", (alias -> lib , games , list): List your game library.
            \n\"add <game name> | ... | <game name>\", (alias -> +): Add game(s) to your library.
            \n\"getsteamgames <steam_id>\", (alias -> addsteam): Add all steam games to your library.
            \n\"remove <index>,...,<index>\", (alias -> - , delete): Remove game(s) from your library.
            \n\"removeall\", (alias -> clear): Remove your entire library.
            \n\"compare <optional_g>\", (alias -> comp , shared): Compare libraries of users connected to the same voice channel. Use \`compare g\` to add in the shared guild library.
            \n\"guildlibrary\", (alias -> libg , gamesg , listg): List your guild's shared multiplayer library.
            \n\"guildadd <game name> | ... | <game name>\", (alias -> +g , addg): Add game(s) to your guild\'s shared multiplayer library.
            \n\"guildremove <index>,...,<index>\", (alias -> -g , deleteg): Remove game(s) from your guild\'s shared multiplayer library.
        \`\`\``);
    },
};
