class EmailSender {

    sendEmail(email, subject, message){
        console.log(`Email sent to ${email} with subject "${subject}" and message: ${message}`);
    }

}

module.exports = EmailSender;