const { BoundingBox } = require("face-api.js");
const faceapi = require("face-api.js");

// fetch first image of each class and compute their descriptors
async function createBbtFaceMatcher() {
    await faceapi.nets.ssdMobilenetv1.loadFromUri('/');
    await faceapi.nets.faceRecognitionNet.loadFromUri('/');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/');
    const input = srcImage;
    console.log(input);
    const drawBoxOptions = new faceapi.draw.DrawBoxOptions({boxColor:"blue",lineWidth:2});
    const allDetectDescriptors = await faceapi.detectAllFaces(input).withFaceLandmarks().withFaceDescriptors();
    const detections = allDetectDescriptors.map(e=>e.alignedRect);
    const allLabeleddescriptors = allDetectDescriptors.map((e, i)=>new faceapi.LabeledFaceDescriptors(i.toString(), [e.descriptor]) );
    //const descriptors = allLabeleddescriptors.forEach(e=>e.descriptors)
    const canvas = document.getElementById('srcImageCanvas');
    faceapi.matchDimensions(canvas, input);
    faceapi.resizeResults(detections, input);
    console.log(allLabeleddescriptors);
    detections.forEach(e=>{
        new faceapi.draw.DrawBox(new BoundingBox(e._box.left,e._box.top,e._box.right,e._box.bottom,true), drawBoxOptions).draw(canvas);
    })
    const faceMatcher = new faceapi.FaceMatcher(allLabeleddescriptors);
    const destInput = dstImage;
    console.log(dstImage);
    // const detections_two = await faceapi.detectAllFaces(destInput).withFaceLandmarks().withFaceDescriptors();
    // if(detections_two.length > 0) {
        const extractedImage = await faceapi.detectSingleFace(destInput).withFaceLandmarks().withFaceDescriptor();
        var detected_id = faceMatcher.findBestMatch(extractedImage.descriptor);
        var matchId = parseInt(detected_id._label.replace( /^\D+/g, ''));
        var length = parseFloat(detected_id._distance).toFixed(2);
        const drawBoxOptions_match = new faceapi.draw.DrawBoxOptions({boxColor:"red",lineWidth:2,label:length});
        console.log(matchId, length);
        allDetectDescriptors.forEach((e,i)=>{
            if(i == matchId){
                var matchRect = e.alignedRect._box;
                new faceapi.draw.DrawBox(new BoundingBox(matchRect.left,matchRect.top,matchRect.right,matchRect.bottom,true), drawBoxOptions_match).draw(canvas);
            }
        })
        
        //document.getElementById(detected_id).style.border = "20px solid red"; 
    // }
}

const srcImageInput = document.getElementById("srcImage");
const srcImage = document.getElementById("srcImagePlaceHolder");
srcImageInput.onchange = function(e) {
    var fr = new FileReader();
    fr.onload = function(e){
        document.getElementById("srcImagePlaceHolder").src = e.target.result;
    }
    fr.readAsDataURL(e.srcElement.files[0]);
}

const dstImageInput = document.getElementById("dstImage");
const dstImage = document.getElementById("dstImagePlaceHolder");
dstImageInput.onchange = function(e) {
    var fr = new FileReader();
    fr.onload = function(e){
        document.getElementById("dstImagePlaceHolder").src = e.target.result;
    }
    fr.readAsDataURL(e.srcElement.files[0]);
}
const matchImagesBtn = document.getElementById("matchImages");
matchImagesBtn.onclick = function() {
    createBbtFaceMatcher();
}
