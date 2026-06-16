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

    const token = jwt.sign({ id: customer.id }, process.env.JWT_SECRET, { expiresIn: '24h' });

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

export const updateMe = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name?.trim() && !email?.trim()) {
      return res.status(400).json({ message: 'At least one field is required' });
    }

    const customer = await Customer.findByPk(req.user.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    const updates = {};
    if (name?.trim()) updates.name = name.trim();
    if (email?.trim()) updates.email = email.trim();

    await customer.update(updates);

    return res.status(200).json({
      message: 'Profile updated',
      customer: { id: customer.id, name: customer.name, email: customer.email },
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Email already in use' });
    }
    return res.status(500).json({ message: 'Failed to update profile' });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are required' });
    }

    const customer = await Customer.findByPk(req.user.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    const isValid = await bcrypt.compare(currentPassword, customer.password);
    if (!isValid) return res.status(400).json({ message: 'Current password is incorrect' });

    await customer.update({ password: await bcrypt.hash(newPassword, 10) });

    return res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to change password' });
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