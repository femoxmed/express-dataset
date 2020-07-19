const express = require('express');
const {
	createActor,
	getAllActors,
	updateActor,
	// getActor,
	// deleteActor,
	// deleteActors,
	getStreak,
} = require('../controllers/actors');
const router = express.Router();

// Routes related to actor.

// Routes related to actor.
router.post('/', createActor);
router.get('/', getAllActors);
router.get('/streak', getStreak);
router.put('/', updateActor);

// router.put('/:id', updateActor);
// router.get('/:id', getActor);
// router.delete('/', deleteActors);
// router.delete('/:id', deleteActor);

module.exports = router;
