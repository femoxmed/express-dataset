const dbRepository = require('../database/repository');
const { responseMethod } = require('../hooks/responseMethod');

const getAllEvents = async (req, res) => {
	try {
		const orderBy = ' ORDER BY id ASC';
		let eventRecords = await dbRepository.readTable('events', ' ', orderBy);
		//populate actor and repo with ther respective data
		eventRecords = await Promise.all(
			eventRecords.map(async (event) => {
				const repo = await dbRepository.getRow('repos', event.repo_id);
				const actor = await dbRepository.getRow('actors', event.actor_id);
				const { id, type, created_at } = event;
				return {
					id,
					type,
					actor,
					repo,
					created_at,
				};
			}),
		);
		res.status(200).json(eventRecords);
	} catch (error) {
		return responseMethod(res, 400, error);
	}
};

//checks if repo and actor exists then creates it if it doesnt
const createRepoActorIfNotExist = async (repo, actor) => {
	return new Promise(async (resolve, reject) => {
		try {
			const repoExist = await dbRepository.getRow('repos', repo.id);
			const actorExist = await dbRepository.getRow('actors', actor.id);
			if (actorExist && repoExist) {
				return resolve(true);
			} else {
				if (!repoExist) {
					await dbRepository.createRow('repos', {
						...repo,
						actor_id: actor.id,
					});
				}
				if (!actorExist) {
					await dbRepository.createRow('actors', actor);
				}
				return resolve(true);
			}
		} catch (error) {
			console.log('ss', error);
			reject(error);
		}
	});
};

//add an event
const addEvent = async (req, res) => {
	//push events
	const eventTypes = ['PushEvent', 'PullEvent'];
	try {
		//destructured req body
		const { id, type, actor, repo, created_at } = req.body;

		//valdating actor
		if (!id || isNaN(id))
			return responseMethod(res, 400, 'id missing in payload');
		if (!actor || !actor.hasOwnProperty('id'))
			return responseMethod(res, 400, 'actor cannot be empty');

		//validating repo
		if (!repo.hasOwnProperty('id'))
			return responseMethod(res, 400, 'repo cannot be empty');

		//validating event type
		if (!eventTypes.includes(type))
			return responseMethod(res, 400, 'invalid event type');

		//checks repo and actor in database and creates the record if !exists
		const event = await dbRepository.getRow('events', id);
		if (event) responseMethod(res, 400, 'Event With this id exists');

		let check = await createRepoActorIfNotExist(repo, actor);
		if (check) {
			const eventObject = {
				id,
				type,
				created_at,
				actor_id: actor.id,
				repo_id: repo.id,
			};

			//creates the new event record
			const newEvent = await dbRepository.createRow('events', eventObject);

			if (newEvent) {
				return responseMethod(res, 201, 'events record created successfully');
			}
		}
	} catch (error) {
		console.log(error);
		return responseMethod(res, 400, error);
	}
};

const getByActor = async (req, res) => {
	const { actorID } = req.params;

	// validating inputs
	if (!actorID || isNaN(actorID))
		return res.status(400).json({ message: 'Invalid  Actor id' });

	let actor = await dbRepository.getRow('actors', actorID);

	if (!actor) return res.status(400).json({ message: ' Invalid Actor' });

	// fetches all events created by actor
	const condition = `WHERE events.actor_id = ${actor.id}`;
	let eventsByActor = await dbRepository.readTable('events', condition);

	eventsByActor = await Promise.all(
		eventsByActor.map(async (event) => {
			const repo = await dbRepository.getRow('repos', event.repo_id);
			const { id, type, created_at } = event;
			return {
				id,
				type,
				actor,
				repo,
				created_at,
			};
		}),
	);

	res.send(eventsByActor);
};

const eraseEvents = async (req, res) => {
	const deleteRows = await dbRepository.deleteAllRows('events');

	// All rows has been deleted
	if (Object.keys(deleteRows).length === 0) {
		res.sendStatus(200);
	}
};

module.exports = {
	getAllEvents,
	addEvent,
	getByActor,
	eraseEvents,
};
