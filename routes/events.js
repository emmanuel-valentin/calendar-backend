const express = require('express');
const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/events');
const { validateJwt } = require('../middlewares/validateJwt');
const { check } = require('express-validator');
const { validate } = require('../middlewares/fieldValidator');
const { isDate } = require('../helpers/isDate');

const router = express.Router();

router.use(validateJwt);

router.get('/', getEvents);

router.post(
  '/',
  [
    check('title', 'El título es requerido').not().isEmpty(),
    check('start', 'La fecha de inicio es requerida').custom(isDate),
    check('end', 'La fecha de finalización es requerida').custom(isDate),
    validate,
  ],
  createEvent
);

router.put('/:id', updateEvent);

router.delete('/:id', deleteEvent);

module.exports = router;
