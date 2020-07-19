	const dataRepository = require('../database/repository');
	const { responseMethod } = require( '../helpers/responseMethod' );



		const getStreak = () => {
			
		};
		
		const getAllActors = async  (req, res) => {
			try {
				const actors = await dataRepository.readTable('actors');
				res.status(200).json(actors);
			} catch (error) {
				throw new Error(error);
			}
		};
		

		// async read
			var fs = require("fs");
			
		const createActor = async (req, res) => {
			try {
				const { login, avatar_url , created_at} = req.body;
				let data = { login ,avatar_url , created_at }
				data.avatar_url = JSON.stringify(avatar_url)
				  
			
				const isExist = await dataRepository.readTable('actors',`WHERE login = '${login}'`);
				if(isExist.length > 0)  return responseMethod(res,409,'User with Login exists')
				const actor = await dataRepository.createRow('actors', data);
				res.status(201).json(actor);			
			} catch (error) {
				throw new Error(error);
			}
		};
																					
		// Not required
		const getActor = async ( req, res) => {
			try {
				const actor = await dataRepository.getRow('actors', req.params.id)
				if(!actor) return responseMethod(res,404,'User dont exist')
				console.log(JSON.parse(actor.avatar_url))
				res.send({'hi':JSON.parse(actor.avatar_url)});			
			} catch (error) {
				throw new Error(error);
			}
		};

		//not required
		const updateActor = async  (req, res) => {
			try {
				const isExist = await dataRepository.getRow(req.params.id);
				if(!isExist)  return responseMethod(res,404,'Not Found')
				const updateActor = await dataRepository.updateRow('actors', req.body, isExist.id)
				res.status(200).json(updateActor);
			} catch (error) {
				throw new Error(error);
			}
		};

		//not required
		const deleteActor = async  (req, res) => {
			try {
			const isExist = await dataRepository.getRow('actors', req.params.id);
			if(!isExist)  return responseMethod(res,404,'Not Found')
			await dataRepository.deleteRow('actors', isExist.id)
			res.sendStatus(200)
			} catch (error) {
				throw new Error(error);
			}
			
		}

		//not required
		const deleteActors = async  (req, res) => {
			try {
				 await dataRepository.deleteAllRows('actors')
				res.sendStatus(200)
			} catch (error) {
				throw new Error(error);
			}
			
		};



	module.exports = { createActor, updateActor, getActor , getAllActors, getStreak , deleteActor, deleteActors};