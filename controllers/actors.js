const dataRepository = require('../database/repository');
const { responseMethod } = require('../hooks/responseMethod');
const { getAllEvents } = require('./events');
const e = require('express');

// const checkDuplicateTie
const getStreak = async (req, res) => {
	// 	const actors = await dataRepository.readTable('actors');
	// 	const events = await getAllEvents(req, res);
	// 	let actorsStreak = await Promise.all(
	// 		actors.map( data =>
	// 		{
	// 		})
	// 	)
};

const getAllActors = async (req, res) => {
	try {
		const actors = await dataRepository.readTable('actors');
		res.status(200).json(actors);
	} catch (error) {
		throw new Error(error);
	}
};

const createActor = async (req, res) => {
	try {
		const { login, avatar_url } = req.body;
		const data = { login, avatar_url };
		const isExist = await dataRepository.readTable(
			'actors',
			`WHERE login = '${login}'`,
		);
		if (isExist.length > 0)
			return responseMethod(res, 409, 'Actor with Login exists');
		const actor = await dataRepository.createRow('actors', data);
		res.status(201).json(actor);
	} catch (error) {
		console.log(error);
		return responseMethod(res, 400, error);
	}
};

const getActor = async (req, res) => {
	try {
		const actor = await dataRepository.getRow('actors', req.params.id);
		if (!actor) return responseMethod(res, 404, 'User dont exist');
		res.status(201).json(actor);
	} catch (error) {
		return responseMethod(res, 400, error);
	}
};

const updateActor = async (req, res) => {
	try {
		const isExist = await dataRepository.getRow(req.params.id);
		if (!isExist) return responseMethod(res, 404, 'Not Found');
		const updateActor = await dataRepository.updateRow(
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
		const isExist = await dataRepository.getRow('actors', req.params.id);
		if (!isExist) return responseMethod(res, 404, 'Not Found');
		await dataRepository.deleteRow('actors', isExist.id);
		res.sendStatus(200);
	} catch (error) {
		return responseMethod(res, 400, error);
	}
};

const deleteActors = async (req, res) => {
	try {
		await dataRepository.deleteAllRows('actors');
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
