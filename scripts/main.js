import {Innertube} from "./youtube.js"
import createWriteStream from "./streamSaver.js"

const VIDEO_ID_LENGTH = 11;

let videoID = "";
let isOnVideo = false;

async function download(){
    console.info(isOnVideo ? "YES" : "NO");

    if(videoID == ""){
        return;
    }

    const youtube = new Innertube();
    
    const stream = youtube.download("lTieq1DrEec", {
      format: 'mp4', // Optional, defaults to mp4 and I recommend to leave it as it is unless you know what you're doing
      quality: '360p', // if a video doesn't have a specific quality it'll fall back to 360p, also ignored when type is set to audio
      type: 'videoandaudio' // can be “video”, “audio” and “videoandaudio”
    });

    console.log(stream)

    //const videoInfo = await youtube.getDetails(videoID)

    
    stream.pipe(createWriteStream(`./sometitle.mp4`));
   
    stream.on('start', () => {
      console.info('[DOWNLOADER]', 'Starting download now!');
    });
    
    stream.on('info', (info) => {
      // { video_details: {..}, selected_format: {..}, formats: {..} }
      console.info('[DOWNLOADER]', `Downloading ${info.video_details.title} by ${info.video_details.metadata.channel_name}`);
    });
    
    stream.on('progress', (info) => {
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
      process.stdout.write(`[DOWNLOADER] Downloaded ${info.percentage}% (${info.downloaded_size}MB) of ${info.size}MB`);
    });
    
    stream.on('end', () => {
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
      console.info('[DOWNLOADER]', 'Done!');
    });
    
    stream.on('error', (err) => console.error('[ERROR]', err)); 
}


function isURL(){
    let link;
    let t = chrome.tabs;
    if(t != undefined){
        t.query({currentWindow: true, active: true}, (tabs) => {
            if(tabs != undefined){
                link = tabs[0].url;
                if(link.includes("watch?v=") && !isOnVideo){
                    videoID = link.substring(link.length - VIDEO_ID_LENGTH)
                    isOnVideo = true;
                }
                else if (!link.includes("watch?v=") && isOnVideo){
                    videoID = undefined;
                    isOnVideo = false;
                }
            }
        });
    }
    
}

setInterval(() => {isURL()}, 1000)
var downloadButton = document.getElementById("download")

if(downloadButton != null){
    document.getElementById("download").addEventListener("click", () => {download();})
}
