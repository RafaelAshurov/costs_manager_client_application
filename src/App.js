import React, {useEffect, useState} from 'react';
import {Col, Container, Row} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import AddCost from './components/AddCost';
import Report from './components/Report';
import idb from './lib/idb';

/**
 * The main App component that serves as the parent component.
 * @returns {JSX.Element} - The rendered App component.
 */
function App() {
	const [costs, setCosts] = useState([]);

	/**
	 * Initialize the application by fetching existing costs from IndexedDB.
	 * This effect runs only once after the first render, thanks to the empty dependency array [].
	 */
	useEffect(() => {
		const fetchData = async () => {
			try {
				// Fetch initial costs from IndexedDB
				const initialCosts = await idb.getAllCosts('costsdb');
				// Update the state with the fetched costs
				setCosts(initialCosts);
			} catch (error) {
				alert(`Initialization failed: ${error}`);
				console.error(`Initialization failed: ${error}`);
			}
		};
		fetchData();
	}, []);  // Empty dependency array ensures this runs only once

	return (
		<Container id="app-container">
            <Row>
                <h1>Costs Manager</h1>
            </Row>
			<Row>
				<Col>
					<AddCost setCosts={setCosts}/>
				</Col>
			</Row>
			<Row>
				<Col>
					<Report costs={costs} />
				</Col>
			</Row>
		</Container>
	);
}

export default App;
