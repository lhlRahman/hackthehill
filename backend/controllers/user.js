// ./controllers/user.js
import isEmpty from "../utils/isEmpty.js";
import { issueJWT } from "../utils/password.js";
import User from "../models/user.js";

const registerUser = async (req, res) => {
  let { username, password } = req.body;

  if (isEmpty(username)) {
    return res.status(400).json({ msg: "Username is required" });
  }
  if (isEmpty(password)) {
    return res.status(400).json({ msg: "Password is required" });
  }

  username = username.toLowerCase();
  User.findOne({ username: username }).then((user) => {
    if (!isEmpty(user)) {
      return res.status(400).json({ msg: "Account already exists" });
    }

    const newUser = new User({
      username: username,
      password: password,
      points: 0,
      friends: [],
    });

    newUser
      .save()
      .then((user) => {
        return res.status(200).json({ msg: "User created successfully", user });
      })
      .catch((err) => {
        return res.status(400).json({ error: err });
      });
  });
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (isEmpty(username)) {
    return res.status(400).json({ msg: "Username is required" });
  }
  if (isEmpty(password)) {
    return res.status(400).json({ msg: "Password is required" });
  }

  User.findOne({ username: username.toString().toLowerCase() })
    .then((user) => {
      if (isEmpty(user)) {
        return res.status(401).json({ msg: "Authentication failed" });
      }

      const isValid = user.password === password;

      if (isValid) {
        const tokenObject = issueJWT(user);

        return res.status(200).json({
          token: tokenObject.token,
          expiresIn: tokenObject.expires,
          user: {
            username: user.username,
            _id: user._id,
          },
        });
      } else {
        return res.status(400).json({ msg: "Wrong username/password" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ error: err });
    });
};

const getFriends = async (req, res) => {
  User.findOne({ _id: req.id})
    .then((user) => {
      if (isEmpty(user)) {
        return res.status(401).json({ msg: "Authentication failed" });
      }
      return res.status(200).json({ balance: user.friends });
    })
    .catch((err) => {
      return res.status(400).json({ error: err });
    });
};

const addFriend = async (req, res) => {

  User.findOne({ _id: req.id})
  .then((user) => {
    if (isEmpty(user)) {
      return res.status(401).json({ msg: "Authentication failed" });
    }

    if(user.friends.includes(friendId)) {
      return res.status(400).json({ msg: "User is already a friend"});
    }
    
    user.friends.push(friendId)
    user.save()

    return res.status(200).json({ msg: "Friend added successfully" });
  })
  .catch((err) => {
    return res.status(400).json({ error: err });
  });
}

const getBalance = async (req, res) => {
  User.findOne({ _id: req._id })
    .then((user) => {
      if (isEmpty(user)) {
        return res.status(401).json({ msg: "Authentication failed" });
      }
      return res.status(200).json({ balance: user.points });
    })
    .catch((err) => {
      return res.status(400).json({ error: err });
    });
};

export { registerUser, loginUser, getFriends, addFriend, getBalance };
