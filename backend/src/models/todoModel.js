import mongoose from 'mongoose';

export const todoSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
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
            required: true
        },
        comment: {
            type: String,
            required: false,
        },
        order: {
            type: Number,
            required: true,
            default: 0
        },
        labels: [
            {
                type: String,
            }
        ]
    }, {
        timestamps: true
        }
);

todoSchema.virtual('id').get(function() {
  return this._id.toString();
});

todoSchema.options.toJSON = { virtuals: true };
