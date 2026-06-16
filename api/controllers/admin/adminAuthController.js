import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../../models/user.js';
import Role from '../../models/role.js';
import dotenv from 'dotenv';

dotenv.config();

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({
      where: { email },
      include: [{ model: Role, as: 'role', attributes: ['id', 'name', 'permissions'] }],
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      roleId: user.roleId,
      roleName: user.role?.name ?? null,
      permissions: user.isRoot ? ['*'] : (user.role?.permissions ?? []),
      isRoot: user.isRoot ?? false,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: payload,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Login failed' });
  }
};

export const me = (req, res) => {
  res.status(200).json({ data: req.user });
};

export const updateMe = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name?.trim() && !email?.trim()) {
      return res.status(400).json({ message: 'At least one field (name or email) is required' });
    }

    const user = await User.findByPk(req.user.id, {
      include: [{ model: Role, as: 'role', attributes: ['id', 'name', 'permissions'] }],
    });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const updates = {};
    if (name?.trim()) updates.name = name.trim();
    if (email?.trim()) updates.email = email.trim();

    await user.update(updates);

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      roleId: user.roleId,
      roleName: user.role?.name ?? null,
      permissions: user.isRoot ? ['*'] : (user.role?.permissions ?? []),
      isRoot: user.isRoot ?? false,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

    return res.status(200).json({ message: 'Profile updated', token, user: payload });
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
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) return res.status(400).json({ message: 'Current password is incorrect' });

    await user.update({ password: await bcrypt.hash(newPassword, 10) });

    return res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to change password' });
  }
};
