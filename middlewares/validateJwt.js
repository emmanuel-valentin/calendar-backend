const { request, response } = require('express');
const jwt = require('jsonwebtoken');

const validateJwt = (req = request, res = response, next) => {
  const token = req.header('x-token');

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: 'No existen token alguno en la petición',
    });
  }

  try {
    const { uid, name } = jwt.verify(token, process.env.SECRET_JWT_SEED);

    req.uid = uid;
    req.name = name;
  } catch (err) {
    return res.status(401).json({
      ok: false,
      msg: 'Token no válido',
    });
  }

  next();
};

module.exports = { validateJwt };
