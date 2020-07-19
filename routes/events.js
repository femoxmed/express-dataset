var express = require('express');
var router = express.Router();
const {
	getAllEvents,
	addEvent,
	getByActor,
	eraseEvents,
} = require('../controllers/events');
// Routes related to event

// Routes related to event
router.post('/', addEvent);
router.get('/', getAllEvents);
router.get('/actors/:actorID', getByActor);

module.exports = router;
