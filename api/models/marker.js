const mongoose = require("mongoose");
const mongo = require("../connectors/mongo");

const markerSchema = new mongoose.Schema({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  date: { type: Date, default: Date.now, required: true },
  pictures: { type: [String], required: true },
  user_id: { type: String, required: true }
});

/* Create the model from the schema. */
const Marker = mongoose.model("Marker", markerSchema);

function validateMarker(marker) {
  const schema = {
    _id: Joi.string()
  };

  return Joi.validate(marker, schema);
}

exports.Marker = Marker;
exports.validate = validateMarker;

/*
async function createMarker() {
  const marker = new Marker({
    lat: 12,
    lng: 13,
    pictures: ["hola"]
  });
  try{
    const result = await marker.save();
  console.log(result);
  }
  catch(ex){
    for(field in ex.errors){
      console.log(ex.errors[field].message);
    }
    
  }
}

createMarker();
*/
