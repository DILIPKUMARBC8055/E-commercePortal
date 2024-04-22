import UserModel from "../features/users/user.model.js";

const basicAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).send("no authorization data found");
  }

  const base64Encoded = authHeader.replace("Basic", "");

  const decodeCreds = Buffer.from(base64Encoded, "base64").toString("utf8");

  const credentials = decodeCreds.split(":");
  const user = UserModel.signIn(credentials[0], credentials[1]);
  if (user) {
    next();
  } else {
    return res.status(401).send("Invalid credentials");
  }
};
export default basicAuth;
