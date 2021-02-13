const mysql = require("mysql");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("login", {
        message: "Please provide an email and password",
      });
    }

    db.query(
      "SELECT * FROM owners WHERE Email = ?",
      [email],
      async (error, result) => {
        console.log(result);
        if (!result || !(await bcrypt.compare(password, result[0].Password))) {
          res.status(204).send("login", {
            message: "Email or Password is incorrect",
          });
        } else {
          const id = result[0].id;

          const config = {
            headers: {
              "Content-Type": "application/json",
            },
          };

          const token = jwt.sign(
            { id },
            process.env.JWT_SECRET,
            {
              expiresIn: process.env.JWT_EXPIRES_IN,
            }
          );

          console.log("The token is: " + token);
          result.token = token;

          const cookieOptions = {
            expires: new Date(
              Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
          };

          config.headers["x-auth-token"] = token;

          res.cookie("jwt", token, cookieOptions);
          res.status(200).send(token);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

exports.register = (req, res) => {
  console.log(req.body);

  const { name, email, password, passwordConfirm } = req.body;
  console.log(req.body);
  db.query(
    "SELECT email FROM owners WHERE Email = ?",
    [email],
    async (error, result) => {
      if (error) {
        console.log(error);
      }
      if (result.length > 0) {
        return res.status(200).send({
          message: "That email is already in use",
        });
      } else if (password !== passwordConfirm) {
        return res.status(200).send({
          message: "Passwords do not match",
        });
      } else if (
        (name.length < 1,
        email.length < 1,
        password.length < 1,
        passwordConfirm.length < 1)
      ) {
        return res.status(200).send({
          message: "Please insert data",
        });
      }

      let hashedPassword = await bcrypt.hash(password, 8);
      console.log(hashedPassword);

      db.query(
        "INSERT INTO owners SET ?",
        { Name: name, Email: email, Password: hashedPassword },
        (error, result) => {
          if (error) {
            console.log(error);
          } else {
            console.log(result);
            return res.status(200).send({
              message: "User registered",
            });
          }
        }
      );
    }
  );
};
