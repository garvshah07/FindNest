import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    latitude: { type: String, required: true },
    longitude: { type: String, required: true },
    propertyage :{ type: String, required: true },
    propertyfor : { type: String, required: true },
    user :{ type: mongoose.Schema.Types.ObjectId, ref:'User'} 
  },
  { timestamps: true },
);

const Property = mongoose.model("Property", propertySchema);

export default Property;