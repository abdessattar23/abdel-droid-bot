/* Copyright (C) 2022 Sourav KL11.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
Raganork MD - Sourav KL11
*/
const {
    Module
} = require('../main');
const {isAdmin} = require("./misc/misc")
Module({
    pattern: 'del',
    fromMe: true,
    desc: 'Deletes message for everyone. Supports admin deletion'
}, (async (m, t) => {
    if (!m.reply_message || !m.jid.endsWith("s")) return;
    if (fromMe) return await m.client.sendMessage(m.jid, { delete: m.quoted.key })
    if (!fromMe) {
    var admin = await isAdmin(m);
    if (!admin) return await m.sendReply("_I'm not an admin!_")
    return await m.client.sendMessage(m.jid, { delete: m.quoted.key })
    }
}));