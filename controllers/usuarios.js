const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require("../models/user");

exports.signin = async (req, res) => {
   const { user, password } = req.body;

   try {
      const existingUser = await User.findOne({ user });

      if (!existingUser) return res.status(404).json({ message: "User doesn't exist." });

      const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

      if(!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials." })

      const token = jwt.sign({ user: existingUser.user, id: existingUser._id}, 'test', { expiresIn: "1h" });
      
      res.status(200).json({ result: existingUser, token });
   } catch (error) {
      res.status(500).json({ message: "Something went wrong." })
   }
}

exports.signup = async (req, res) => {
   const { user, email, password, nome } = req.body;

   try {
      const existingUser = await User.findOne({ user });
      
      if (existingUser) return res.status(400).json({ message: "User already exist." });

      const hashedPassword = await bcrypt.hash(password, 12);

      const result = await User.create({ user, email, nome, password: hashedPassword });

      const token = jwt.sign({ user: result.user, id: result._id}, 'test', { expiresIn: "1h" });

      res.status(200).json({ result, token });
   } catch (error) {
      res.status(500).json({ message: "Something went wrong." })
   }
}