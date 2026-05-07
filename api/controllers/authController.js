import Customer from "../models/customer.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'

dotenv.config()

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const customer = await Customer.findOne({ where: { email } });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, customer.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ id: customer.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({
      message: 'Login successful',
      token,
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingCustomer = await Customer.findOne({ where: { email } });
    if (existingCustomer) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const customer = await Customer.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: 'Registration successful',
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};