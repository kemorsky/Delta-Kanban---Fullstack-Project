import mongoose from "mongoose";

export const labelSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        }
    }
)

labelSchema.virtual('labelTitle').get(function() {
  return this.title.toUpperCase();
});

labelSchema.options.toJSON = { virtuals: true };