import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  column: { type: String, required: true },
  alarmDate: Date,
  alarmDateTime: Date,
});

taskSchema.set('strict', true);
taskSchema.pre('validate', function(next) {
  next();
});

export const Task = mongoose.model("Task", taskSchema);
