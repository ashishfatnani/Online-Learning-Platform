const Admin = require("../models/Admin");
const Publisher = require("../models/Publisher");
const Student = require("../models/Student");
const { ObjectId } = require("mongodb");

// FUNCTION TO DEDUCT MONEY FROM STUDENT ACCOUNT UPON COURSE PURCHASE
exports.deductMoneyFromStudentAccount = async (
  student_id,
  courseFee,
  studentAccountBalance,
  courseName,
  courseId
) => {
  const remainingBalance = studentAccountBalance - courseFee;

  await Student.updateOne(
    {
      _id: new ObjectId(student_id),
    },
    {
      $set: {
        balance: remainingBalance,
      },

      $push: {
        coursesEnrolled: [
          { course_name: courseName, date_of_purchase: new Date(), courseId },
        ],
      },
    }
  );
};

exports.creditMoneyToPublisherAccount = async (
  publisher_id,
  publisher_credit
) => {
  const currentBalanceOfPublisher = await Publisher.findOne({
    _id: new ObjectId(publisher_id),
  });

  const updatedBalance =
    currentBalanceOfPublisher.amountEarned + publisher_credit;

  await Publisher.updateOne(
    {
      _id: new ObjectId(publisher_id),
    },
    {
      $set: {
        amountEarned: updatedBalance,
      },
    }
  );
};

exports.creditMoneyToPortal = async (portal_credit) => {
  const currentBalanceOfPortal = await Admin.findOne({
    _id: new ObjectId(process.env.ATLAS_ADMIN_ID),
  });

  const updatedBalance = currentBalanceOfPortal.totalRevenue + portal_credit;

  await Admin.updateOne(
    {
      _id: new ObjectId(process.env.ATLAS_ADMIN_ID),
    },
    {
      $set: {
        totalRevenue: updatedBalance,
      },
    }
  );
};
