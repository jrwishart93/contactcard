const sendEmail = require('./lib/sendEmail');
const cleanupExpiredReports = require('./lib/cleanupExpiredReports');

exports.sendEmail = sendEmail.sendEmail;
exports.cleanupExpiredReports = cleanupExpiredReports.cleanupExpiredReports;
