import mongoose from "mongoose";

export const labelSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        }
    }
)

labelSchema.virtual('labelId').get(function() {
  return this._id.toString();
});

labelSchema.set('toJSON', { virtuals: true });
labelSchema.set('toObject', { virtuals: true });