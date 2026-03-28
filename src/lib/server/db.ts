import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'hospital.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    dob TEXT,
    phone TEXT,
    address TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS doctors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    specialty TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    bio TEXT,
    avatar TEXT
  );

  CREATE TABLE IF NOT EXISTS availability (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    doctor_id INTEGER NOT NULL,
    day_of_week TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id)
  );

  CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    doctor_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    reason TEXT,
    status TEXT DEFAULT 'scheduled',
    notes TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(id)
  );
`);

const doctorCount = db.prepare('SELECT COUNT(*) as count FROM doctors').get() as { count: number };
if (doctorCount.count === 0) {
  const insertDoctor = db.prepare(`
    INSERT INTO doctors (name, specialty, email, phone, bio, avatar)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const insertAvailability = db.prepare(`
    INSERT INTO availability (doctor_id, day_of_week, start_time, end_time)
    VALUES (?, ?, ?, ?)
  `);

  const doctors = [
    {
      name: 'Dr. Sarah Johnson',
      specialty: 'General Practice',
      email: 'sarah.johnson@hospital.com',
      phone: '555-0101',
      bio: 'Experienced general practitioner with 15 years of practice.',
      avatar: 'SJ',
      availability: [
        { day: 'Monday', start: '09:00', end: '17:00' },
        { day: 'Tuesday', start: '09:00', end: '17:00' },
        { day: 'Wednesday', start: '09:00', end: '13:00' },
        { day: 'Thursday', start: '09:00', end: '17:00' },
        { day: 'Friday', start: '09:00', end: '16:00' },
      ]
    },
    {
      name: 'Dr. Michael Chen',
      specialty: 'Cardiology',
      email: 'michael.chen@hospital.com',
      phone: '555-0102',
      bio: 'Board-certified cardiologist specializing in preventive care.',
      avatar: 'MC',
      availability: [
        { day: 'Monday', start: '10:00', end: '18:00' },
        { day: 'Wednesday', start: '10:00', end: '18:00' },
        { day: 'Friday', start: '10:00', end: '15:00' },
      ]
    },
    {
      name: 'Dr. Emily Patel',
      specialty: 'Pediatrics',
      email: 'emily.patel@hospital.com',
      phone: '555-0103',
      bio: 'Compassionate pediatrician with a focus on child wellness.',
      avatar: 'EP',
      availability: [
        { day: 'Monday', start: '08:00', end: '16:00' },
        { day: 'Tuesday', start: '08:00', end: '16:00' },
        { day: 'Thursday', start: '08:00', end: '16:00' },
        { day: 'Friday', start: '08:00', end: '12:00' },
      ]
    },
    {
      name: 'Dr. James Williams',
      specialty: 'Orthopedics',
      email: 'james.williams@hospital.com',
      phone: '555-0104',
      bio: 'Specialist in joint replacement and sports injuries.',
      avatar: 'JW',
      availability: [
        { day: 'Tuesday', start: '09:00', end: '17:00' },
        { day: 'Wednesday', start: '14:00', end: '19:00' },
        { day: 'Thursday', start: '09:00', end: '17:00' },
      ]
    },
    {
      name: 'Dr. Lisa Rodriguez',
      specialty: 'Dermatology',
      email: 'lisa.rodriguez@hospital.com',
      phone: '555-0105',
      bio: 'Expert in skin conditions and cosmetic dermatology.',
      avatar: 'LR',
      availability: [
        { day: 'Monday', start: '09:00', end: '17:00' },
        { day: 'Wednesday', start: '09:00', end: '17:00' },
        { day: 'Friday', start: '09:00', end: '17:00' },
      ]
    },
  ];

  for (const doctor of doctors) {
    const result = insertDoctor.run(doctor.name, doctor.specialty, doctor.email, doctor.phone, doctor.bio, doctor.avatar);
    const doctorId = result.lastInsertRowid;
    for (const avail of doctor.availability) {
      insertAvailability.run(doctorId, avail.day, avail.start, avail.end);
    }
  }

  const hashedPassword = bcrypt.hashSync('demo123', 10);
  db.prepare(`
    INSERT OR IGNORE INTO patients (name, email, password, dob, phone, address)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run('Demo Patient', 'demo@example.com', hashedPassword, '1990-01-15', '555-9999', '123 Main St, Springfield');
}

export { db };
