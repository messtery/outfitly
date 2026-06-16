import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Role = sequelize.define('roles', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  name: {
    allowNull: false,
    unique: true,
    type: DataTypes.STRING,
  },
  description: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  permissions: {
    allowNull: true,
    type: DataTypes.TEXT,
    defaultValue: null,
    get() {
      const raw = this.getDataValue('permissions');
      if (!raw) return [];
      try { return JSON.parse(raw); } catch { return []; }
    },
    set(value) {
      this.setDataValue('permissions', Array.isArray(value) ? JSON.stringify(value) : null);
    },
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE,
  },
}, { timestamps: true });

export default Role;
