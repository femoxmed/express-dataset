const express = require('express');
const { createActor, getAllActors, updateActor, getActor, deleteActor, deleteActors } = require( '../controllers/actors' );
const router = express.Router();

// Routes related to actor.

router.get('/', getAllActors);
router.get('/:id', getActor);
router.post('/', createActor);
router.put('/:id', updateActor);
router.delete('/', deleteActors);
router.delete('/:id', deleteActor);


module.exports = router;