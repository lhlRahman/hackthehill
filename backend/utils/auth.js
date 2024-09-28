// ./utils/auth.js
import path from "path";
import jsonwebtoken from "jsonwebtoken";
import fs from "fs";
import { fileURLToPath } from 'url';
import isEmpty from "./isEmpty.js";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Keys
const pathToPubKey = path.join(__dirname, "..", "id_rsa_pub.pem");
const PUB_KEY = fs.readFileSync(pathToPubKey, "utf8");

/**
 * This is an authentication middleware function
 */
function authMiddleware(req, res, next) {
  if (isEmpty(req.headers.authorization)) {
    return res.status(401).json({ msg: "Access denied" });
  }
  const tokenParts = req.headers.authorization.split(" ");
  if (
    tokenParts.length === 2 &&
    tokenParts[0] === "Bearer" &&
    tokenParts[1].match(/\S+\.\S+\.\S+/) !== null
  ) {
    try {
      const verification = jsonwebtoken.verify(tokenParts[1], PUB_KEY, {
        algorithms: ["RS256"],
      });
      req.jwt = verification;
      req._id = req.jwt.sub;
      next();
    } catch (err) {
      return res.status(401).json({ msg: "Access denied" });
    }
  } else {
    return res.status(401).json({ msg: "Access denied" });
  }
}

export default authMiddleware;