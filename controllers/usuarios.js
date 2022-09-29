const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const sendEmail = require('../utils/sendEmail');

const db = require("../database/db");

exports.signin = async (req, res) => {
   const { userName, password } = req.body;

   try {
      const userQuery = await db.exec("SELECT * FROM Users WHERE username = ?", userName);
      if (!userQuery.length) return res.status(404).json({ message: "User doesn't exist." });
      const existingUser = userQuery[0];

      const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

      if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials." })

      const token = jwt.sign({ user: existingUser.username, id: existingUser.userId }, 'test', { expiresIn: "1h" });

      existingUser.password = undefined;

      res.status(200).json({ result: existingUser, token });
   } catch (error) {
      res.status(500).json({ message: error.message })
   }
}

exports.signup = async (req, res) => {
   const { userName, email, password, nome, role = "aluno" } = req.body;

   try {
      const existingUser = await db.exec("SELECT * FROM Users WHERE username = ?", userName);

      if (existingUser.length) return res.status(400).json({ message: "Usuário já cadastrado." });

      const existingEmail = await db.exec("SELECT * FROM Users WHERE email = ?", email);

      if (existingEmail.length) return res.status(400).json({ message: "Email já cadastrado." });

      const photo = `https://i.pravatar.cc/150?img=${Math.round(Math.random() * 50)}`

      const hashedPassword = await bcrypt.hash(password, 12);

      const newUser = await db.exec("INSERT INTO Users (name, username, role, email, password, photo) VALUES (?)",
         [[nome, userName, role, email, hashedPassword, photo]]);

      const token = jwt.sign({ user: newUser.userName, id: newUser.userId }, 'test', { expiresIn: "1h" });

      newUser.password = undefined;
      res.status(200).json({ newUser, token });
   } catch (error) {
      res.status(500).json(error.message)
   }
}

exports.requestPasswordReset = async (req, res) => {
   const { email } = req.body;

   const userQuery = await db.exec("SELECT * FROM Users WHERE email = ?", email);
   if (!userQuery.length) return res.status(400).json({ message: "Email não cadastrado no sistema." });

   const existingUser = userQuery[0];

   const resetToken = jwt.sign({ user: existingUser.username, id: existingUser.userId }, 'reset', { expiresIn: "1h" });

   await db.exec("UPDATE Users SET resetToken = ? WHERE userId = ?", [resetToken, existingUser.userId]);

   // const link = `/passwordReset?token=${resetToken}&id=${existingUser.userId}`;
   // sendEmail(existingUser.email, "Password Reset Request", {name: existingUser.name, link: link,},"./template/requestResetPassword.handlebars");
   res.status(200).json({ userId: existingUser.userId, resetToken });
};

exports.resetPassword = async (req, res) => {
   const { userId, resetToken, newPassword } = req.body;

   if (!resetToken)
      throw new Error("Invalid or expired password reset token");

   try {
      const userQuery = await db.exec("SELECT * FROM Users WHERE userId = ?", userId);
      const user = userQuery[0];

      if (!(user.resetToken === resetToken))
         throw new Error("Invalid or expired password reset token");

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const newUser = await db.exec("UPDATE Users SET password = ?, resetToken = NULL WHERE userId = ?",
         [hashedPassword, userId]);

      // sendEmail(
      //    newUser.email,
      //    "Password Reset Successfully",
      //    {
      //       name: newUser.name,
      //    },
      //    "./template/resetPassword.handlebars"
      // );

      res.status(200).json(newUser);
   } catch (error) {
      res.status(500).json(error);
   }
}

exports.getParticipantes = async (req, res) => {
   const { idTurma } = req.body;

   try {
      // const professor = await User.findById(idProfessor);

      // const participantes = await User.find({ '_id': { $in: listParticipantes } });
      const professor = await db.exec("SELECT Users.userId, Users.name, Users.username, Users.photo, Users.role, Users.email " +
         "FROM Users INNER JOIN Turmas ON Users.userId = Turmas.professorId WHERE Turmas.id = ?", idTurma)
      const participantes = await db.exec(
         "SELECT Users.userId, Users.name, Users.username, Users.photo, Users.role, Users.email " +
         "FROM Users INNER JOIN TurmasParticipantes ON Users.userId = TurmasParticipantes.participanteId WHERE TurmasParticipantes.turmaId = ?",
         idTurma);

      return res.status(200).json({ professor: professor, participantes: participantes });
   } catch (error) {
      res.status(500).json({ message: "Something went wrong." })
   }
}

exports.getAllUsers = async (req, res) => {
   try {
      // const users = await User.find();
      const users = await db.exec("SELECT * FROM Users")

      res.status(200).json(users);
   } catch (error) {
      res.status(404).json({ message: error.message });
   }
}

exports.getById = async (req, res) => {
   const { id } = req.params;

   try {
      // const users = await User.findById(id);
      const user = await db.exec("SELECT * FROM Users WHERE userId = ?", id);

      res.status(200).json(user);
   } catch (error) {
      res.status(404).json({ message: error.message });
   }
}

exports.editUser = async (req, res) => {
   const { id } = req.params;
   const { nome, role, email, user } = req.body;

   try {
      // User.findByIdAndUpdate(id, {
      //    nome: nome,
      //    email: email,
      //    user: user,
      //    role: role
      // }, {new: true }, (err, user) => {
      //    if(err) throw Error(err);
      // })
      let sql = "UPDATE Users SET";
      let values = [];
      if (nome) {
         sql += " name = ?,";
         values.push(nome);
      }
      if (role) {
         sql += " role = ?,";
         values.push(role);
      }
      if (email) {
         sql += " email = ?,";
         values.push(email);
      }
      if (user) {
         sql += " username = ?,";
         values.push(user);
      }

      sql = sql.slice(0, -1) + " WHERE userId = ?"
      values.push(id);

      const userEdited = await db.exec(sql, values);

      res.status(200).json(userEdited);
   } catch (error) {
      res.status(500).json(error);
   }
}

exports.deleteUser = async (req, res) => {
   const { id } = req.params;

   try {
      // User.findByIdAndDelete(id, (err, user) => {
      //    if(err) throw Error(err);
      // })

      await db.exec("DELETE FROM Users WHERE userId = ?", id);
      res.status(200).json({ message: "User deleted" });
   } catch (error) {
      res.status(500).json(error);
   }
}