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
      Comment.findByIdAndUpdate(commentId, {$push: { replies: { userId, text } }}, (err, obj) => {
         if(err) throw Error(err);
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
            Comment.find({"_id": { $in: turma.comments}}).then((comments) => res.status(200).json(comments))
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
         Comment.findByIdAndUpdate(parentCommentId, { $pull: { "replies": { '_id': commentId } }},{ safe: true}, 
         (err, comment) => {
            if(err) throw Error(err);

            console.log(comment);
            res.status(200).json({ message: "Reply deleted successfully" });
         })
      :
         TurmasInfo.findByIdAndUpdate(id, { $pull: { "comments": commentId } },{ safe: true})
            .then(() => {
               Comment.findByIdAndDelete(commentId, (err, oldComment) => {
                  if(err) throw Error(err);

                  res.status(200).json({ message: "Comment deleted successfully" });
            })})
   } catch (error) {
      res.status(400).json(error);
   }
} 

exports.editComment = async (req, res) => {
   const { commentId, text, isReply = false, parentCommentId } = req.body;

   try {
      isReply ?
         Comment.updateOne({_id: parentCommentId, replies: { $elemMatch: { _id: commentId }}}, 
            { $set: { 'replies.$.text': text} }, (err, comment) => {
               if(err) throw Error(err);
               
               res.status(200).json({ data: "Edited successfully" });
         })
      :
         Comment.findByIdAndUpdate(commentId, { text: text }, { new: true }, (err, comment) => {
            if(err) throw Error(err);

            res.status(200).json(comment);
         })
   } catch (error) {
      res.status(500).json(error);
   }
}