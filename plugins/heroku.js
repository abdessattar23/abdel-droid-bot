/* Copyright (C) 2022 Sourav KL11.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
Raganork MD - Sourav KL11
*/
async function sendButton(buttons,text,footer,message){
    const buttonMessage = {text,footer,buttons,headerType: 1}
    return await message.client.sendMessage(message.jid, buttonMessage)
    };
    const {
        Module
    } = require('../main');
    const {
        isAdmin,
        delAntilink,
        getAntilink,
        setAntilink
    } = require('./misc/misc');
    const {
        skbuffer
    } = require('raganork-bot');
    const {
        chatBot
    } = require('./misc/misc');
    const Config = require('../config');
    const Heroku = require('heroku-client');
    const got = require('got');
    const {
        getString
    } = require('./misc/lang');
    const Lang = getString('heroku');
    const heroku = new Heroku({
        token: Config.HEROKU.API_KEY
    });
    var handler = Config.HANDLERS !== 'false'?Config.HANDLERS.split("")[0]:""
    function secondsToDhms(seconds) {
        seconds = Number(seconds);
        var d = Math.floor(seconds / (3600*24));
        var h = Math.floor(seconds % (3600*24) / 3600);
        var m = Math.floor(seconds % 3600 / 60);
        var s = Math.floor(seconds % 60);
        
        var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
        var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
        var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
        var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
        return dDisplay + hDisplay + mDisplay + sDisplay;
        }
    let baseURI = '/apps/' + Config.HEROKU.APP_NAME;
    
    Module({
        pattern: 'restart$',
        fromMe: true,
        dontAddCommandList: true,
        use: 'owner'
    }, (async (message, match) => {
    
        await message.sendReply(Lang.RESTART_MSG)
        await heroku.delete(baseURI + '/dynos').catch(async (error) => {
            await message.send(error.message)
        });
    }));
    
    Module({
        pattern: 'shutdown$',
        fromMe: true,
        dontAddCommandList: true,
        use: 'owner'
    }, (async (message, match) => {
    
        await heroku.get(baseURI + '/formation').then(async (formation) => {
            forID = formation[0].id;
            await message.sendReply(Lang.SHUTDOWN_MSG)
            await heroku.patch(baseURI + '/formation/' + forID, {
                body: {
                    quantity: 0
                }
            });
        }).catch(async (err) => {
            await message.send(error.message)
        });
    }));
    
    Module({
        pattern: 'dyno$',
        fromMe: true,
        dontAddCommandList: true,
        use: 'owner'
    }, (async (message, match) => {
    
        heroku.get('/account').then(async (account) => {
            url = "https://api.heroku.com/accounts/" + account.id + "/actions/get-quota"
            headers = {
                "User-Agent": "Chrome/80.0.3987.149 Mobile Safari/537.36",
                "Authorization": "Bearer " + Config.HEROKU.API_KEY,
                "Accept": "application/vnd.heroku+json; version=3.account-quotas",
            }
            await got(url, {
                headers: headers
            }).then(async (res) => {
                const resp = JSON.parse(res.body);
                total_quota = Math.floor(resp.account_quota);
                quota_used = Math.floor(resp.quota_used);
                percentage = Math.round((quota_used / total_quota) * 100);
                remaining = total_quota - quota_used;
                await message.sendReply(
                    "_Total: *{}*_\n".format(secondsToDhms(total_quota)) +
                    "_Used: *{}*_\n".format(secondsToDhms(quota_used)) +
                    "_Percent: *{}*_\n".format(percentage) +
                    "_Remaining: *{}*_\n".format(secondsToDhms(remaining)))
    
            }).catch(async (err) => {
                await message.send(error.message)
            });
        });
    }));
    
    Module({
        pattern: 'setvar ?(.*)',
        fromMe: true,
        desc: Lang.SETVAR_DESC,
        use: 'owner'
    }, (async (message, match) => {
    
        if (match[1] === '' || !match[1].includes(":")) return await message.sendReply(Lang.KEY_VAL_MISSING)
    
        if ((varKey = match[1].split(':')[0]) && (varValue = match[1].replace(match[1].split(':')[0] + ":", ""))) {
            await heroku.patch(baseURI + '/config-vars', {
                body: {
                    [varKey]: varValue
                }
            }).then(async (app) => {
                await message.sendReply(Lang.SET_SUCCESS.format(varKey, varValue))
            });
        } else {
            await message.sendReply(Lang.INVALID)
        }
    }));
    
    
    Module({
        pattern: 'delvar ?(.*)',
        fromMe: true,
        desc: Lang.DELVAR_DESC,
        use: 'owner'
    }, (async (message, match) => {
    
        if (match[1] === '') return await message.sendReply(Lang.NOT_FOUND)
        await heroku.get(baseURI + '/config-vars').then(async (vars) => {
            key = match[1].trim();
            for (vr in vars) {
                if (key == vr) {
                    await heroku.patch(baseURI + '/config-vars', {
                        body: {
                            [key]: null
                        }
                    });
                    return await message.sendReply(Lang.DEL_SUCCESS.format(key))
                }
            }
            await await message.sendReply(Lang.NOT_FOUND)
        }).catch(async (error) => {
            await message.sendReply(error.message)
        });
    
    }));
    Module({
        pattern: 'getvar ?(.*)',
        fromMe: true,
        desc: Lang.GETVAR_DESC,
        use: 'owner'
    }, (async (message, match) => {
    
        if (match[1] === '') return await message.sendReply(Lang.NOT_FOUND)
        await heroku.get(baseURI + '/config-vars').then(async (vars) => {
            for (vr in vars) {
                if (match[1].trim() == vr) return await message.sendReply(vars[vr])
            }
            await await message.sendReply(Lang.NOT_FOUND)
        }).catch(async (error) => {
            await await message.send(error.message)
        });
    }));
    Module({
            pattern: "allvar",
            fromMe: true,
            desc: Lang.ALLVAR_DESC,
            use: 'owner'
        },
        async (message, match) => {
            let msg = Lang.ALL_VARS + "\n\n\n```"
            await heroku
                .get(baseURI + "/config-vars")
                .then(async (keys) => {
                    for (let key in keys) {
                        msg += `${key} : ${keys[key]}\n\n`
                    }
                    return await await message.sendReply(msg += '```')
                })
                .catch(async (error) => {
                    await message.send(error.message)
                })
        }
    );
    Module({
        pattern: 'chatbot ?(.*)',
        fromMe: true,
        desc: "Activates chatbot",
        use: 'config'
    }, (async (message, match) => {
        if (match[1]!=="button_on" && match[1]!=="button_off"){
        const buttons = [
            {buttonId: handler+'chatbot button_on', buttonText: {displayText: 'ON'}, type: 1},
            {buttonId: handler+'chatbot button_off', buttonText: {displayText: 'OFF'}, type: 1}
        ]
        return await sendButton(buttons,"*ChatBot control panel*","Chatbot is currently turned "+Config.CHATBOT+" now",message)
        }
        await message.sendReply(match[1].endsWith("n")? "*Chatbot activated ✅*" : "*Chatbot de-activated ✅*");
        await heroku.patch(baseURI + '/config-vars', {
            body: {CHATBOT: match[1].split("_")[1]}
        }).catch(async (err) => {
            await message.sendReply('```'+err.message+'```')
        });
    }));
    Module({
        pattern: 'mode ?(.*)',
        fromMe: true,
        desc: "Change bot mode to public & private",
        use: 'config'
    }, (async (message, match) => {
        const buttons = [
            {buttonId: handler+'setvar MODE:public', buttonText: {displayText: 'PUBLIC'}, type: 1},
            {buttonId: handler+'setvar MODE:private', buttonText: {displayText: 'PRIVATE'}, type: 1}
        ]
        return await sendButton(buttons,"*Working mode control panel*","Bot is currently running on "+Config.MODE+" mode now",message)
    }));
    Module({
        pattern: 'antispam ?(.*)',
        fromMe: true,
        desc: "Detects spam messages and kicks user.",
        use: 'config'
    }, (async (message, match) => {
        var admin = await isAdmin(message)
        if (!admin) return await message.sendReply("_I'm not admin_");
        var Jids = [...Config.ANTI_SPAM?.match(/[0-9]+(-[0-9]+|)(@g.us|@s.whatsapp.net)/g)]
        var msg = Config.ANTI_SPAM;
        var toggle = "on"
        var off_msg = Jids?.filter(e=>e!==message.jid)
        if (!Jids.includes(message.jid)){
            Jids.push(message.jid)
            msg = Jids.join(",")
            toggle = "off"
        }
        const buttons = [
            {buttonId: handler+'setvar ANTI_SPAM:'+msg, buttonText: {displayText: 'ON'}, type: 1},
            {buttonId: handler+'setvar ANTI_SPAM:'+off_msg, buttonText: {displayText: 'OFF'}, type: 1}
        ]
        return await sendButton(buttons,"*Antispam control panel*","Antispam is currently "+toggle,message)
    }));
    Module({
        pattern: 'antilink ?(.*)',
        fromMe: true,
        desc: "Activates antilink",
        use: 'config'
    }, (async (message, match) => {
        var db = await getAntilink();
        const jids = []
        db.map(data => {
            jids.push(data.jid)
        });
        if (match[1] === "button_on"){
            if (!(await isAdmin(message))) return await message.sendReply("_I'm not an admin!_")
            await setAntilink(message.jid) 
        }
        if (match[1] === "button_off"){
            if (!(await isAdmin(message))) return await message.sendReply("_I'm not an admin!_")
            await delAntilink(message.jid)  
        }
        if (match[1]!=="button_on" && match[1]!=="button_off"){
        const buttons = [
            {buttonId: handler+'antilink button_on', buttonText: {displayText: 'ON'}, type: 1},
            {buttonId: handler+'antilink button_off', buttonText: {displayText: 'OFF'}, type: 1}
        ]
        var status = jids.includes(message.jid) ? 'on' : 'off';
        var {subject} = await message.client.groupMetadata(message.jid)
        return await sendButton(buttons,`_Antilink menu of ${subject}_`,"_Antilink is currently turned "+status+"_",message)
        }
        await message.sendReply(match[1] === "button_on" ? "_Antilink activated!_" : "_Antilink deactivated!_");
    }));
    Module({
        on: 'text',
        fromMe: false
    }, (async (message, match) => {
        if (Config.CHATBOT === 'on') {
            await chatBot(message, Config.BOT_NAME)
        }
        if (/\bhttps?:\/\/\S+/gi.test(message.message)){
        var db = await getAntilink();
        const jids = []
        db.map(data => {
            jids.push(data.jid)
        });
        if (jids.includes(message.jid)) {
        var allowed = process.env.ALLOWED_LINKS || "gist,instagram,youtu";
        var checker = [];
        allowed.split(",").map(e=> checker.push(message.message.includes(e)))
        if (!checker.includes(true)){
        if (!(await isAdmin(message,message.sender))) {
        var usr = message.sender.includes(":") ? message.sender.split(":")[0]+"@s.whatsapp.net" : message.sender
        await message.sendReply("_Link not allowed!_");
        await message.client.groupParticipantsUpdate(message.jid, [usr], "remove")
        }
        }
        }
    }
    }));
    