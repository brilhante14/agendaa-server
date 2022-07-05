const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const sendEmail = require('../utils/sendEmail');
const { User } = require("../models/user");

exports.signin = async (req, res) => {
   const { user, password } = req.body;

   try {
      const existingUser = await User.findOne({ user });

      if (!existingUser) return res.status(404).json({ message: "User doesn't exist." });

      const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

      if(!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials." })

      const token = jwt.sign({ user: existingUser.user, id: existingUser._id}, 'test', { expiresIn: "1h" });
      
      existingUser.password = undefined;

      res.status(200).json({ result: existingUser, token });
   } catch (error) {
      res.status(500).json({ message: "Something went wrong." })
   }
}

exports.signup = async (req, res) => {
   const { user, email, password, nome, role = "aluno" } = req.body;

   try {
      const existingUser = await User.findOne({ user });
      
      if (existingUser) return res.status(400).json({ message: "User already exist." });

      const photo = `https://i.pravatar.cc/150?img=${Math.round(Math.random() * 50)}`

      const hashedPassword = await bcrypt.hash(password, 12);

      const result = await User.create({ user, email, nome, password: hashedPassword, role, photo });
      
      const token = jwt.sign({ user: result.user, id: result._id}, 'test', { expiresIn: "1h" });
      
      result.password = undefined;
      res.status(200).json({ result, token });
   } catch (error) {
      res.status(500).json({ message: "Something went wrong." })
   }
}

exports.requestPasswordReset = async (req, res) => {
   const { email } = req.body;

   const existingUser = await User.findOne({ email });
   if (!existingUser) return res.status(400).json({ message: "User does not exist." });
 
   // let token = await Token.findOne({ userId: existingUser._id });
   // if (token) await token.deleteOne();
   // let resetToken = crypto.randomBytes(32).toString("hex");
   const resetToken = jwt.sign({ user: existingUser.user, id: existingUser._id}, 'reset', { expiresIn: "1h" });

   await User.findByIdAndUpdate(existingUser._id, { resetToken: resetToken});

   const link = `localhost:3000/passwordReset?token=${resetToken}&id=${existingUser._id}`;
   sendEmail(existingUser.email, "Password Reset Request", {name: existingUser.name, link: link,},"./template/requestResetPassword.handlebars");

   res.status(200).json({ link, resetToken });
};

exports.resetPassword = async(req, res) => {
   const { userId, resetToken, newPassword }= req.body;
   
   if (!resetToken) 
      throw new Error("Invalid or expired password reset token");
   
   try {
      const user = await User.findById(userId);

      if (!(user.resetToken === resetToken)) 
         throw new Error("Invalid or expired password reset token");
      
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      // console.log(user);

      const newUser = await User.findByIdAndUpdate( userId,
         { password: hashedPassword, resetToken: "" } ,
         { new: true }
      );

      sendEmail(
         newUser.email,
         "Password Reset Successfully",
         {
            name: newUser.name,
         },
         "./template/resetPassword.handlebars"
      );

      res.status(200).json(newUser);
   } catch (error) {
      res.status(500).json(error);
   }
}

exports.getParticipantes = async (req, res) => {
   const { idProfessor, listParticipantes } = req.body;

   try {
      const professor = await User.findById(idProfessor);

      const participantes = await User.find({ '_id': { $in: listParticipantes } });

      return res.status(200).json({professor: professor, participantes: participantes});
   } catch (error) {
      res.status(500).json({ message: "Something went wrong." })
   }
}

exports.getAllUsers = async (req, res) => {
   try {
      const users = await User.find();
      
      res.status(200).json(users);
   } catch (error) {
      res.status(404).json({ message: error.message });
   }

}

exports.getById = async (req, res) => {
   const { id } = req.params;

   try {
      const users = await User.findById(id);
      
      res.status(200).json(users);
   } catch (error) {
      res.status(404).json({ message: error.message });
   }

}

exports.editUser = async (req, res) => {
   const { id } = req.params;
   const { nome, role, email } = req.body;

   try {
      User.findByIdAndUpdate(id, {
         nome: nome,
         email: email,
         role: role
      }, {new: true }, (err, user) => {
         if(err) throw Error(err);

         res.status(200).json(user);
      })
   } catch (error) {
      res.status(500).json(error);
   }
}