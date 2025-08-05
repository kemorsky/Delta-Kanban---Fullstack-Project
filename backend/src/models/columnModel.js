import mongoose from 'mongoose';

export const columnSchema = new mongoose.Schema(
    { 
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        title: {
            type: String,
            required: true,
            minLength: 1
        },
        order: {
            type: Number,
            required: true,
            default: 0
        },
    },
        {
            timestamps: true
        }
);

columnSchema.virtual('id').get(function() {
  return this._id.toString();
});

columnSchema.options.toJSON = { virtuals: true };
