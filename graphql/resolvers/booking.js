
const Booking = require('../../models/booking');
const Event = require('../../models/event');
const { dateToString } = require('../../utils/date');
const {singleEvent, user, transformEvent, transformBooking} = require('./merge');

module.exports = {
    bookings: async (args,req) => {
        if(!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return transformBooking(booking)
            })
        } catch (err) {

        }
    },
    bookEvent: async (args, req) => {
        if(!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
        const fetchedEvent = await Event.findOne({ _id: args.eventId });
        const booking = new Booking({
            user: '5cf52b7f04c4a24fbc5f48c9',
            event: fetchedEvent
        });
        const result = await booking.save();
        return transformBooking(result)
    },
    cancelBooking: async (args, req) => {
        if(!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
        try {
            const booking = await Booking.findById(args.bookingId).populate('event');
            const event = transformEvent(booking.event)
            await Booking.deleteOne({ _id: args.bookingId })
            return event;
        } catch (err) {
            throw err;
        }
    }
}