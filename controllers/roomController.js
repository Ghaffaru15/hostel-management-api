const Room = require("../models/Room");

const Student = require("../models/Student");

exports.add = (req, res, next) => {
  Room.find({
    roomNumber: req.body.room_number
  })
    .exec()
    .then(docs => {
      if (docs.length > 0) {
        res.status(422).json({
          error: "Room already added"
        });
      } else {
        const room = new Room({
          roomNumber: req.body.room_number,
          capacity: req.body.capacity,
          furniture: req.body.furniture,
          price: req.body.price
        });

        room
          .save()
          .then(result => {
            res.status(200).json({
              message: "Room Added"
            });
          })
          .catch(err => {
            res.status(422).json(err);
          });
      }
    });
};

exports.update = (req, res, next) => {
  const _id = req.params.room_id;
  Room.findById(_id)
    .exec()
    .then(room => {
      const data = {
        roomNumber: req.body.room_number
          ? req.body.room_number
          : room.roomNumber,
        furniture: req.body.furniture ? req.body.furniture : room.furniture,
        capacity: req.body.capacity ? req.body.capacity : room.capacity,
        price: req.body.price ? req.body.price : room.price
      };
      Room.updateOne(
        { _id: _id },
        {
          $set: {
            roomNumber: data.roomNumber,
            furniture: data.furniture,
            capacity: data.capacity,
            price: data.price
          }
        }
      )
        .exec()
        .then(result => {
          res.status(200).json({
            message: "Room Updated",
            room: result
          });
        })
        .catch(err => {
          res.status(500).json(err);
        });
    })
    .catch(err => {
      res.status(404).json({
        error: err
      });
    });
};

exports.index = (req, res, next) => {
  Room.find()
    .select("_id roomNumber capacity furniture price")
    .exec()
    .then(docs => {
      res.status(200).json({
        rooms: docs
      });
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

exports.show = (req, res, next) => {
  Room.findById({ _id: req.params.room_id }).select('_id roomNumber capacity furniture price')
    .exec()
    .then(room => {
      Student.find({ room: room._id, exit: false })
        .exec()
        .then(docs => {
          const numOfStudents = docs.length;
          room["numOfStudents"] = numOfStudents;
          res.status(200).json({
            room: room,
            numOfStudents: numOfStudents
          });
        });
    })
    .catch(err => {
      res.status(500).json(err);
    });
};
