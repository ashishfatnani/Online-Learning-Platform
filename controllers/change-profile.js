const Student = require("../models/Student");
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const Publisher = require("../models/Publisher");
const saltRounds = 10; 

exports.changeStudentPassword = async (req, res, next)=>{

    const studentInDB = await Student.findOne({_id: new ObjectId(req.student_id)});
 
    const matchCurrentPassword = bcrypt.compare(req.body.currentPassword, studentInDB.password);

    if(!matchCurrentPassword){
        res.send('The Current Password do not match with existing password').status(500);
        return;
    }

    const changedPassword = await bcrypt.hash(req.body.newPassword, saltRounds);

    await Student.updateOne({
        _id: new ObjectId(req.student_id)
    },{
        $set:{
            password: changedPassword
        }
    });

    res.send(`Password updated successfully for student ${req.student_id}`);
}




exports.changePublisherPassword = async (req, res, next)=>{

    const publisherInDB = await Publisher.findOne({_id: new ObjectId(req.publisher_id)});
 
    
    const matchCurrentPassword = bcrypt.compare(req.body.currentPassword, publisherInDB.password);

    if(!matchCurrentPassword){
        res.send('The Current Password do not match with existing password').status(500);
        return;
    }

    const changedPassword = await bcrypt.hash(req.body.newPassword, saltRounds);

    await Publisher.updateOne({
        _id: new ObjectId(req.publisher_id)
    },{
        $set:{
            password: changedPassword
        }
    });

    res.send(`Password updated successfully for publisher  ${req.publisher_id}`);
}



