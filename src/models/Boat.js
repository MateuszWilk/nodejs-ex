import mongoose from 'mongoose';

const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

const boat = new Schema({
    id: ObjectId,
    name: String,
    lat: Number,
    lng: Number,
    date: Date
});

mongoose.model('boat', boat);
