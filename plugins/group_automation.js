/* Copyright (C) 2022 Sourav KL11.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
Raganork MD - Sourav KL11
*/
const {
    isAdmin,
    isFake,
    delAntifake,
    getAntifake,
    setAntifake,
    parseWelcome
} = require('./misc/misc');
const {
    setAutoMute,
    setAutounMute,
    delAutounMute,
    delAutoMute,
    stickCmd,
    getSticks,
    unstickCmd
} = require('./misc/scheduler');
const greeting = require('./sql/greeting');
const {
    Module
} = require('../main')
const {
    ALLOWED
} = require('../config');
function tConvert(time) {
  time = time.toString ().match (/^([01]\d|2[0-3])( )([0-5]\d)(:[0-5]\d)?$/) || [time];
 if (time.length > 1) { 
    time = time.slice (1); 
    time[5] = +time[0] < 12 ? ' AM' : ' PM';
    time[0] = +time[0] % 12 || 12; 
  }
  return time.join(''). replace(" ",":");
}
function extractData(message){
    function _0x57c1(){var _0x2f689b=['1977013HYBCnd','fro','9xZywpG','rep','sag','cke','60XVZqVR','172sWIHaq','eSh','a25','9415000SiXvgI','398391JAPBPU','3795048xxCDVd','tri','ssa','2217193WDvnhr','ted','Mes','ify','toS','ing','90wKQePx','fil','11535QpHZKH','str','mes','bas','rMe','7468312GweHmQ','quo'];_0x57c1=function(){return _0x2f689b;};return _0x57c1();}function _0x4b66(_0x2e1c47,_0x5c2c64){var _0x57c1dc=_0x57c1();return _0x4b66=function(_0x4b662d,_0x46f625){_0x4b662d=_0x4b662d-0xbf;var _0x10c81e=_0x57c1dc[_0x4b662d];return _0x10c81e;},_0x4b66(_0x2e1c47,_0x5c2c64);}var _0xaaea1f=_0x4b66;(function(_0x11da5f,_0x33f29f){var _0x37b4ef=_0x4b66,_0x8e5318=_0x11da5f();while(!![]){try{var _0x21371c=parseInt(_0x37b4ef(0xd7))/0x1+parseInt(_0x37b4ef(0xc0))/0x2*(-parseInt(_0x37b4ef(0xd0))/0x3)+-parseInt(_0x37b4ef(0xc5))/0x4+-parseInt(_0x37b4ef(0xc3))/0x5+parseInt(_0x37b4ef(0xbf))/0x6*(-parseInt(_0x37b4ef(0xc4))/0x7)+-parseInt(_0x37b4ef(0xd5))/0x8*(-parseInt(_0x37b4ef(0xd9))/0x9)+-parseInt(_0x37b4ef(0xce))/0xa*(-parseInt(_0x37b4ef(0xc8))/0xb);if(_0x21371c===_0x33f29f)break;else _0x8e5318['push'](_0x8e5318['shift']());}catch(_0x2c649b){_0x8e5318['push'](_0x8e5318['shift']());}}}(_0x57c1,0xf2721));return Buffer[_0xaaea1f(0xd8)+'m'](JSON[_0xaaea1f(0xd1)+_0xaaea1f(0xcd)+_0xaaea1f(0xcb)](message[_0xaaea1f(0xda)+'ly_'+_0xaaea1f(0xd2)+_0xaaea1f(0xdb)+'e']['dat'+'a'][_0xaaea1f(0xd6)+_0xaaea1f(0xc9)+_0xaaea1f(0xca)+_0xaaea1f(0xdb)+'e']['sti'+_0xaaea1f(0xdc)+_0xaaea1f(0xd4)+_0xaaea1f(0xc7)+'ge'][_0xaaea1f(0xcf)+_0xaaea1f(0xc1)+_0xaaea1f(0xc2)+'6']))[_0xaaea1f(0xcc)+_0xaaea1f(0xc6)+'ng'](_0xaaea1f(0xd3)+'e64');
};
Module({
    pattern: "stickcmd ?(.*)",
    fromMe: true,
    desc:"Sticks commands on stickers. And if that sticker is sent, it will work as a command!",
    usage:".stickcmd kick",
    warn: "Only works on stickers",
    use: 'utility'
}, async (message, match) => {
if (!match[1] || !message.reply_message || !message.reply_message.sticker) return await message.sendReply("_Reply to a sticker_\n_Ex: *.stickcmd kick*_")
try { await stickCmd(extractData(message),match[1]); } catch {return await message.sendReply("_Failed!_")}
await message.client.sendMessage(message.jid,{text:`_Sticked command ${match[1]} to this sticker! Reconnecting..._`},{quoted:message.quoted});
});
Module({
    pattern: "unstick ?(.*)",
    fromMe: true,
    desc:"Deletes sticked commands on stickers",
    usage:".unstick kick",
    use: 'utility'
}, async (message, match) => {
if (!match[1]) return await message.sendReply("_Need command!_\n_Ex: *.unstick kick*_")
try { await unstickCmd(match[1]); } catch {return await message.sendReply("_Failed!_")}
return await message.sendReply(`_Removed ${match[1]} from sticked commands!_`)
});
    Module({
    pattern: "automute ?(.*)",
    fromMe: true,
    warn: "This works according to IST (Indian standard time)",
    use: 'group'
}, async (message, match) => {
if (!match[1]) return await message.sendReply("*Wrong format!*\n*.automute 22 00 (For 10 PM)*\n*.automute 06 00 (For 6 AM)*\n*.automute off*");
if (match[1]==="off") {
await delAutoMute(message.jid);
return await message.sendReply("*Automute has been disabled in this group ❗*");       
}  
var mregex = /[0-2][0-9] [0-5][0-9]/
if (mregex.test(match[1]) === false) return await message.sendReply("*Wrong format!\n.automute 22 00 (For 10 PM)\n.automute 06 00 (For 6 AM)*");
var admin = await isAdmin(message)
if (!admin) return await message.sendReply("*I'm not admin*");
await setAutoMute(message.jid,match[1]);
await message.sendReply(`*Group will automatically mute at ${tConvert(match[1])}. Reconnecting..*`)
process.exit(0)
});
Module({
    pattern: "autounmute ?(.*)",
    fromMe: true,
    warn: "This works according to IST (Indian standard time)",
    use: 'group'
}, async (message, match) => {
if (!match[1]) return await message.sendReply("*Wrong format!*\n*.autounmute 22 00 (For 10 PM)*\n*.autounmute 06 00 (For 6 AM)*\n*.autounmute off*");
if (match[1]==="off") {
await delAutounMute(message.jid);
return await message.sendReply("*Auto Unmute has been disabled in this group ❗*");       
}
var mregex = /[0-2][0-9] [0-5][0-9]/
if (mregex.test(match[1]) === false) return await message.sendReply("*Wrong format!\n.autounmute 22 00 (For 10 PM)\n.autounmute 06 00 (For 6 AM)*");
var admin = await isAdmin(message)
if (!admin) return await message.sendReply("*I'm not admin*");
await setAutounMute(message.jid,match[1]);
await message.sendReply(`*Group will automatically open at ${tConvert(match[1])}. Reconnecting..*`)
process.exit(0)
});
var {
    getAutoMute,
    getAutounMute
} = require('./misc/scheduler');
Module({
    pattern: "getmute ?(.*)",
    fromMe: true,
    use: 'group'
}, async (message, match) => {
var mute = await getAutoMute(message.jid,match[1]);
var unmute = await getAutounMute(message.jid,match[1]);
var msg = '';
for (e in mute){
  let temp = unmute.find(element=> element.chat === mute[e].chat)
  if(temp.time) {
    mute[e].unmute = temp.time;
  }
  msg += `*${Math.floor(parseInt(e)+1)}. Group:* ${(await message.client.groupMetadata(mute[e].chat)).subject}
*➥ Mute:* ${tConvert(mute[e].time)}
*➥ Unmute:* ${tConvert(mute[e].unmute)}` + "\n\n";
};
message.sendReply("*Scheduled Mutes/Unmutes*\n\n"+msg)
});
Module({
    pattern: "antifake",
    fromMe: true,
    use: 'group'
}, async (message, match) => {
var admin = await isAdmin(message)
if (!admin) return await message.sendReply("*I'm not admin*");
var {
        subject,
        owner
    } = await message.client.groupMetadata(message.jid)
    var myid = message.client.user.id.split(":")[0]
    owner = owner || myid + "@s.whatsapp.net"
    const templateButtons = [{
            index: 1,
            urlButton: {
                displayText: 'WIKI',
                url: 'https://github.com/souravkl11/raganork-md/wiki/Docs'
            }
        },
        {
            index: 2,
            quickReplyButton: {
                displayText: 'ENABLE',
                id: 'fake_on' + myid
            }
        },
        {
            index: 3,
            quickReplyButton: {
                displayText: 'DISABLE',
                id: 'fake_off' + myid
            }
        },
        {
            index: 4,
            quickReplyButton: {
                displayText: 'ALLOWED PREFIXES',
                id: 'fake_get' + myid
            }
        },
    ]

    const templateMessage = {
        text: "*Antifake menu of* " + subject,
        footer: '',
        templateButtons: templateButtons
    }
    await message.client.sendMessage(message.jid, templateMessage)
})
Module({
    on: "button",
    fromMe: true
}, async (message, match) => {
    if (message.button && message.button.startsWith("fake_on") && message.button.includes(message.client.user.id.split(":")[0])) {
        await setAntifake(message.jid);
        return await message.sendMessage("Antifake enabled ✅")
    }
    if (message.button && message.button.startsWith("fake_off") && message.button.includes(message.client.user.id.split(":")[0])) {
        await delAntifake(message.jid);
        return await message.sendMessage("Antifake disabled ✅")
    }
    if (message.button && message.button.startsWith("fake_get") && message.button.includes(message.client.user.id.split(":")[0])) {
        return await message.sendMessage("Allowed prefixes: " + ALLOWED)
    }
})
Module({
    on: "group_update",
    fromMe: false
}, async (message, match) => {
    var db = await getAntifake();
    const jids = []
    db.map(data => {
        jids.push(data.jid)
    });
    if (message.update === 27 && jids.includes(message.jid)) {
        var allowed = ALLOWED.split(",");
        if (isFake(message.participant[0], allowed)) {
            var admin = await isAdmin(message);
            if (!admin) return;
            await message.client.sendMessage(message.jid, {
                text: "*Country code not allowed* @" + message.participant[0].split("@")[0],
                mentions: [message.participant[0]]
            });
            return await message.client.groupParticipantsUpdate(message.jid, [message.participant[0]], "remove")
        }
    }
    await parseWelcome(message,greeting)
})
