const express = require('express');
const https = require('https');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
// const nodemailer = require('nodemailer'); // Removed
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { connect, getDb } = require('./database');

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

// Serve Static Files (Frontend Build) - Prioritize this!
app.use(express.static(path.join(__dirname, '../dist')));

// Fast Health Check Route
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

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
let resend;
if (process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
} else {
    console.warn('[WARNING] RESEND_API_KEY is missing. Emails will not be sent.');
}

// Helper to send email using Resend
const sendEmail = async (to, subject, textContent) => {
    try {
        if (!resend) {
            console.error('[EMAIL FAILED] No API Key or Resend client not initialized');
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

// Database Readiness Middleware
let isDbReady = false;
app.use('/api', (req, res, next) => {
    if (!isDbReady) {
        return res.status(503).json({ error: 'Service Unavailable. Database is initializing.' });
    }
    next();
});

// --- AUTH API ---
app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;
    // Simple hardcoded password for now
    if (password === 'yashvardhan@bfp') {
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
    const {
        amount,
        citizenship,
        want80G,
        panCard,
        donationType,
        title,
        fullName,
        dob,
        email,
        mobile,
        address,
        pinCode,
        state,
        city
    } = req.body;

    // For foreign nationals, just send email notification
    if (citizenship === 'foreign') {
        const adminEmailBody = `🌍 Foreign National Donation Inquiry

Donor Details:
--------------
Name: ${title} ${fullName}
Email: ${email}
Mobile: ${mobile}
Amount Interested: ₹${amount}
Date of Birth: ${dob || 'Not provided'}

This person has expressed interest in donating from outside India. 
Please contact them to provide international donation instructions.`;

        sendEmail('bharatfoundation4@gmail.com', '🌍 Foreign Donation Inquiry - Bharat Foundation', adminEmailBody);

        return res.json({ success: true, message: 'Your inquiry has been submitted.' });
    }

    // For Indian citizens
    const sql = 'INSERT INTO donors (name, amount, type, email, verified) VALUES (?, ?, ?, ?, 0)';
    const params = [fullName, amount, donationType, email];

    getDb().run(sql, params, async function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        const donorId = this.lastID;
        const verificationLink = `https://bharat-foundation.onrender.com/verify/${donorId}`;

        // Comprehensive admin email with all donor details
        let adminEmailBody = `🆕 New Donation Submission

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DONATION DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Amount: ₹${amount}
Type: ${donationType === 'monthly' ? 'Monthly Donation' : 'One-time Donation'}
Citizenship: Indian Citizen

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DONOR INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${title} ${fullName}
Email: ${email}
Mobile: ${mobile}
Date of Birth: ${dob || 'Not provided'}`;

        if (want80G) {
            adminEmailBody += `

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
80G CERTIFICATE REQUESTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAN Card: ${panCard}
Address: ${address}
City: ${city}
State: ${state}
PIN Code: ${pinCode}

⚠️ Please issue 80G certificate after payment verification.`;
        }

        adminEmailBody += `

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VERIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Verification Link: ${verificationLink}
Donor ID: ${donorId}

Submitted: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`;

        // Donor thank you email
        const donorEmailBody = `Dear ${title} ${fullName},

Thank you for your generous support to Bharat Foundation!

We have received your donation details:
- Amount: ₹${amount}
- Type: ${donationType === 'monthly' ? 'Monthly Donation' : 'One-time Donation'}
${want80G ? `- 80G Certificate: Requested (PAN: ${panCard})` : ''}

Please complete your payment using the payment details shown on our website:
- UPI ID: bharatfoundation@upi
- Bank: Punjab National Bank
- Account: 3913002100009042
- IFSC: PUNB0391300

After your payment is received and verified, you will receive a confirmation email.
${want80G ? '\nYour 80G certificate will be sent to your address after payment verification.' : ''}

With gratitude,
Bharat Foundation
📧 bharatfoundation4@gmail.com
📞 +91 9911031689`;

        // Send emails
        const donorEmailResult = await sendEmail(email, 'Thank You for Your Donation - Bharat Foundation', donorEmailBody);
        await sendEmail('bharatfoundation4@gmail.com', `💝 New Donation: ₹${amount} from ${fullName}`, adminEmailBody);

        if (donorEmailResult.success) {
            res.json({ success: true, message: 'Donation details submitted successfully!', id: donorId });
        } else {
            const isLimit = donorEmailResult.error?.message?.toLowerCase().includes('limit') || donorEmailResult.error?.statusCode === 429;
            const msg = isLimit
                ? 'Daily email limit reached. Your donation is recorded but confirmation email could not be sent.'
                : 'Donation recorded successfully!';

            res.json({ success: true, message: msg, id: donorId, emailFailed: true });
        }
    });
});

app.post('/api/verify', (req, res) => {
    const { id } = req.body;
    const sql = 'UPDATE donors SET verified = 1 WHERE id = ?';
    getDb().run(sql, id, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ success: true, message: 'Donation verified successfully!' });
    });
});

// --- EMAIL VERIFICATION ROUTE (GET) ---
app.get('/verify/:id', (req, res) => {
    // Check DB readiness for this non-API route too, or handle gracefully
    if (!isDbReady) {
        return res.status(503).send('Service Unavailable. Please try again in a few seconds.');
    }

    const id = req.params.id;
    const sql = 'UPDATE donors SET verified = 1 WHERE id = ?';

    getDb().run(sql, id, function (err) {
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
    getDb().all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ data: rows });
    });
});

app.get('/api/admin/donors', (req, res) => {
    const sql = 'SELECT * FROM donors ORDER BY id DESC';
    getDb().all(sql, [], (err, rows) => {
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
    getDb().get('SELECT * FROM donors WHERE id = ?', [req.params.id], (err, row) => {
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
        getDb().run(sql, [newName, newAmount, newType, newVerified, req.params.id], function (err) {
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
    getDb().run(sql, req.params.id, function (err) {
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
    getDb().all(sql, [], (err, rows) => {
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
    getDb().run(sql, [name, role, image, type, description, color], function (err) {
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
    getDb().run(sql, [name, role, image, type, description, color, req.params.id], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ success: true });
    });
});

app.delete('/api/members/:id', (req, res) => {
    const sql = 'DELETE FROM members WHERE id = ?';
    getDb().run(sql, req.params.id, function (err) {
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
    getDb().all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ data: rows });
    });
});

app.get('/api/projects/:id', (req, res) => {
    const sql = 'SELECT * FROM projects WHERE id = ?';
    getDb().get(sql, [req.params.id], (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: 'Project not found' });
            return;
        }
        res.json({ data: row });
    });
});

app.post('/api/projects', upload.single('image'), (req, res) => {
    const { title, description, long_description } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    const sql = 'INSERT INTO projects (title, description, long_description, image) VALUES (?, ?, ?, ?)';
    getDb().run(sql, [title, description, long_description || '', image], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ success: true, id: this.lastID });
    });
});

app.put('/api/projects/:id', (req, res) => {
    const { title, description, long_description, image } = req.body;
    const sql = 'UPDATE projects SET title = ?, description = ?, long_description = ?, image = ? WHERE id = ?';
    getDb().run(sql, [title, description, long_description || '', image, req.params.id], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ success: true });
    });
});

app.delete('/api/projects/:id', (req, res) => {
    const sql = 'DELETE FROM projects WHERE id = ?';
    getDb().run(sql, req.params.id, function (err) {
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
    getDb().all(sql, [], (err, rows) => {
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
    getDb().run(sql, [title, image, color], function (err) {
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
    getDb().run(sql, [title, image, color, req.params.id], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ success: true });
    });
});

app.delete('/api/moments/:id', (req, res) => {
    const sql = 'DELETE FROM moments WHERE id = ?';
    getDb().run(sql, req.params.id, function (err) {
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
app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Start Server IMMEDIATELY
app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}`);

    // Defer Heavy Initialization
    initializeBackend();
});

// --- BACKGROUND INITIALIZATION ---
async function initializeBackend() {
    console.log('[INIT] Starting background initialization...');

    // 1. Connect to Database
    try {
        await connect();
        isDbReady = true;
        console.log('[INIT] Database connected and ready.');
    } catch (err) {
        console.error('[INIT] Database connection failed:', err);
        // Retry logic could go here
    }

    // 2. Start Self-Ping (Keep-Alive)
    startKeepAlive();
}

function startKeepAlive() {
    // --- SELF-PING MECHANISM (Keep Alive) ---
    app.get('/ping', (req, res) => {
        res.status(200).send('pong');
    });

    // Ping the server every 14 minutes (840,000 ms) to prevent sleep
    const PING_INTERVAL = 14 * 60 * 1000;
    const SERVER_URL = 'https://bharatfoundationprayagraj.com/ping';

    setInterval(() => {
        https.get(SERVER_URL, (res) => {
            console.log(`[KEEP-ALIVE] Ping sent to ${SERVER_URL}. Status: ${res.statusCode}`);
        }).on('error', (e) => {
            console.error(`[KEEP-ALIVE] Ping failed: ${e.message}`);
        });
    }, PING_INTERVAL);

    console.log('[INIT] Keep-Alive mechanism started.');
}

