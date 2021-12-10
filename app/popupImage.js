import React, { useEffect, useRef, useState } from 'react';
import { Modal } from 'react-bootstrap';
import * as faceapi from 'face-api.js';

const PopupImage = ({ srcImageDetails, hidePopup }) => {
    const canvasRef = useRef();
    const imageRef = useRef();
    const outerRef = useRef();
    const [showModal, setShowModal] = useState(true);
    useEffect(() => {
        const dimension = faceapi.getMediaDimensions(imageRef.current);
        outerRef.current.style.width = dimension._width+"px";
        outerRef.current.style.height = dimension._height+"px";
        setTimeout(()=>drawBoxes(), 3000);
    }, []);
    const drawBoxes = () => {
        const drawBoxOptions = new faceapi.draw.DrawBoxOptions({ boxColor: "blue", lineWidth: 2 });
        const detections = srcImageDetails.allDescriptors.map(e => e.alignedRect);
        faceapi.matchDimensions(canvasRef.current, imageRef.current);
        faceapi.resizeResults(detections, imageRef.current);
        detections.forEach(e => {
            console.log(e, canvasRef.current);
            new faceapi.draw.DrawBox(new faceapi.Rect(e._box._x, e._box._y, e._box._width, e._box._height, true), drawBoxOptions).draw(canvasRef.current);
        });
        const drawBoxOptions_match = new faceapi.draw.DrawBoxOptions({ boxColor: "red", lineWidth: 2, label: srcImageDetails.distance });
        srcImageDetails.allDescriptors.forEach((e, i) => {
            if (i == srcImageDetails.matchId) {
                var matchRect = e.alignedRect._box;
                new faceapi.draw.DrawBox(new faceapi.BoundingBox(matchRect.left, matchRect.top, matchRect.right, matchRect.bottom, true), drawBoxOptions_match).draw(canvasRef.current);
            }
        });
    }
    return (
        <Modal show={showModal} onHide={() => { hidePopup() }}>
            <Modal.Body>
                <div ref={outerRef} class="outsideWrapper">
                    <div class="insideWrapper">
                        <img class="coveredImage" ref={imageRef} src={srcImageDetails.dataUrl} />
                        <canvas class="coveringCanvas" ref={canvasRef} ></canvas>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default PopupImage;