// © Souravkl11 - Raganork MD™
/* Copyright (C) 2022 Sourav KL11.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
Raganork MD - Sourav KL11

const {Module} = require('../main');
Module({
    pattern: 'msgs ?(.*)',
    fromMe: true,
    desc:"Shows number of messages sent by each member. (Only from when bot was set up)"
}, (async (message, match) => {
    if (!message.isGroup) return await message.sendReply(Lang.GROUP_COMMAND)
    var m = message; var conn = message.client;
    let msgs = await conn.getMessages(m.jid);
    var users = (await conn.groupMetadata(m.jid)).participants.map(e=>e.id);
    if (message.mention[0]) users = message.mention;
    if (message.reply_message && !message.mention.length) users = message.reply_message.jid;
    function timeSince(date){var seconds=Math.floor((new Date()-date)/1000);var interval=seconds/31536000;if(interval>1){return Math.floor(interval)+" years ago"}
    interval=seconds/2592000;if(interval>1){return Math.floor(interval)+" months ago"}
    interval=seconds/86400;if(interval>1){return Math.floor(interval)+" days ago"}
    interval=seconds/3600;if(interval>1){return Math.floor(interval)+" hours ago"}
    interval=seconds/60;if(interval>1){return Math.floor(interval)+" minutes ago"}
    return Math.floor(seconds)+" seconds ago"};
    const flc = (x) => {
    if (x === "undefined") x = "others"
    try { return x.charAt(0).toUpperCase() + x.slice(1) } catch { return x }
    }
    let final_msg = "_Messages sent by each users_\n\n";
    for (let user of users){
    if (Object.keys(msgs).includes(user)){
    let count = msgs[user].total
    let name = msgs[user].name?.replace( /[\r\n]+/gm, "" )
    let lastMsg = timeSince(msgs[user].time)
    let types = msgs[user].type
    let types_msg = "\n"
    for (var type in types){
        types_msg+=`_${flc(type)}: *${types[type]}*_\n`
    } 
    final_msg+=`_Participant: *+${user.split("@")[0]}*_\n_Name: *${name}*_\n_Total msgs: *${count}*_\n_Last msg: *${lastMsg}*_${types_msg}\n\n`
}
}
return await m.sendReply(final_msg)
}))
Module({
    pattern: 'inactive ?(.*)',
    fromMe: true,
    desc:"Shows inactive members. (Only from when bot was set up)"
}, (async (message, match) => {
    if (!message.isGroup) return await message.sendReply(Lang.GROUP_COMMAND)
    var m = message; var conn = message.client;
    let msgs = await conn.getMessages(m.jid);
    var users = (await conn.groupMetadata(m.jid)).participants.map(e=>e.id);
    if (match[1]?.endsWith("days")){}
    if (match[1]?.endsWith("msgs")){}
    if (!match[1]){
    function timeSince(date){var seconds=Math.floor((new Date()-date)/1000);var interval=seconds/31536000;if(interval>1){return Math.floor(interval)+" years ago"}
    interval=seconds/2592000;if(interval>1){return Math.floor(interval)+" months ago"}
    interval=seconds/86400;if(interval>1){return Math.floor(interval)+" days ago"}
    interval=seconds/3600;if(interval>1){return Math.floor(interval)+" hours ago"}
    interval=seconds/60;if(interval>1){return Math.floor(interval)+" minutes ago"}
    return Math.floor(seconds)+" seconds ago"};
    const flc = (x) => {
    if (x === "undefined") x = "others"
    try { return x.charAt(0).toUpperCase() + x.slice(1) } catch { return x }
    }
    let final_msg = "_Messages sent by each users_\n\n";
    for (let user of users){
    if (Object.keys(msgs).includes(user)){
    let count = msgs[user].total
    let name = msgs[user].name?.replace( /[\r\n]+/gm, "" )
    let lastMsg = timeSince(msgs[user].time)
    let types = msgs[user].type
    let types_msg = "\n"
    for (var type in types){
        types_msg+=`_${flc(type)}: *${types[type]}*_\n`
    } 
    final_msg+=`_Participant: *+${user.split("@")[0]}*_\n_Name: *${name}*_\n_Total msgs: *${count}*_\n_Last msg: *${lastMsg}*_${types_msg}\n\n`
}}}
return await m.sendReply(final_msg)
}))
*/