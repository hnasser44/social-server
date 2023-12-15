const jwt = require("jsonwebtoken");
const Admin = require("../../models/admin.model");

const requireAdminAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);
    if (admin) next();
    else res.status(401).json({ message: "Unauthorized" });
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = requireAdminAuth;
