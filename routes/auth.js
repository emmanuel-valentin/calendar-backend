const express = require('express');
const { createUser, loginUser, renewToken } = require('../controllers/auth');
const { validate } = require('../middlewares/fieldValidator');
const { check } = require('express-validator');
const { validateJwt } = require('../middlewares/validateJwt');

const router = express.Router();

router.post(
  '/new',
  [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El correo electrónico es obligatorio')
      .isEmail()
      .not()
      .isEmpty(),
    check('password', 'La contraseña es obligatoria').isLength({ min: 8 }),
    validate,
  ],
  createUser
);

router.post(
  '/',
  [
    check('email', 'El correo electrónico es obligatorio')
      .isEmail()
      .not()
      .isEmpty(),
    check('password', 'La contraseña es obligatoria').isLength({ min: 8 }),
    validate,
  ],
  loginUser
);

router.get('/renew', validateJwt, renewToken);

module.exports = router;
