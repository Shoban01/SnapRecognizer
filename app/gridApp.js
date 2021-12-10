import React, {createRef, useEffect, useRef, useState} from 'react';
import {Container, Row, Form, Col, Button, Spinner, Modal, FormGroup, FormLabel} from 'react-bootstrap';
import {hot} from 'react-hot-loader/root';
import 'bootstrap/dist/css/bootstrap.css';
import './style.css';
import 'babel-polyfill';
import * as faceapi from 'face-api.js';
import PopupImage from './popupImage';
const srcImageDetails = {dataUrl: '', allDescriptors:null, matchId:null, distance:null};
let srcDataUrl = [];
let dstDataUrl = "";
function test() {
	const [loader, setLoader] = useState(false);
	const [showPopupImage, setShowPopupImage] = useState(null);
	const [srcImages, setSrcImages] = useState([]);
	const [destImage, setDestImage] = useState(null);
	const srcImageRef = useRef([100].map(()=>createRef()));
	const dstImageRef = useRef();
	const setSrc = (e, prop, idx=-1) => {
		let srcObj = srcImageDetails;
		let srcImagesCopy = [...srcImages];
		console.log(idx, srcImages);
		srcImagesCopy[idx] = srcObj;
		srcImagesCopy[idx][prop] = e;
		setSrcImages(srcImagesCopy);
	}
	const onFileSelect = (e, type="src") => {
		if(type=="src") {
			for (var i = 0; i < e.target.files.length; i++) {
				fileLoader(e,i, type);
			}
			setTimeout(()=>{
				let srcImagesCopy = [...srcImages];
				srcDataUrl.map((e, idx)=>{
					let srcObj = {dataUrl: '', allDescriptors:null, matchId:null, distance:null};
					srcImagesCopy[idx] = srcObj;
					srcImagesCopy[idx]["dataUrl"] = e;
				});
				setSrcImages(srcImagesCopy);
			},1000);
		}else{
			fileLoader(e,0,"dst");
		}

	}
	const fileLoader = (e, i,type) => {
		var fr = new FileReader();
		
		fr.onload = function(e){
			type == "src" ? srcDataUrl.push(e.target.result): setDestImage(e.target.result);
		}
		fr.readAsDataURL(e.target.files[i]);
	}
	async function loadModels() {
		try{
			setLoader(true);
			// await faceapi.loadSsdMobilenetv1Model('/static');
			// await faceapi.loadFaceRecognitionModel('/static');
			// await faceapi.loadFaceLandmarkModel('/static');
			await faceapi.nets.ssdMobilenetv1.loadFromUri('/static');
			await faceapi.nets.faceRecognitionNet.loadFromUri('/static');
			await faceapi.nets.faceLandmark68Net.loadFromUri('/static');
			setLoader(false);
		}catch(e) {
			console.log(e);
		}

	}
	const matchImages = async () => {
		setLoader(true);
		let srcImagesCopy = [...srcImages];
		await Promise.all(srcImages.map(async (e,i)=>{
			const input = document.getElementById("srcImg"+i);
			const allDetectDescriptors = await faceapi.detectAllFaces(input).withFaceLandmarks().withFaceDescriptors();
			const allLabeleddescriptors = allDetectDescriptors.map((e, i)=>new faceapi.LabeledFaceDescriptors(i.toString(), [e.descriptor]) );
			const faceMatcher = new faceapi.FaceMatcher(allLabeleddescriptors);
			const destInput = dstImageRef.current;
			const extractedImage = await faceapi.detectSingleFace(destInput).withFaceLandmarks().withFaceDescriptor();
			var detected_id = faceMatcher.findBestMatch(extractedImage.descriptor);
			var matchId = parseInt(detected_id._label.replace( /^\D+/g, ''));
			var length = parseFloat(detected_id._distance).toFixed(2);
			srcImagesCopy[i]["allDescriptors"] = allDetectDescriptors;
			if(matchId != NaN) {
					srcImagesCopy[i]["matchId"] = matchId;
					srcImagesCopy[i]["distance"] = length;
			}
			return "";
		}));
		setSrcImages(srcImagesCopy);
		setLoader(false);
	}
	useEffect(async ()=>{
		await loadModels();
	}, []);
	const openPopup = (e) => {
		setShowPopupImage(e);
	}
	const hidePopup = () => {
		setShowPopupImage(null);
	}
	return(
		
		<Container fluid={true}>
			<h2 style={{textAlign:'center'}}>Snap Recognizer</h2>
			<Modal show={loader} onHide={()=>setLoader(false)}>
				<Modal.Body><Spinner animation="border" role="status">
				<span className="sr-only">Loading...</span>
			</Spinner></Modal.Body>
			</Modal>
			{showPopupImage != null && <PopupImage hidePopup={hidePopup} srcImageDetails={showPopupImage}/>}
			<Row>
				<Col>
					<Form className="form-border">
						<FormGroup>
							<FormLabel><b>Source Images</b></FormLabel>
							<Form.Control type="file" multiple onChange={onFileSelect}></Form.Control>
							<br />
							<Col>{srcImages.map((e, i)=><img id={"srcImg"+i} key={i} onClick={()=>openPopup(e)} className={e.matchId ? 'border border-success border-5':null} ref={srcImageRef.current[i]} width={100} height={100} src={e.dataUrl} />)}</Col>
						</FormGroup>
						<FormGroup>
							<FormLabel><b>Destination Image</b></FormLabel>
							<Form.Control type="file" onChange={e=>onFileSelect(e,"dest")}></Form.Control>
							<br />
							<Row>{destImage && <img  ref={dstImageRef} width={200} height={200} src={destImage} />}</Row>
						</FormGroup>
						<FormGroup>
							<Button onClick={matchImages}>Match Images</Button>
						</FormGroup>
					</Form>
				</Col>
			</Row>
		</Container>
	);
}
export default hot(test);