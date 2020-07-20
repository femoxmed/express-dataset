const dbRepository = require('../database/repository');
const { responseMethod } = require('../hooks/responseMethod');

//count number if items an item appear in an array
const countInArray = (arr, val) => {
	return arr.reduce((count, item) => count + (item == val), 0);
};

// const checkDuplicateTie
const getStreak = async (req, res) => {
	try {
		const actors = await dbRepository.readTable('actors');
		const orderBy = ' ORDER BY id ASC';
		let eventRecords = await dbRepository.readTable('events', ' ', orderBy);

		// get event record with their actor login
		eventRecords = await Promise.all(
			eventRecords.map(async (event) => {
				const actor = await dbRepository.getRow('actors', event.actor_id);
				const { id, type, created_at } = event;
				let newcreated_at = new Date(created_at);

				return {
					id,
					actor,
					timestamp: newcreated_at.valueOf(),
					created_at: newcreated_at.toDateString(),
				};
			}),
		);

		// get the  events and their timestamps for each actor for each day
		let streaksData = await Promise.all(
			actors.map(async (actor) => {
				let er = await eventRecords
					.filter((eventRecord) => {
						return actor.login == eventRecord.actor.login;
					})
					.map((evrmapped) => {
						return evrmapped.created_at;
					});

				let timestamp = await eventRecords
					.filter((eventRecord) => {
						return actor.login == eventRecord.actor.login;
					})
					.map((evrmapped) => {
						return evrmapped.timestamp;
					});

				//removes duplicate data
				let unique = [...new Set(er)];

				// gets the max time stamp
				let maxNumber = Math.max(...timestamp);

				return {
					id: actor.id,
					login: actor.login,
					avatar_url: actor.avatar_url,
					timestamps: maxNumber,
					streaks: unique.length,
				};
			}),
		);
		//getting list of number of streas and check if the max number repeats
		let list_of_streaks = streaksData.map((strk) => strk.streaks);
		let maxNumber = Math.max(...list_of_streaks);
		let count = countInArray(list_of_streaks, maxNumber);

		// if max number of streaks is > 1 sort by timestamp instead
		let finalActorStreaks;
		if (count > 1) {
			finalActorStreaks = streaksData.sort(function (a, b) {
				return b.timestamps - a.timestamps;
			});
		} else {
			finalActorStreaks = streaksData.sort(function (a, b) {
				return b.streaks - a.streaks;
			});
		}

		//sendind the appropriate response
		let result = finalActorStreaks.map(({ id, login, avatar_url }) => {
			return { id, login, avatar_url };
		});
		res.send(result);
	} catch (error) {
		return responseMethod(res, 400, error);
	}
};

const getAllActors = async (req, res) => {
	try {
		const actors = await dbRepository.readTable('actors');
		res.status(200).json(actors);
	} catch (error) {
		return responseMethod(res, 400, error);
	}
};

const createActor = async (req, res) => {
	try {
		const { login, avatar_url } = req.body;
		const data = { login, avatar_url };
		const isExist = await dbRepository.readTable(
			'actors',
			`WHERE login = '${login}'`,
		);
		if (isExist.length > 0)
			return responseMethod(res, 409, 'Actor with Login exists');
		const actor = await dbRepository.createRow('actors', data);
		res.status(201).json(actor);
	} catch (error) {
		console.log(error);
		return responseMethod(res, 400, error);
	}
};

const getActor = async (req, res) => {
	try {
		const actor = await dbRepository.getRow('actors', req.params.id);
		if (!actor) return responseMethod(res, 404, 'User dont exist');
		res.status(201).json(actor);
	} catch (error) {
		return responseMethod(res, 400, error);
	}
};

const updateActor = async (req, res) => {
	try {
		const isExist = await dbRepository.getRow(req.params.id);
		if (!isExist) return responseMethod(res, 404, 'Not Found');
		const updateActor = await dbRepository.updateRow(
			'actors',
			req.body,
			isExist.id,
		);
		res.status(200).json(updateActor);
	} catch (error) {
		return responseMethod(res, 400, error);
	}
};

const deleteActor = async (req, res) => {
	try {
		const isExist = await dbRepository.getRow('actors', req.params.id);
		if (!isExist) return responseMethod(res, 404, 'Not Found');
		await dbRepository.deleteRow('actors', isExist.id);
		res.sendStatus(200);
	} catch (error) {
		return responseMethod(res, 400, error);
	}
};

const deleteActors = async (req, res) => {
	try {
		await dbRepository.deleteAllRows('actors');
		res.sendStatus(200);
	} catch (error) {
		return responseMethod(res, 400, error);
	}
};

module.exports = {
	createActor,
	updateActor,
	getActor,
	getAllActors,
	getStreak,
	deleteActor,
	deleteActors,
};
