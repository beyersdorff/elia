const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Farmer = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password_hash: { type: String, required: true },
        salt: {type: String, required: true},
        description: { type: String, required: true },
        tourism: {
            type: {
                description: { type: String, required: true },
                region_title: { type: String, required: true },
                region_description: { type: String, required: true },
                activity_description: { type: String, required: true },
                title_picture: { type: String, required: true },
                region_pictures: { type: [String], required: true },
                accomodation_pictures: { type: [String], required: true },
                activity_pictures: { type: [String], required: true },
                roomCapacity: { type: Number, required: true},
                bookingRequests: {
                    type: [{
                        user: {type: mongoose.Schema.Types.ObjectId, ref: 'users', required: false},
                        firstName: {type: String, required: function() {
                            return !this.user;
                        }},
                        lastName: {type: String, required: function() {
                            return !this.user;
                        }},
                        email: {type: String, required: function() {
                            return !this.user;
                        }},
                        startDate: {type: Date, required: true},
                        endDate: {type: Date, required: true},
                        numberPeople: {type: Number, required: true},
                        numberRooms: {type: Number, required: true},
                        introText: {type: String, required: true},
                        accepted: {type: Boolean, required: true, default: false}
                    }],
                    required: true
                }
            },
            required: false
        },
        profile_picture: { type: String, required: true },
        pictures: { type: [String], required: true },
    },
    { timestamps: true },
)

module.exports = mongoose.model('farmers', Farmer)