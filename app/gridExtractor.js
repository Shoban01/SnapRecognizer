import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom'
import {Container, Row, Button} from 'react-bootstrap';
let popup_txt, popup, transparent_txt;
function draw_tooltip(object, show, text, x, y, raphael) {
		
		if(show == 0) {
			popup.remove();
			popup_txt.remove();
			transparent_txt.remove();
			return;
		}
		//draw text somewhere to get its dimensions and make it transparent
		transparent_txt = raphael.text(100,100, text).attr({fill: "transparent"});
		
		//get text dimensions to obtain tooltip dimensions
		let txt_box = transparent_txt.getBBox();

		//draw text
		popup_txt = raphael.text(x+txt_box.width, y-txt_box.height-5, text).attr({fill: "black",font: "20px sans-serif"});
		
		let bb = popup_txt.getBBox();
		
		//draw path for tooltip box
		popup = raphael.path( 
						// 'M'ove to the 'dent' in the bubble
						"M" + (x) + " " + (y) +
						// 'v'ertically draw a line 5 pixels more than the height of the text
						"v" + -(bb.height+5) + 
						// 'h'orizontally draw a line 10 more than the text's width
						"h" + (bb.width+10) +
						// 'v'ertically draw a line to the bottom of the text
						"v" + bb.height + 
						// 'h'orizontally draw a line so we're 5 pixels fro thge left side
						"h" + -(bb.width+5) +
						// 'Z' closes the figure
						"Z").attr( {fill: "yellow"} );

		//finally put the text in front
		popup_txt.toFront();

	}
function compare( a, b ) {
  if ( a.w > b.w ){
    return -1;
  }
  if ( a.w < b.w ){
    return 1;
  }
  return 0;
}	
function GridExtractor(props) {
	let img = new Image();
	useEffect(()=> {
		fetch(`http://localhost:8084/api/v1/images/${props.match.params.id}`).then(response=>response.blob()).then(images=>{
			let outside = URL.createObjectURL(images);
			img.src = outside;
			fetch(`http://localhost:8084/api/v1/imagedetails/${props.match.params.id}`).then(response=>response.json()).then(response=>{
				let sortedArray = response.result.sort(compare);
				executeProcessing(sortedArray);
			})
		});
	},[]);
	
	const executeProcessing = function(data){
		var raphael = new Raphael(document.getElementById("raphael"), img.width, img.height);
		raphael.image(img.src,0,0,img.width, img.height);
		for(let i=0; i<data.length; i++){
			let node = raphael.rect(data[i]['x'], data[i]['y'], data[i]['w'], data[i]['h']);
			//node.attr("stroke", "#FFFF00");
			node.attr({
				'stroke': 'yellow', 
				'fill': 'white',
				'fill-opacity': 0.5,
				'stroke-width': 4,
				'stroke-opacity': 0.5,
				'stroke-linecap': 'round',
				'stroke-linejoin': 'round'
			});
			node.data({"x":data[i]['x'],"y":data[i]['y']});
			let dataInfo = data[i];
			node.hover(
				function(){node.attr({'fill': 'red'});draw_tooltip(this,1,dataInfo["value"],dataInfo['x'], dataInfo['y'], raphael)},
				function(){
					node.attr({'fill': 'white'});
					draw_tooltip(this,0,dataInfo["value"],dataInfo['x'], dataInfo['y'], raphael)
				}
			);
		}
		
		
	}
	return (
			<Container fluid={true}>
				<h2 style={{textAlign: "left"}}>Extracted result</h2>
				<Row>
					<div id="raphael" ></div>
				</Row>
				<Row>
					<Link to="/"><Button>Back</Button></Link>
				</Row>
			</Container>
	);
}
export default GridExtractor;