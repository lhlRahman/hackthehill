// ./models/mission.js
import mongoose from "mongoose";

const { Schema, model } = mongoose;

const missionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
    required: true,
    maxlength: 47,
  },
  detail: {
    type: String,
    maxlength: 108,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
  },
  dateDue: {
    type: Date,
    required: true,
  },
  dateCreated: {
    type: Date,
    default: new Date(),
  },
  dateUpdated: Date,
  location: {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  repeat: String,
  link: String,
  priority: {
    type: Number,
    min: 0,
    max: 2,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  success: {
    type: Boolean,
    default: false,
  },
});

missionSchema.index({ location: "2dsphere" });

const Mission = model("Mission", missionSchema);
export default Mission;
