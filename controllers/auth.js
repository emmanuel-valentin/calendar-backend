const { request, response } = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const { generateJWT } = require('../helpers/jwt');

const createUser = async (req = request, res = response) => {
  const { email } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        ok: false,
        msg: 'Este usuario ya se encuentra registrado. Intenta nuevamente.',
      });
    }

    user = new User(req.body);

    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(user.password, salt);

    await user.save();

    const token = await generateJWT(user.id, user.name);

    res.status(201).json({ ok: true, uid: user.id, name: user.name, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      ok: false,
      msg: '¡Opps! Algo salió mal. Contacte al administrador.',
    });
  }
};

const loginUser = async (req = request, res = response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: 'Parece que algo no está bien. Comprueba tus credenciales',
      });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        ok: false,
        msg: 'Contraseña no válida. Intenta nuevamente.',
      });
    }

    const token = await generateJWT(user.id, user.name);

    res.json({ ok: true, uid: user.id, name: user.name, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      ok: false,
      msg: '¡Opps! Algo salió mal. Contacte al administrador.',
    });
  }
};

const renewToken = async (req = request, res = response) => {
  const { uid, name } = req;
  const token = await generateJWT(uid, name);

  res.json({ ok: true, token });
};

module.exports = {
  createUser,
  loginUser,
  renewToken,
};
