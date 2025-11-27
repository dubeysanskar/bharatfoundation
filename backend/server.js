const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve Static Files (Frontend Build)
app.use(express.static(path.join(__dirname, '../dist')));

// Multer Setup for Image Uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Nodemailer Transporter
// Nodemailer Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'bharatfoundation4@gmail.com',
        pass: process.env.EMAIL_PASS
    },
    logger: true, // Log to console
    debug: true   // Include SMTP traffic in logs
});

// Verify connection on startup
transporter.verify(function (error, success) {
    if (error) {
        console.log('[SMTP ERROR] Connection failed:', error);
    } else {
        console.log('[SMTP SUCCESS] Server is ready to take our messages');
    }
});

// Helper to send email with timeout
const sendEmail = async (to, subject, text) => {
    try {
        console.log(`[EMAIL ATTEMPT] To: ${to}, Subject: ${subject}`);

        // 60 second timeout (increased)
        const timeout = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Email sending timed out')), 60000)
        );

        const mailOptions = {
            from: '"Bharat Foundation" <bharatfoundation4@gmail.com>',
            to,
            subject,
            text
        };

        // Race between sending mail and timeout
        await Promise.race([
            transporter.sendMail(mailOptions),
            timeout
        ]);

        console.log(`[EMAIL SENT] To: ${to}`);
        return true;
    } catch (error) {
        console.error('[EMAIL FAILED]:', error);
        return false; // Don't crash the server, just return false
    }
};

// --- AUTH API ---
app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;
    // Simple hardcoded password for now
    if (password === 'dhananjay@bharat') {
        res.json({ success: true, token: 'admin-token-secret' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid password' });
    }
});

// --- UPLOAD API ---
app.post('/api/upload', upload.single('image'), (req, res) => {
    if (req.file) {
        res.json({ success: true, imageUrl: `http://localhost:5000/uploads/${req.file.filename}` });
    } else {
        res.status(400).json({ success: false, message: 'No file uploaded' });
    }
});

// --- CONTACT API ---
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;
    const emailBody = `New Contact Message\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`;

    const sent = await sendEmail('bharatfoundation4@gmail.com', `Contact from ${name}`, emailBody);

    if (sent) {
        res.json({ success: true, message: 'Message sent successfully!' });
    } else {
        res.status(500).json({ success: false, message: 'Failed to send email. Please try again later.' });
    }
});

// --- DONATION APIs ---
app.post('/api/donate', (req, res) => {
    const { name, amount, type, email } = req.body;
    const sql = 'INSERT INTO donors (name, amount, type, email, verified) VALUES (?, ?, ?, ?, 0)';
    const params = [name, amount, type, email];

    db.run(sql, params, async function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        const donorId = this.lastID;
        const verificationLink = `https://bharat-foundation.onrender.com/verify/${donorId}`; // Updated to Prod URL

        const donorEmailBody = `Thank you for your donation of ₹${amount}!\n\nPlease click the link below to verify your donation and appear on our Wall of Gratitude:\n${verificationLink}`;
        const adminEmailBody = `New Donation Initiated\n\nDonor Name: ${name}\nAmount: ₹${amount}\nDonor Email: ${email}\nType: ${type}\n\nVerification Link: ${verificationLink}`;

        // Try to send emails, but don't fail the donation if email fails (just log it)
        // Or we can warn the user. For now, let's try our best.
        const sentDonor = await sendEmail(email, 'Verify your Donation - Bharat Foundation', donorEmailBody);
        await sendEmail('bharatfoundation4@gmail.com', 'New Donation Alert', adminEmailBody);

        if (sentDonor) {
            res.json({ success: true, message: 'Donation initiated. Check your email.', id: donorId });
        } else {
            // Return success but with a warning, or handle as error?
            // User needs email to verify. So this is critical.
            res.json({ success: true, message: 'Donation recorded, but email failed. Please contact admin.', id: donorId, emailFailed: true });
        }
    });
});

app.post('/api/verify', (req, res) => {
    const { id } = req.body;
    const sql = 'UPDATE donors SET verified = 1 WHERE id = ?';
    db.run(sql, id, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ success: true, message: 'Donation verified successfully!' });
    });
});

app.get('/api/donors', (req, res) => {
    const sql = 'SELECT * FROM donors WHERE verified = 1 ORDER BY id DESC';
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ data: rows });
    });
});

app.get('/api/admin/donors', (req, res) => {
    const sql = 'SELECT * FROM donors ORDER BY id DESC';
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ data: rows });
    });
});

app.put('/api/admin/donors/:id', (req, res) => {
    const { name, amount, type, verified } = req.body;

    // First fetch the existing record to ensure we don't overwrite with nulls if partial data is sent
    db.get('SELECT * FROM donors WHERE id = ?', [req.params.id], (err, row) => {
        if (err || !row) {
            res.status(404).json({ error: 'Donor not found' });
            return;
        }

        const newName = name !== undefined ? name : row.name;
        const newAmount = amount !== undefined ? amount : row.amount;
        const newType = type !== undefined ? type : row.type;
        // Explicitly check for undefined to allow 0 (false)
        const newVerified = verified !== undefined ? verified : row.verified;

        const sql = 'UPDATE donors SET name = ?, amount = ?, type = ?, verified = ? WHERE id = ?';
        db.run(sql, [newName, newAmount, newType, newVerified, req.params.id], function (err) {
            if (err) {
                res.status(400).json({ error: err.message });
                return;
            }
            res.json({ success: true });
        });
    });
});

app.delete('/api/admin/donors/:id', (req, res) => {
    const sql = 'DELETE FROM donors WHERE id = ?';
    db.run(sql, req.params.id, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ success: true });
    });
});

// --- MEMBERS APIs ---
app.get('/api/members', (req, res) => {
    const sql = 'SELECT * FROM members';
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ data: rows });
    });
});

app.post('/api/members', (req, res) => {
    const { name, role, image, type, description, color } = req.body;
    const sql = 'INSERT INTO members (name, role, image, type, description, color) VALUES (?, ?, ?, ?, ?, ?)';
    db.run(sql, [name, role, image, type, description, color], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ success: true, id: this.lastID });
    });
});

app.put('/api/members/:id', (req, res) => {
    const { name, role, image, type, description, color } = req.body;
    const sql = 'UPDATE members SET name = ?, role = ?, image = ?, type = ?, description = ?, color = ? WHERE id = ?';
    db.run(sql, [name, role, image, type, description, color, req.params.id], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ success: true });
    });
});

app.delete('/api/members/:id', (req, res) => {
    const sql = 'DELETE FROM members WHERE id = ?';
    db.run(sql, req.params.id, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ success: true });
    });
});

// --- PROJECTS APIs ---
app.get('/api/projects', (req, res) => {
    const sql = 'SELECT * FROM projects';
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ data: rows });
    });
});

app.post('/api/projects', (req, res) => {
    const { title, description, image } = req.body;
    const sql = 'INSERT INTO projects (title, description, image) VALUES (?, ?, ?)';
    db.run(sql, [title, description, image], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ success: true, id: this.lastID });
    });
});

app.put('/api/projects/:id', (req, res) => {
    const { title, description, image } = req.body;
    const sql = 'UPDATE projects SET title = ?, description = ?, image = ? WHERE id = ?';
    db.run(sql, [title, description, image, req.params.id], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ success: true });
    });
});

app.delete('/api/projects/:id', (req, res) => {
    const sql = 'DELETE FROM projects WHERE id = ?';
    db.run(sql, req.params.id, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ success: true });
    });
});

// --- MOMENTS APIs ---
app.get('/api/moments', (req, res) => {
    const sql = 'SELECT * FROM moments';
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ data: rows });
    });
});

app.post('/api/moments', (req, res) => {
    const { title, image, color } = req.body;
    const sql = 'INSERT INTO moments (title, image, color) VALUES (?, ?, ?)';
    db.run(sql, [title, image, color], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ success: true, id: this.lastID });
    });
});

app.put('/api/moments/:id', (req, res) => {
    const { title, image, color } = req.body;
    const sql = 'UPDATE moments SET title = ?, image = ?, color = ? WHERE id = ?';
    db.run(sql, [title, image, color, req.params.id], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ success: true });
    });
});

app.delete('/api/moments/:id', (req, res) => {
    const sql = 'DELETE FROM moments WHERE id = ?';
    db.run(sql, req.params.id, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ success: true });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
