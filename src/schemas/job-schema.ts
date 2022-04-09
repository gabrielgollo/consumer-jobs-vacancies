import mongoose from "mongoose";

export const JobSchema = new mongoose.Schema({
    idJob: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    location: {
        type: String,
        default: ''
    },
    link: {
        type: String,
        required: true
    },
    isRemoteJob: {
        type: Boolean,
    },
    company: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
})