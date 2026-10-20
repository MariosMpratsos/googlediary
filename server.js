require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;
const MAX_DELAY = 2147483647; // όριο του setTimeout (~24.8 μέρες)

// Πίσω από τον nginx: ώστε το rate limit να βλέπει την πραγματική IP
app.set('trust proxy', 1);

app.use(cors());
app.use(express.json({ limit: '10kb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 λεπτά
  limit: 20,                // 20 αιτήματα ανά IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Error: Πάρα πολλά αιτήματα, δοκίμασε αργότερα.' }
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post('/api/schedule-reminder', limiter, (req, res) => {
  const { task, targetTime, emailTo } = req.body || {};

  if (typeof task !== 'string' || !task.trim() || task.length > 500) {
    return res.status(400).json({ message: 'Error: Μη έγκυρη εργασία.' });
  }

  if (
    typeof emailTo !== 'string' ||
    emailTo.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTo)
  ) {
    return res.status(400).json({ message: 'Error: Μη έγκυρο email.' });
  }

  const target = Number(targetTime);
  if (!Number.isFinite(target)) {
    return res.status(400).json({ message: 'Error: Μη έγκυρη ώρα.' });
  }

  const delay = target - Date.now();

  if (delay <= 0) {
    return res.status(400).json({ message: 'Error: Δεν μπορείς να βάλεις υπενθύμιση στο παρελθόν!' });
  }

  if (delay > MAX_DELAY) {
    return res.status(400).json({ message: 'Error: Η υπενθύμιση δεν μπορεί να είναι πάνω από 24 μέρες μπροστά.' });
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
