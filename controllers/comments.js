const { TurmasInfo, Comment } = require("../models/turmasInfo");

exports.commentForum = async (req, res) => {
   const { id } = req.params;
   const { text, userId } = req.body;

   try {
      TurmasInfo.findById(id, (err, turma) => {
         if(err) throw Error(err);

         Comment.create({ userId, text: text, replies: [] }).then((comment) =>{
            turma.comments.push(comment);

            turma.save();
         });
      });

      res.status(200).json({ result: "Commented successfully" });
   } catch (error) {
      res.status(404).json({ message: error.message });
   }
}

exports.replyComment = async (req, res) => {
   const { text, userId, commentId } = req.body;

   try {
      Comment.findById(commentId, (err, comment) => {
         if(err) throw Error(err);
         
         Comment.create({ userId, text: text }).then((commentCreated) =>{
            comment.replies.push(commentCreated);

            comment.save()
         });
      });

      res.status(200).json({ result: "Replied successfully" });
   } catch (error) {
      res.status(404).json({ message: error.message });
   }
}

exports.getCommentsByTurma = async (req, res) => {
   const { id } = req.params;

   try {
      TurmasInfo.findById(id, (err, turma) => {
         if(err) throw Error(err);
         // Comment.find().then((comments) => res.status(200).json(comments))
         Comment.find({"_id": { $in: turma.comments}}).then((comments) => res.status(200).json(comments))
      })
   } catch (error) {
      res.status(404).json({ message: error.message });
   }
}

exports.getRepliesByComment = async (req, res) => {
   const { id } = req.params;
   try {
      Comment.findById(id, (err, comment) => {
         if(err) throw Error(err);

         Comment.find({"_id": { $in: comment.replies}}).then((replies) => res.status(200).json(replies))
      })
   } catch (error) {
      res.status(404).json({ message: error.message });
   }
}

exports.removeComment = async (req, res) => {
   const { id } = req.params;

   const { commentId, isReply = false, parentCommentId } = req.body;

   try {
      isReply ?
         Comment.findByIdAndUpdate(parentCommentId, { $pull: { "replies": commentId }},{ safe: true})
            .then(() => {
               Comment.findByIdAndDelete(commentId).then(() => {
                  res.status(200).json({ message: "Reply deleted successfully" });
               });
            }).catch((err) => {throw Error(err)})
      :
         TurmasInfo.findByIdAndUpdate(id, { $pull: { "comments": commentId } },{ safe: true})
            .then(() => {
               Comment.findByIdAndDelete(commentId, (err, oldComment) => {
                  if(err) throw Error(err);

               Comment.deleteMany({'_id': { $in: oldComment.replies }}).then(() => {
                  res.status(200).json({ message: "Comment deleted successfully" });
            })})}).catch((err) => {throw Error(err)})
   } catch (error) {
      res.status(400).json(error);
   }
} 

exports.editComment = async (req, res) => {
   const { commentId, text } = req.body;

   try {
      Comment.findByIdAndUpdate(commentId, { text: text }, { new: true }, (err, comment) => {
         if(err) throw Error(err);

         res.status(200).json(comment);
      })
   } catch (error) {
      res.status(500).json(error);
   }
}