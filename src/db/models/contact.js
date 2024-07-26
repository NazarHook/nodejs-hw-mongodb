import { Schema, model } from "mongoose";
import { mongooseSaveError, setUpdateSettings } from "./hooks.js";

const contactSchema = new Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String },
  isFavourite: { type: Boolean, default: false },
  contactType: { type: String, enum: ['work', 'home', 'personal'], required: true, default: 'personal' },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
}
}, {
  timestamps: true,
  versionKey: false
});

contactSchema.post("save", mongooseSaveError);

contactSchema.pre("findOneAndUpdate", setUpdateSettings);

contactSchema.post("findOneAndUpdate", mongooseSaveError);

const Contact = model('Contact', contactSchema);

export default Contact; 
