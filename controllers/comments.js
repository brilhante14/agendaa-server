const db = require("../database/db");

exports.commentForum = async (req, res) => {
  const { text, userId, turmaId } = req.body;

  try {
    const newComment = await db.exec("INSERT INTO Comments (userId, turmaId, text) VALUES (?)", [[userId, turmaId, text]]);

    res.status(200).json({
      result: "Commented successfully",
      comment_id: newComment.id,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.replyComment = async (req, res) => {
  const { text, userId, commentId } = req.body;

  try {
    const newReply = await db.exec("INSERT INTO Replies (userId, commentId, text) VALUES (?)", [[userId, commentId, text]]);

    res.status(200).json({
      result: "Replied successfully",
      reply_id: newReply.id,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.getCommentsByTurma = async (req, res) => {
  const { id } = req.params;

  try {
    const comments = await db.exec({
      sql: "SELECT * FROM Comments LEFT JOIN Replies ON Comments.id = Replies.commentId WHERE turmaId = ?",
      nestTables: '_'
    }, id);

    // const replies = await db.exec("SELECT * FROM Replies WHERE commentId = ?", id);

    res.status(200).json(comments)
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.removeComment = async (req, res) => {
  const { id } = req.params;

  try {
    await db.exec("DELETE FROM Comments WHERE id = ?", id);
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.removeReply = async (req, res) => {
  const { id } = req.params;

  try {
    await db.exec("DELETE FROM Replies WHERE id = ?", id);
    res.status(200).json({ message: "Reply deleted successfully" });
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.editComment = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  try {
    await db.exec("UPDATE Comments SET text = ? WHERE id = ?", [text, id]);

    res.status(200).json({ data: "Edited successfully" });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.editReply = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  try {
    await db.exec("UPDATE Replies SET text = ? WHERE id = ?", [text, id]);
    res.status(200).json({ data: "Edited successfully" });

  } catch (error) {
    res.status(500).json(error);
  }
};