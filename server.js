require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post('/api/schedule-reminder', (req, res) => {
  const { task, targetTime, emailTo } = req.body;

  const currentTime = Date.now();
  const delay = targetTime - currentTime;

  if (delay <= 0) {
    return res.status(400).json({ message: 'Error: Δεν μπορείς να βάλεις υπενθύμιση στο παρελθόν!' });
  }

  console.log(`Reminder set! Email will be sent to ${emailTo} in ${Math.round(delay / 1000)} seconds.`);

  setTimeout(() => {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: emailTo,
      subject: 'Reminder: New Task',
      text: `Υπενθύμιση για την εργασία σου: ${task}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
      } else {
        console.log('Email sent successfully:', info.response);
      }
    });
  }, delay);

  res.json({ message: 'Reminder scheduled successfully!' });
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
