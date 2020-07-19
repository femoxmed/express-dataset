var express = require('express');
const { eraseEvents } = require('../controllers/events');
var router = express.Router();

// Route related to delete events
router.delete('/', eraseEvents);

module.exports = router;
