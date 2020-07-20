// @ts-nocheck
/*        data-model.js: define how data is structured and managed        */
/*        This is the only file that requires the Database object         */

var db = require('./db');

/*  var schema is used for convenience to get column names in updateRow() */

var schema = {
	actors: ['id', 'login', 'avatar_url', 'created_at'],
	repos: ['id', 'url', 'name', 'created_at'],
	events: ['id', 'type', 'actor_id', 'repo_id', 'created_at'],
};

/* CRUD functions: readTable, createRow, updateRow, deleteRow             */
const runQuery = (query) => {
	return new Promise((resolve, reject) => {
		db.all(query, (err, rows) => {
			/* Return all results of query */
			if (err) reject(err); /* rejects the err and send response */
			resolve(rows);
		});
	});
};

const readTable = (table, condition = null, orderBy = '') => {
	let sql = !condition
		? `SELECT * FROM ${table}`
		: `SELECT * FROM ${table} ${condition} ${orderBy}`; // checks if there is a condition
	return new Promise((resolve, reject) => {
		db.all(sql, (err, rows) => {
			/* Return all results of query */
			if (err) reject(err); /* rejects the err and send response */
			resolve(rows);
		});
	});
};

const getRow = (table, id) => {
	const sql = `SELECT * FROM ${table} WHERE id = ${id}`;
	return new Promise((resolve, reject) => {
		db.get(sql, (err, row) => {
			if (err) reject(err);
			resolve(row);
		});
	});
};

const createRow = (table, data) => {
	const rows = Object.keys(data);
	let values = Object.values(data);
	values = "'" + values.join("','") + "'";
	let sql;
	if (data.created_at) {
		sql = `INSERT INTO ${table}(${rows.join(', ')}) values (${values})`;
	} else {
		sql = `INSERT INTO ${table}(${rows.join(
			', ',
		)}, created_at) values (${values} , datetime('now'))`;
	}

	return new Promise((resolve, reject) => {
		db.run(sql, async function (err) {
			if (err) return reject(err);

			try {
				let data = await getRow(table, this.lastID);
				resolve(data);
			} catch (error) {
				reject(error);
			}
		});
	});
};

const updateRow = (table, reqBody, id) => {
	// table, reqBody
	var pairs = ''; /* for constructing 'identifier = value, ...' */
	for (field of schema[table].slice(1)) {
		/* for every column except id */
		if (pairs) pairs += ', '; /* insert comma unless string is empty */
		pairs += `${field} = '${escape(reqBody[field])}'`; /* column = 'value' */
	}

	let sql = `UPDATE ${table} SET ${pairs} WHERE id = ${id}`; /* ? = reqBody['id'] */

	return new Promise((resolve, reject) => {
		db.run(sql, async function (err) {
			if (err) reject(err);
			let data = await getRow(table, id);
			resolve(data);
		});
	});
};

const deleteRow = (table, id) => {
	let sql = `DELETE FROM ${table} WHERE id = ${id}`;
	return new Promise((resolve, reject) => {
		db.run(sql, function (err) {
			if (err) reject(err);
			resolve({});
		});
	});
};

const deleteAllRows = (table, condition = null) => {
	let sql = !condition
		? `DELETE FROM ${table}`
		: `DELETE FROM ${table} ${condition}`;
	return new Promise((resolve, reject) => {
		db.run(sql, function (err) {
			if (err) reject(err);
			resolve({});
		});
	});
};

module.exports = {
	schema,
	runQuery,
	readTable,
	createRow,
	getRow,
	updateRow,
	deleteRow,
	deleteAllRows,
};
