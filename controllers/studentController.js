const Student = require("../models/Student");


exports.register = function(req, res, next) {
  const student = new Student({
    first_name: req.body.first_name,
    last_name: req.body.last_name
    
  });

  student.save().then(result => {
    res.status(201).json({
      message: "Student Registered",
      student: result
    });
  }).catch(err => {
      res.status(422).json(err)
  })
};
