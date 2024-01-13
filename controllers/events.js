const { request, response } = require('express');
const Event = require('../models/Event');

const createEvent = async (req = request, res = response) => {
  const event = new Event(req.body);

  try {
    event.user = req.uid;
    const savedEvent = await event.save();

    res.json({
      ok: true,
      event: savedEvent,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      ok: false,
      msg: '¡Opps! Algo salió mal. Contacte al administrador.',
    });
  }
};

const deleteEvent = async (req = request, res = response) => {
  const eventId = req.params.id;

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        ok: false,
        msg: 'El evento no existe. Intente nuevamente.',
      });
    }

    if (event.user.toString() !== req.uid) {
      return res.status(401).json({
        ok: false,
        msg: 'No tiene privilegios para eliminar este evento.',
      });
    }

    await Event.findByIdAndDelete(eventId);

    res.json({
      ok: true,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      ok: false,
      msg: '¡Opps! Algo salió mal. Contacte al administrador.',
    });
  }
};

const getEvents = async (req = request, res = response) => {
  try {
    console.log(req.uid);
    const events = await Event.find().populate('user', 'name');

    res.json({
      ok: true,
      events,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      ok: false,
      msg: '¡Opps! Algo salió mal. Contacte al administrador.',
    });
  }
};

const updateEvent = async (req = request, res = response) => {
  const eventId = req.params.id;

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        ok: false,
        msg: 'El evento no existe. Intente nuevamente.',
      });
    }

    if (event.user.toString() !== req.uid) {
      return res.status(401).json({
        ok: false,
        msg: 'No tiene privilegios para editar este evento.',
      });
    }

    const newEvent = {
      ...req.body,
      user: req.uid,
    };

    const updatedEvent = await Event.findByIdAndUpdate(eventId, newEvent, {
      new: true,
    });

    res.json({
      ok: true,
      event: updatedEvent,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      ok: false,
      msg: '¡Opps! Algo salió mal. Contacte al administrador.',
    });
  }
};

module.exports = {
  createEvent,
  deleteEvent,
  getEvents,
  updateEvent,
};
