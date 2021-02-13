const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
// const config = require("config");

function auth(req, res, next) {
  console.log(req);
  const token = req.headers["x-auth-token"];

  //check for token
  if (!token)
    return res.status(401).json({ msg: "No token, authentication denied" });

  try {
    //verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //add user from payload
    // req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ msg: "Token is not valid" });
    console.log(err);
  }
}

module.exports = auth;
