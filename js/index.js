let video=document.querySelector("video")
let recoredBtnContennt=document.querySelector(".record-btn-cont")
let recoredBtn=document.querySelector(".record-btn")
let captureBtnCont=document.querySelector(".capture-btn-cont")
let catpureBtn=document.querySelector(".capture-btn")

let transparentColor="transparent"


let recordFlag=false 

let recorder;
let chunks=[]; //media data is stored in chunks


let constraints= {
    audio:true,
    video:true
}
// here contraints are used to take the permission from the user

// navigator is a global obj this gives info about browser
// getUserMeadia() it takes the permission form the user
// stram() it receives the continuous information from us (video)
navigator.mediaDevices.getUserMedia(constraints)
.then((stream) => {
    video.srcObject = stream;

    recorder=new MediaRecorder(stream) 
    recorder.addEventListener('start',(e) => {
        chunks=[]
    })
    recorder.addEventListener('dataavailable', (e) => {
        chunks.push(e.data)
    })
    recorder.addEventListener('stop' ,(e) => {
        //convert the media chunks data to video
        let blob=new Blob(chunks, {type : 'video/mp4'})
        let videoURL=URL.createObjectURL(blob)
        let a =document.createElement("a")
        a.href=videoURL;
        a.download='stream.mp4'
       a.click() 
    });

    recoredBtnContennt.addEventListener("click",(e) => {
        if (!recorder) return ;

        recordFlag=!recordFlag
        if (recordFlag){
            recorder.start()
            recoredBtn.classList.add("scale-record")
            startTimer()
        } 
        else{
            recorder.stop() 
            recoredBtn.classList.remove("scale-record")
            stopTimer()
        }
    })
})
//  video is actually captured as chunks ,but what these  chunks will have?
// each chunk will be having a frame, image is actually a frame





let timerID;
let counter=0;
let timer=document.querySelector(".timer");
function startTimer() {
    timer.style.display='block'
    function displayTimer() {
        /* How to calculate the time 
        1.Initialize a variable that actually stores the no.of seconds
        2.When ever this function displayTimer is called then we  need to increment the counter variable , as each call of this funcvtion is comsiderd as 1sec in 
        in regular time.Why? because we need to get the actual time when this thing needs to be counted .
        3. how to count hours,minute and seconds? 
        counter=3725 
        we know 1hr=3600 sec,
        to count 1 hr unsing counter value we use normal  division operator(//) between counter and 3600 sec. 
        in order to get 3600 sec .divsin operater is used to perform floor division
        3725/3600=> 1 
        reminder 3725%36000 => no.of minutes,so we need to convert back to minutes
        to find no.of seconds same
        */
       let totalSeconds=counter
       let hours =Number.parseInt(totalSeconds / 3600);
       totalSeconds=totalSeconds % 3600 
       let minutes=Number.parseInt(totalSeconds/60)
       totalSeconds=totalSeconds % 60 
       let seconds=totalSeconds;

       hours =(hours<10) ? `0${hours}`:hours
       minutes=(minutes<10) ? `0${minutes}`:minutes 
       seconds=(seconds<10) ? `0${seconds}`: seconds 

       timer.innerText=`${hours}:${minutes}:${seconds} `
       counter++ 
    }
    timerID=setInterval(displayTimer,1000) ;
}

function stopTimer() {
    clearInterval(timerID)
    timer.innerText='00:00:00 '
    timer.style.display="none"
}

captureBtnCont.addEventListener("click" ,(e) => {
    catpureBtn.classList.add("scale-capture") 

    let canvas=document.createElement('canvas')
    canvas.width=video.videoWidth 
    canvas.height=video.videoHeight
    let imageURl=canvas.toDataURL("image/jpeg",1.0)

    let a =document.createElement("a")
        a.href=imageURl;
        a.download='Image.jpeg'
       a.click() 

    let tool=canvas.getContext("2d")
    tool.drawImage(video,0,0,canvas.width,canvas.height) 
    // filtering
    tool.fillStyle=transparentColor 
    tool.fillRect(0,0,canvas.width,canvas.height)

    // remove animantions
    setTimeout(() => {
        catpureBtn.classList.remove("scale-capture")
    },500)

})

// filtering 
let filter= document.querySelector(".filter-layer")

let allFilters=document.querySelectorAll(".filter")
allFilters.forEach((filterElement) => {
    filterElement.addEventListener("click",(e) => {
        // get style
        transparentColor=getComputedStyle(filterElement).getPropertyValue("background-color")
        filter.style.backgroundColor=transparentColor
    })
})
