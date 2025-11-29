const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'foundation.db');

let db = null;

const connect = () => {
  return new Promise((resolve, reject) => {
    if (db) {
      console.log('Database already connected.');
      return resolve(db);
    }

    console.log('Initializing database connection...');
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database ' + dbPath + ': ' + err.message);
        return reject(err);
      }
      console.log('Connected to the SQLite database.');
      initializeTables();
      resolve(db);
    });
  });
};

const getDb = () => {
  if (!db) {
    throw new Error('Database not initialized. Call connect() first.');
  }
  return db;
};

const initializeTables = () => {
  // Donors Table
  db.run(`CREATE TABLE IF NOT EXISTS donors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      amount TEXT NOT NULL,
      type TEXT,
      email TEXT,
      verified INTEGER DEFAULT 0,
      date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

  // Members Table
  db.run(`CREATE TABLE IF NOT EXISTS members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      image TEXT,
      type TEXT NOT NULL, -- 'founder' or 'member'
      description TEXT,
      color TEXT
    )`, () => {
    // Seed Members if empty
    db.get("SELECT count(*) as count FROM members", (err, row) => {
      if (row && row.count === 0) {
        console.log("Seeding Members...");
        const members = [
          { name: "Rekha Pandey", role: "Adyaksh", image: "/uploads/founder4.jpeg", type: "founder", color: "#d00000" },
          { name: "Dhananjay Pandey", role: "Secretary", image: "/uploads/founder2.jpeg", type: "founder", color: "#0f2b44" },
          { name: "Chandra Mohan Saxena", role: "Founder Member", image: "/uploads/founder1.jpeg", type: "founder", color: "#fca311" },
          { name: "Rajesh Singh", role: "Founder Member", image: "/uploads/founder3.jpeg", type: "founder", color: "#fca311" },
          { name: "Ankit Mishra", role: "Member", image: "/uploads/member1.jpeg", type: "member" },
          { name: "Nitu Verma", role: "Member", image: "/uploads/member2.jpeg", type: "member" },
          { name: "Sunil Mishra", role: "Member", image: "/uploads/member6.jpeg", type: "member" },
          { name: "Member Name", role: "Member", image: "/uploads/member3.jpeg", type: "member" },
          { name: "Member Name", role: "Member", image: "/uploads/member4.jpeg", type: "member" },
          { name: "Member Name", role: "Member", image: "/uploads/member5.jpeg", type: "member" }
        ];
        const stmt = db.prepare("INSERT INTO members (name, role, image, type, color) VALUES (?, ?, ?, ?, ?)");
        members.forEach(m => stmt.run(m.name, m.role, m.image, m.type, m.color));
        stmt.finalize();
      }
    });
  });

  // Projects Table
  db.run(`CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      image TEXT
    )`, () => {
    // Seed Projects if empty
    db.get("SELECT count(*) as count FROM projects", (err, row) => {
      if (row && row.count === 0) {
        console.log("Seeding Projects...");
        const projects = [
          { title: "Gaushala Seva", description: "Providing shelter and care for cows.", image: "/uploads/gaushala.jpg" },
          { title: "Shiv Mandir Construction", description: "Building a spiritual center for the community.", image: "/uploads/shivmandir.avif" }
        ];
        const stmt = db.prepare("INSERT INTO projects (title, description, image) VALUES (?, ?, ?)");
        projects.forEach(p => stmt.run(p.title, p.description, p.image));
        stmt.finalize();
      }
    });
  });

  // Moments Table
  db.run(`CREATE TABLE IF NOT EXISTS moments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      image TEXT,
      color TEXT
    )`, () => {
    // Seed Moments if empty
    db.get("SELECT count(*) as count FROM moments", (err, row) => {
      if (row && row.count === 0) {
        console.log("Seeding Moments...");
        const moments = [
          { title: "Mandir Construction", color: "#fca311" },
          { title: "Gaushala Service", color: "#fb8500" },
          { title: "Community Events", color: "#0f2b44" },
          { title: "Volunteer Work", color: "#d00000" }
        ];
        const stmt = db.prepare("INSERT INTO moments (title, color) VALUES (?, ?)");
        moments.forEach(m => stmt.run(m.title, m.color));
        stmt.finalize();
      }
    });
  });
};

module.exports = { connect, getDb };
