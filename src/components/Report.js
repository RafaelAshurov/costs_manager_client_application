/**
 * 	Developers name:
 * 	Rafael Ashurov 	312054711
 * 	Matan Farchy	208948539
 * **/

import React from 'react';
import {Alert, Card, Col, Container, Row} from 'react-bootstrap';

const Report = ({costs}) => {
	// Group costs by year, month, and category
	let groupedCosts = {};
	// This obj will contain all the total sums, that way the JSX have less functionality logic
	let groupsTotalSums = {};

	if (costs.length !== 0) {
		costs.forEach((cost) => {
			// The cost.id is a string timestamp of its creation
			const date = new Date(parseInt(cost.id));
			const year = date.getFullYear();
			const month = date.toLocaleString('default', {month: 'long'});

			// Initialize the year, and it's total sum if not already present
			if (!groupedCosts[year]) {
				groupedCosts[year] = {};
				groupsTotalSums[year] = {'totalSum': cost.sum};
			} else {
				// Add cost sum to the total sum
				groupsTotalSums[year].totalSum += cost.sum;
			}
			// Initialize the month, and it's total sum if not already present
			if (!groupedCosts[year][month]) {
				groupedCosts[year][month] = {};
				groupsTotalSums[year][month] = {'totalSum': cost.sum};
			} else {
				// Add cost sum to the total sum
				groupsTotalSums[year][month].totalSum += cost.sum;
			}
			// Initialize the category, and it's total sum if not already present
			if (!groupedCosts[year][month][cost.category]) {
				groupedCosts[year][month][cost.category] = [];
				groupsTotalSums[year][month][cost.category] = {'totalSum': cost.sum};
			} else {
				// Add cost sum to the total sum
				groupsTotalSums[year][month][cost.category].totalSum += cost.sum;
			}
			// Add the cost to the right place
			groupedCosts[year][month][cost.category].push(cost);
		});
	}

	return (
		<Card>
			<Card.Header>Costs report</Card.Header>
			<Card.Body>
				{/* Check if there are any costs to display */}
				{costs.length === 0 ? (
					<Alert key="secondary" variant="secondary" className="text-center">
						There are no costs to report, please add some costs
					</Alert>
				) : (
					<div className="report-container">
						{/* Loop through each year */}
						{Object.keys(groupedCosts).sort().reverse().map((year) => (
							<div key={year} className="year-report-container">
								<div className="year-header-container">
									<p className="year-header-desc"> Total costs for this
										year: <b className="px-3">{groupsTotalSums[year].totalSum}</b></p>
									<h2 className="year-header">{year}</h2>
								</div>
								{/* Loop through each month */}
								{Object.keys(groupedCosts[year]).map((month) => (
									<div className="month-container" key={month}>
										<h3 className="month-header">{month}</h3>
										{/* Loop through each category */}
										{Object.keys(groupedCosts[year][month]).map((category) => (
											<Container className="category-costs-container" key={category}>
												{groupedCosts[year][month][category].map((cost) => (
													<Row key={cost.id} className="cost-row">
														<Col>{cost.category}</Col>
														<Col>{cost.description}</Col>
														<Col>{cost.sum}</Col>
													</Row>
												))}
												<Row className="category-sum-row">
													<Col sm={8} className="category-description-col">Total money spent
														this month on
														<b>
															{category}
														</b>
													</Col>
													<Col className="category-sum-col">
														<u>
															{groupsTotalSums[year][month][category].totalSum}
														</u>
													</Col>
												</Row>
											</Container>
										))}
										<div className="month-sum-row">
											Total costs of {month}: <b>{groupsTotalSums[year][month].totalSum}</b>
										</div>
									</div>))}
							</div>))}
					</div>)}
			</Card.Body>
		</Card>
	);
};

export default Report;
