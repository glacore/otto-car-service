import { ConfigService } from '@nestjs/config';
import pg from 'pg';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

async function addAdmin() {
  const configService = new ConfigService();
  const pool = new pg.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432', 10),
  });

  const username = 'otto@gm-construct.nl';
  const password = 'Portocala08.';

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const query = 'INSERT INTO admin_users (username, password_hash) VALUES ($1, $2)';
  const values = [username, hashedPassword];

  try {
    await pool.query(query, values);
    console.log('Admin user added successfully');
  } catch (error) {
    console.error('Error adding admin user:', error);
  } finally {
    await pool.end();
  }
}

addAdmin();
