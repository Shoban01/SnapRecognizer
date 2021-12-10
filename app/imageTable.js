import React, {useState, useEffect} from 'react';
import {Table, Button, Col, Spinner} from 'react-bootstrap';
import {Link} from 'react-router-dom';
export default function ImageTable(props){
	const [imageList, setImageList] = useState([]);
	const [spinner, setSpinner] = useState(true);
	useEffect(()=>{
		setSpinner(true);
		fetch("http://localhost:8084/api/v1/images").then(data=>data.json()).then(data=>{
			setImageList(data.result||[]);
		}).finally(e=>setSpinner(false));
	}, [props.loader]);
	return (
		<Col>
			<h2>Uploaded images</h2>
			<Table>
			  <thead>
				<tr>
				  <th>Image Name</th>
				  <th>Grid line Extractor</th>
				  <th>Form Classifier</th>
				</tr>
			  </thead>
			  <tbody>
				{spinner ? 
				<tr><td colSpan={2}><Spinner style={{marginLeft:'50%'}} animation="border" role="status">
					<span className="sr-only">Loading...</span>
				</Spinner></td></tr>
				:
				imageList.length == 0 ? <tr><td colSpan={2} style={{textAlign: 'center'}}>No records to display</td></tr> : imageList.map((image, i)=>{
					return(
						<tr key={i}>
						<th scope="row">{image.name}</th>
						<td>{image.gridline_status.toLowerCase() == "completed" ? <Link to={`/grid/${image.id}`}><Button color="link">View</Button></Link> : image.gridline_status}</td>
						<td>{image.fc_status.toLowerCase() == "completed" ? <Link to={`/form/${image.id}`}><Button color="link">View</Button></Link> : image.fc_status}</td>
						</tr>
					);
				})}
			  </tbody>
			</Table>
		</Col>
	  );
}