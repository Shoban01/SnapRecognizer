import React,{useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {Container, Row, Button} from 'react-bootstrap';
import {Table} from 'react-bootstrap';

export default function FormClassifier(props){
	const [formData, setFormData] = useState([]);
	useEffect(()=>{
		fetch(`http://localhost:8084/api/v1/images/?imageid=${props.match.params.id}`).then(response=>{
			if(response.status == 200){
				response.json().then((d)=>setFormData(d.result||[]));
			}
		})
	},[props]);
		
	return(
		<Container fluid={true}>
			<Row>
				<Table>
				  <thead>
					<tr>
					  <th>Id</th>
					  <th>Name</th>
					  <th>Type</th>
					  <th>Complexity</th>
					  <th>Character Count</th>
					</tr>
				  </thead>
				  <tbody>{
					    formData.map((data,i)=>{
						  let val = JSON.parse(data.fc_json);
						  return (<tr key={i}>
							  <td>{data.id}</td>
							  <td>{data.name}</td>
							  <td>{val.type}</td>
							  <td>{val.complexity}</td>
							  <td>{val.extractableCharacterCount}</td>
						  </tr>);
					  })
				  }
				  </tbody>
				</Table>
			</Row>
			<Row>
				<Link to="/"><Button>Back</Button></Link>
			</Row>
		</Container>
	);
}