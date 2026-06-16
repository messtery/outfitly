export default function requirePermission(permission) {
  return (req, res, next) => {
    const { isRoot, permissions } = req.user ?? {}
    if (isRoot || (Array.isArray(permissions) && permissions.includes(permission))) {
      return next()
    }
    return res.status(403).json({ message: 'Forbidden' })
  }
}
