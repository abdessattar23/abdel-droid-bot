const {Module} = require("../main");
let command = {pattern:'square ?(.*)',fromMe:require("../config").MODE === "private",desc:"square crops video/image",usage:".crop, .crop 10, .crop 100"}
Module(command,async (m,match)=>{
if (!m.reply_message || (m.reply_message&& !m.reply_message.video && !m.reply_message.image)) return await m.sendReply("_Need video/image_");
var angle = match[1] || "";
var ffmpeg = require('fluent-ffmpeg');
await m.sendReply("_Processing.._");
async function getRes(video){
return await new Promise((resolve,reject)=>{

ffmpeg.ffprobe(video, function(err, metadata) {
    if (err) {
        reject(err);
    } else {

resolve( {height:metadata.streams[0].height,width:metadata.streams[0].width,path:video})
}
    })
});
}
var specs = await getRes(await m.reply_message.download())
var arr = [specs.height,specs.width];
const min = Math.min(...arr)
specs.height = min
specs.width = min
await m.send("_Please wait._")
 const { exec } = require('child_process');
const result = "cropped."+specs.path.split(".")[2];
if (isNaN(angle)) angle = specs.width
const ls = exec(`ffmpeg -y -i ${specs.path} -vf "crop=${specs.width}:${specs.width}:${specs.width}:${angle}" ${result}`, function (error, stdout, stderr) {
  if (error) {
    console.log(error.stack);
    console.log('Error code: ' + error.code);
    console.log('Signal received: ' + error.signal);
  }
 m.sendReply({url:result},result.endsWith("mp4")?"video":"image")
});

ls.on('exit', function (code) {
  console.log('Child process exited with exit code ' + code);
});
});
