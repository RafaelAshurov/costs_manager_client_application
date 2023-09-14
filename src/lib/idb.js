/**
 * Class representing a CostsDB
 */
class CostsDB {
	/**
	 * Create a CostsDB instance
	 * @param {IDBDatabase} db - The IndexedDB database object
	 */
	constructor(db) {
		this.db = db;
	}

	/**
	 * Add a cost entry to the database
	 * @param {object} cost - The cost object to add
	 * @returns {Promise<object>} - A Promise that resolves to the added object
	 */
	async addCost(cost) {
		return new Promise((resolve, reject) => {
			// Check if the "costs" object store exists
			if (!this.db.objectStoreNames.contains('costs')) {
				reject(new Error('Object store does not exist. Database might not be initialized properly.'));
				return;
			}

			// Initialize a read/write transaction on the "costs" object store
			const transaction = this.db.transaction(['costs'], 'readwrite');
			const objectStore = transaction.objectStore('costs');

			// Generate a unique ID, we wil use it later to extract date of the cost
			cost.id = Date.now().toString();

			// Attempt to add the new cost entry to the object store
			const request = objectStore.add(cost);

			request.onsuccess = function (event) {
				resolve(cost);
			};

			request.onerror = function (event) {
				reject(new Error(`Could not add cost. Event: ${event}`));
			};
		});
	}
}

/**
 * Open or create an IndexedDB database
 * @param {string} dbName - The name of the database
 * @param {number} version - The version of the database
 * @returns {Promise} - A Promise that resolves to a CostsDB instance
 */
async function openCostsDB(dbName, version) {
	return new Promise((resolve, reject) => {

		// Open the database
		const request = indexedDB.open(dbName, version);

		// Create object store if it doesn't exist
		request.onupgradeneeded = function (event) {
			const db = event.target.result;
			if (!db.objectStoreNames.contains('costs')) {
				db.createObjectStore('costs', {keyPath: 'id'});
			}
		};

		// On success return a promise that resolves to a CostsDB instance
		request.onsuccess = function (event) {
			const db = event.target.result;
			resolve(new CostsDB(db));
		};

		request.onerror = function (event) {
			reject(new Error(`Could not open database. event: ${event}`));
		};
	});
}

/**
 * Get all costs from the database
 * @param {string} dbName - The name of the database
 * @returns {Promise} - A Promise that resolves to an array of all costs
 */
async function getAllCosts(dbName) {
	return new Promise(async (resolve, reject) => {

		// Open the database
		const costsDbConnection = await openCostsDB('costsdb', 1);
		const db = costsDbConnection.db;

		// Check if the "costs" object store exists
		if (!db.objectStoreNames.contains('costs')) {
			resolve([]); // Return an empty array if the object store doesn't exist
			return;
		}

		// Get the "costs" object store
		const transaction = db.transaction(['costs'], 'readonly');
		const objectStore = transaction.objectStore('costs');

		// Get all records from the object store
		const request = objectStore.getAll();

		// Handle successful retrieval
		request.onsuccess = function (event) {
			resolve(event.target.result);
		};

		// Handle errors
		request.onerror = function (event) {
			reject(new Error(`Could not get all costs. event: ${event}`));
		};
	});
}


// Expose the library functions as properties of the idb object
const idb = {
	openCostsDB,
	getAllCosts
};

export default idb;