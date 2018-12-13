const { Marker, validate } = require("../models/marker");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

router.get("/", async (req, res) => {
  const markers = await Genre.find();
  res.send(markers);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let marker = new Marker({ _id: req.body.id });
  marker = await marker.save();

  res.send(marker);
});

/*
router.put('/:id', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
    new: true
  });

  if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  
  res.send(genre);
});
*/

router.delete("/:id", async (req, res) => {
  const marker = await Marker.findByIdAndRemove(req.params.id);

  if (!marker)
    return res.status(404).send("The marker with the given ID was not found.");

  res.send(marker);
});

router.get("/:id", async (req, res) => {
  const marker = await Marker.findById(req.params.id);

  if (!marker)
    return res.status(404).send("The marker with the given ID was not found.");

  res.send(marker);
});

module.exports = router;
