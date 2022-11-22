/* Copyright (C) 2022 Sourav KL11.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
Raganork MD - Sourav KL11
*/
const fancy = require('./misc/fancy');
 require('../main').Module({
     pattern: 'fancy ?(.*)',
     fromMe: require('../config').MODE == 'public',
     use: 'utility',
     desc: 'Creates fancy text fonts'
 }, (async (message, match) => {
     if (!match[1] && !message.reply_message.message) return await message.sendReply("Reply to any message with .fancy number\n" + Fancy("example", "32"))
     const id = match[1].match(/\d/g)?.join('')
     try {
        if (!id && !message.reply_message?.text){
            let styles = Object.keys(fancy).filter(e=>e.length<3)
            let msg = ''
            for (let style in styles){
            msg+= fancy.apply(styles[style],match[1])
            }
        }
        return await message.sendReply(fancy.apply(fancy[parseInt(id)],message.reply_message.text || match[1].replace(id,'')))    
    } catch (e) {
         return await message.sendReply(e.message)
     }
 }))