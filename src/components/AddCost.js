/**
 * 	Developers name:
 * 	Rafael Ashurov 	312054711
 * 	Matan Farchy	208948539
 * **/

import React, {useState} from 'react';
import {Button, Card, Col, FloatingLabel, Form, Row} from 'react-bootstrap';
import idb from '../lib/idb';

/**
 * AddCost component responsible for adding new costs.
 * @param {Function} setCosts - Function to update the costs state in the parent component.
 * @returns {JSX.Element} - The rendered AddCost component.
 */
const AddCost = ({setCosts}) => {
	const [sum, setSum] = useState('');
	const [category, setCategory] = useState('');
	const [description, setDescription] = useState('');
	const [validated, setValidated] = useState(false); // State to manage form validation

	/**
	 * Handles the form submission to add a new cost.
	 * @param {Event} event - The form submit event.
	 */
	const handleAddCost = async (event) => {
		const form = event.currentTarget;
		event.preventDefault();

		// Check if the form is valid. The checkValidity() method returns a boolean
		// indicating whether the form passed all its validation rules.
		if (form.checkValidity() === false) {
			// If the form is invalid, stop the event propagation to avoid further actions.
			event.stopPropagation();
		} else {
			// If the form is valid, proceed to add the new cost.
			try {
				// Open IndexedDB and add the new cost to the database.
				const db = await idb.openCostsDB('costsdb', 1);
				const newCost = await db.addCost({
					sum,
					category,
					description,
				});
				// Update the state to include the new cost.
				setCosts((prevCosts) => [...prevCosts, newCost]);
				alert('New cost added!');
			} catch (error) {
				alert(`Add cost failed: ${error}`);
				console.error(`Add cost failed: ${error}`);
			}
		}
		// Mark the form as validated to trigger any validation feedback styling.
		setValidated(true);
	};

	return (
		<Card>
			<Card.Header>Add New Cost</Card.Header>
			<Card.Body>
				<Form noValidate validated={validated} onSubmit={handleAddCost}>
					<Row>
						<Col>
							<Form.Group controlId="validationSum">
								<FloatingLabel
									controlId="floatingSum"
									label="Enter the sum here:"
									className="mb-3"
								>
									<Form.Control
										required
										type="number"
										placeholder="Enter the sum here:"
										min="0.1" // Sum must be bigger than 0
										step="any" // Allows both integers and floats
										value={sum}  // Make sure the input value reflects the state
										onChange={(e) => setSum(parseFloat(e.target.value))}
									/>

									<Form.Control.Feedback type="invalid">
										Please enter a sum greater than 0.
									</Form.Control.Feedback>
								</FloatingLabel>
							</Form.Group>
							<Form.Group controlId="validationCategory">
								<FloatingLabel controlId="floatingSelect" label="Category" className="mb-3">
									<Form.Select
										required
										value={category}  // Set the value attribute to the state variable
										onChange={(e) => setCategory(e.target.value)}
									>
										<option value="" disabled>
											Select Category
										</option>
										<option value="FOOD">FOOD</option>
										<option value="HEALTH">HEALTH</option>
										<option value="EDUCATION">EDUCATION</option>
										<option value="TRAVEL">TRAVEL</option>
										<option value="HOUSING">HOUSING</option>
										<option value="OTHER">OTHER</option>
									</Form.Select>
									<Form.Control.Feedback type="invalid">
										Please select a category.
									</Form.Control.Feedback>
								</FloatingLabel>
							</Form.Group>
							<Form.Group controlId="validationDescription">
								<FloatingLabel
									controlId="floatingDescription"
									label="Enter description here:"
									className="mb-3"
								>
									<Form.Control
										required
										type="text"
										placeholder="Enter description"
										minLength="2" // Description must be at least 2 characters long
										value={description}  // Make sure the input value reflects the state
										onChange={(e) => setDescription(e.target.value)}
									/>
									<Form.Control.Feedback type="invalid">
										Please enter a description with at least 2 characters.
									</Form.Control.Feedback>
								</FloatingLabel>
							</Form.Group>
						</Col>
					</Row>
					<Row>
						<Col className="justify-content-center d-flex">
							<Button type="submit" className="add-cost-submit-btn">Add New Cost</Button>
						</Col>
					</Row>
				</Form>
			</Card.Body>
		</Card>
	);
};

export default AddCost;