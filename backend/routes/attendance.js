import express from 'express';
import { db } from '../config/database.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, (req, res) => {
  const {
    worker_id,
    date,
    shift_start = '09:00',
    shift_end = '18:00',
    actual_start,
    actual_end,
    overtime_hours = 0,
    status = 'present',
    notes
  } = req.body;

  if (!worker_id || !date) {
    return res.status(400).json({ error: 'Worker ID and date are required' });
  }

  db.get(
    'SELECT * FROM attendance WHERE worker_id = ? AND date = ?',
    [worker_id, date],
    (err, existing) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (existing) {
        const sql = `UPDATE attendance SET 
          shift_start = ?, shift_end = ?, actual_start = ?, actual_end = ?,
          overtime_hours = ?, status = ?, notes = ?
          WHERE worker_id = ? AND date = ?`;

        db.run(sql, [
          shift_start, shift_end, actual_start, actual_end,
          overtime_hours, status, notes, worker_id, date
        ], function(err) {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.json({ message: 'Attendance updated successfully' });
        });
      } else {
        const sql = `INSERT INTO attendance (
          worker_id, date, shift_start, shift_end, actual_start, actual_end,
          overtime_hours, status, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        db.run(sql, [
          worker_id, date, shift_start, shift_end, actual_start, actual_end,
          overtime_hours, status, notes
        ], function(err) {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.json({ 
            id: this.lastID, 
            message: 'Attendance marked successfully' 
          });
        });
      }
    }
  );
});

router.get('/', auth, (req, res) => {
  const { worker_id, date, start_date, end_date, month } = req.query;
  
  let sql = `
    SELECT a.*, w.full_name, w.photo, w.designation
    FROM attendance a 
    LEFT JOIN workers w ON a.worker_id = w.id 
    WHERE 1=1
  `;
  const params = [];

  if (worker_id) {
    sql += ' AND a.worker_id = ?';
    params.push(worker_id);
  }

  if (date) {
    sql += ' AND a.date = ?';
    params.push(date);
  }

  if (start_date && end_date) {
    sql += ' AND a.date BETWEEN ? AND ?';
    params.push(start_date, end_date);
  }

  if (month) {
    sql += ' AND strftime("%Y-%m", a.date) = ?';
    params.push(month);
  }

  sql += ' ORDER BY a.date DESC, w.full_name';

  db.all(sql, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

export default router;
