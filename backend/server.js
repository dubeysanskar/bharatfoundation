const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
// const nodemailer = require('nodemailer'); // Removed
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Disable caching for all API routes to ensure fresh data
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
});

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
const { Resend } = require('resend');

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

if (!process.env.RESEND_API_KEY) {
    console.warn('[WARNING] RESEND_API_KEY is missing. Emails will not be sent.');
}

// Helper to send email using Resend
// Helper to send email using Resend
const sendEmail = async (to, subject, textContent) => {
    try {
        if (!process.env.RESEND_API_KEY) {
            console.error('[EMAIL FAILED] No API Key');
            return { success: false, error: { message: 'No API Key' } };
        }

        console.log(`[EMAIL ATTEMPT] To: ${to}, Subject: ${subject}`);

        // Convert plain text newlines to HTML breaks for "exactly the same" formatting
        const htmlContent = `<p>${textContent.replace(/\n/g, '<br>')}</p>`;

        const { data, error } = await resend.emails.send({
            from: 'Bharat Foundation <support@bharatfoundationprayagraj.com>',
            to: [to],
            subject: subject,
            html: htmlContent
        });

        if (error) {
            console.error('[EMAIL FAILED] Resend Error:', error);
            return { success: false, error };
        }

        console.log(`[EMAIL SENT] ID: ${data.id} To: ${to}`);
        return { success: true };
    } catch (error) {
        console.error('[EMAIL FAILED] Unexpected Error:', error);
        return { success: false, error };
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

    const { success, error } = await sendEmail('bharatfoundation4@gmail.com', `Contact from ${name}`, emailBody);

    if (success) {
        res.json({ success: true, message: 'Message sent successfully!' });
    } else {
        const isLimit = error?.message?.toLowerCase().includes('limit') || error?.statusCode === 429;
        if (isLimit) {
            res.status(429).json({ success: false, message: 'Message failed: Daily email limit exhausted. Please try again tomorrow.' });
        } else {
            res.status(500).json({ success: false, message: 'Failed to send email. Please try again later.' });
        }
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

        const donorEmailBody = `Thank you for your donation of ₹${amount}!\n\nYour support helps us make a real difference. We have received your donation request and it is currently under verification.`;
        const adminEmailBody = `New Donation Initiated\n\nDonor Name: ${name}\nAmount: ₹${amount}\nDonor Email: ${email}\nType: ${type}\n\nVerification Link: ${verificationLink}`;

        // Try to send emails, but don't fail the donation if email fails (just log it)
        const donorEmailResult = await sendEmail(email, 'Thank You for Your Donation - Bharat Foundation', donorEmailBody);
        await sendEmail('bharatfoundation4@gmail.com', 'New Donation Alert (Verification Required)', adminEmailBody);

        if (donorEmailResult.success) {
            res.json({ success: true, message: 'Donation initiated. Check your email.', id: donorId });
        } else {
            const isLimit = donorEmailResult.error?.message?.toLowerCase().includes('limit') || donorEmailResult.error?.statusCode === 429;
            const msg = isLimit
                ? 'Donations down: Daily email limit exhausted. Please try again tomorrow.'
                : 'Donation recorded, but email failed. Please contact admin.';

            res.json({ success: true, message: msg, id: donorId, emailFailed: true });
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

// --- EMAIL VERIFICATION ROUTE (GET) ---
app.get('/verify/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'UPDATE donors SET verified = 1 WHERE id = ?';

    db.run(sql, id, function (err) {
        if (err) {
            console.error('Verification Error:', err);
            return res.status(500).send(`
                <html>
                    <head><title>Verification Failed</title></head>
                    <body style="font-family: sans-serif; text-align: center; padding: 50px;">
                        <h1 style="color: red;">Verification Failed</h1>
                        <p>Something went wrong. Please try again later or contact support.</p>
                    </body>
                </html>
            `);
        }

        if (this.changes === 0) {
            return res.status(404).send(`
                <html>
                    <head><title>Invalid Link</title></head>
                    <body style="font-family: sans-serif; text-align: center; padding: 50px;">
                        <h1 style="color: orange;">Invalid Link</h1>
                        <p>This donation record could not be found.</p>
                    </body>
                </html>
            `);
        }

        res.send(`
            <html>
                <head>
                    <title>Donation Verified</title>
                    <style>
                        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align: center; padding: 50px; background-color: #f9f9f9; }
                        .container { background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); max-width: 500px; margin: 0 auto; }
                        h1 { color: #2e7d32; margin-bottom: 20px; }
                        p { color: #555; font-size: 18px; line-height: 1.6; }
                        .btn { display: inline-block; margin-top: 20px; padding: 12px 25px; background-color: #d32f2f; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; }
                        .btn:hover { background-color: #b71c1c; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>✅ Donation Verified!</h1>
                        <p>Thank you for your generosity. Your donation has been successfully verified and will now appear on our Wall of Gratitude.</p>
                        <a href="/" class="btn">Return to Website</a>
                    </div>
                </body>
            </html>
        `);
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

// --- SPA CATCH-ALL ROUTE ---
// This must be the last route. It serves index.html for any unknown routes,
// allowing React Router to handle the routing on the client side.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
