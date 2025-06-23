import mongoose from 'mongoose';

export const todoSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        columnId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Column',
            required: true
        },
        title: {
            type: String,
            required: true,
            minLength: 1
        },
        description: {
            type: String,
        },
        comment: {
            type: String,
            required: false,
        },
    }, {
        timestamps: true
        }
);

todoSchema.virtual('id').get(function() {
  return this._id.toString();
});

todoSchema.options.toJSON = { virtuals: true };
