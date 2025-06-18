const sendEmail = require('../firebase/functions/sendEmail');
const cleanupExpiredReports = require('../firebase/functions/cleanupExpiredReports');

exports.sendEmail = sendEmail.sendEmail;
exports.cleanupExpiredReports = cleanupExpiredReports.cleanupExpiredReports;
