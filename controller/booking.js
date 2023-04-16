const Booking = require('../model/bookings');
const { validationResult } = require('express-validator/check');

exports.postBooking = (req, res, next) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const contactNumber = req.body.contactNumber;
    const address = req.body.address;
    const pinCode = req.body.pinCode;
    const locationType = req.body.locationType;
    const bookingDate = req.body.bookingDate;
    const startingTime = req.body.startingTime;
    const desiredService = req.body.desiredService;
    const details = req.body.details;
    const userId = req.session.user._id;
    const bookingStatus = "Pending";
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.render('booking', {
            pageTitle: 'Dashboard | One Step Away Cleaner',
            path: "/SignUp",
            message: errors.array()[0].msg,
            messageClass: "errorFlash",
            contactNumber: contactNumber,
            address: address,
            pinCode: pinCode,
            locationType: locationType,
            bookingDate: bookingDate,
            startingTime: startingTime,
            desiredService: desiredService,
            dateOfBooking: dateNow,
            timeOfBooking: time,
            details: details,
        });
    }
    // Date and time 
    const date = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const dateNow = date.toLocaleDateString('en-US', options);
    const options2 = { hour: 'numeric', minute: 'numeric', hour12: true, timeZone: 'America/Toronto' };
    const time = new Date().toLocaleTimeString('en-US', options2);

    console.log(firstName, lastName, email, contactNumber, address, pinCode, locationType, bookingDate, startingTime, desiredService, dateNow, time, details);
    res.redirect('/dashboard');
    const booking = new Booking({
        userId: userId,
        firstName: firstName,
        lastName: lastName,
        email: email,
        contactNumber: contactNumber,
        address: address,
        pinCode: pinCode,
        locationType: locationType,
        bookingDate: bookingDate,
        startingTime: startingTime,
        desiredService: desiredService,
        dateOfBooking: dateNow,
        timeOfBooking: time,
        details: details,
        bookingStatus: bookingStatus
    })
    booking.save();
}

exports.getBookings = (req, res, next) => {
    const userId = req.session.user._id;


    Booking.find({ userId: userId })
        .then(bookingsData => {
            res.render('dashboardIncludes/manageServices', {
                pageTitle: 'My Bookings',
                bookings: bookingsData.reverse(),
                path: '/myBookings',
                message: null,
                messageClass: "",
            })
        })
        .catch(err => {
            console.log("Some Error Occured", err);
        })
}
exports.getAllBookings = (req, res, next) => {
    Booking.find()
        .then(bookingsData => {
            res.render('dashboardIncludes/requests', {
                pageTitle: 'Requests',
                bookings: bookingsData,
                path: '/Requests',
                message: null,
                messageClass: "",
            })
        })
        .catch(err => {
            console.log("Some Error Occured", err);
        })
}

// 
exports.getEditBooking = (req, res, next) => {
    const bookingId = req.params.bookingId;
    Booking.findById(bookingId)
        .then(booking => {
            res.render('booking', {
                pageTitle: 'Edit Booking',
                path: '/editBooking',
                firstName: booking.firstName,
                lastName: booking.lastName,
                email: booking.email,
                message: booking.details,
                contactNumber: booking.contactNumber,
                address: booking.address,
                pinCode: booking.pinCode,
                locationType: booking.locationType,
                bookingDate: booking.bookingDate,
                startingTime: booking.startingTime,
                desiredService: booking.desiredService,
                dateOfBooking: booking.dateOfBooking,
                timeOfBooking: booking.timeOfBooking,
                details: booking.details,
                message: null,
                messageClass: '',
                bookingId: bookingId
            })
        })
}

exports.postEditBooking = (req, res, next) => {
    const bookingId = req.body.bookingId;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const contactNumber = req.body.contactNumber;
    const address = req.body.address;
    const pinCode = req.body.pinCode;
    const locationType = req.body.locationType;
    const bookingDate = req.body.bookingDate;
    const startingTime = req.body.startingTime;
    const desiredService = req.body.desiredService;
    const details = req.body.details;
    const userId = req.session.user._id;
    const bookingStatus = "Pending";
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.render('dashboard', {
            pageTitle: 'Edit Booking | One Step Away Cleaner',
            path: "/editBooking",
            firstName: firstName,
            lastName: lastName,
            email: email,
            message: errors.array()[0].msg,
            messageClass: "errorFlash",
            contactNumber: contactNumber,
            address: address,
            pinCode: pinCode,
            locationType: locationType,
            bookingDate: bookingDate,
            startingTime: startingTime,
            desiredService: desiredService,
            dateOfBooking: '',
            timeOfBooking: '',
            details: details,
        });
    }


    Booking.findById(bookingId)
        .then(booking => {
            booking.firstName = firstName;
            booking.lastName = lastName;
            booking.email = email;
            booking.contactNumber = contactNumber;
            booking.address = address;
            booking.pinCode = pinCode;
            booking.locationType = locationType;
            booking.bookingDate = bookingDate;
            booking.startingTime = startingTime;
            booking.desiredService = desiredService;
            booking.details = details;

            booking.save().then(result => {
                console.log(result);
            }).then(result => {
                Booking.find({ userId: req.session.user._id })
                    .then(bookingsData => {
                        res.render('dashboardIncludes/manageServices', {
                            pageTitle: 'My Bookings',
                            bookings: bookingsData.reverse(),
                            path: '/myBookings',
                            message: "Booking Details Edited Successfully",
                            messageClass: "successFlash",
                        })
                    })
                    .catch(err => {
                        console.log("Some Error Occured", err);
                    })
            })
        })
}

exports.deleteBooking = (req, res, next) => {
    const bookingId = req.body.bookingId;
    console.log(bookingId)
    Booking.findByIdAndDelete(bookingId)
        .then(result => {
            console.log(result);
            console.log('Booking Deleted');
            Booking.find({ userId: req.session.user._id })
                .then(bookingsData => {
                    res.render('dashboardIncludes/manageServices', {
                        pageTitle: 'My Bookings',
                        bookings: bookingsData.reverse(),
                        path: '/myBookings',
                        message: "Booking Canceled Successfully",
                        messageClass: "successFlash",
                    })
                })
                .catch(err => {
                    console.log("Some Error Occured", err);
                })
        })
}
exports.getBookingsById = (req, res, next) => {
    const bookingId = req.params.bookingId;
    Booking.findById(bookingId)
        .then(bookingsData => {
            res.render('dashboardIncludes/requestDetails', {
                pageTitle: 'Booking Details',
                booking: bookingsData,
                path: '/myBookings',
                message: null,
                messageClass: "",
            })
        })
        .catch(err => {
            console.log("Some Error Occured", err);
        })
}

exports.acceptBooking = (req, res, next) => {
    const cleanerFName = req.body.firstName;
    const cleanerLName = req.body.lastName;
    const bookingId = req.body.bookingId;
    const contactNumber = req.body.contactNumber;
    const cleanersMessage = req.body.cleanersMessage;
    const cleanerDetails = [{
        firstName: cleanerFName,
        lastName: cleanerLName,
        contactNumber: contactNumber,
        cleanersMessage: cleanersMessage
    }]
    Booking.findById(bookingId)
        .then(booking => {
            booking.cleanerDetails = cleanerDetails;
            booking.bookingStatus = "Ongoing";
            booking.save();
            res.redirect('/requests')
        })
}