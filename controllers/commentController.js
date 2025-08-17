const commentModel = require("../models/Comment");

const allComments = async (req, res) => {
  try {
    // Find all comments and populate the related article data
    const comments = await commentModel.find().populate("article");

    if (!comments || comments.length === 0) {
      return res.status(404).send("No comments found");
    }

    res.render("admin/comments", { role: req.role, comments });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

const updateStatus = async (req, res) => {
  try {
    const commentId = req.params.id;
    const newStatus = req.body.status;

    if (!["pending", "approved", "rejected"].includes(newStatus)) {
      return res.status(400).send("Invalid status value");
    }

    if (newStatus === "rejected") {
      // Delete the comment instead of updating status
      const deletedComment = await commentModel.findByIdAndDelete(commentId);

      if (!deletedComment) {
        return res.status(404).send("Comment not found");
      }

      return res.send("Comment rejected and deleted successfully");
    } else {
      // For other statuses, update as normal
      const updatedComment = await commentModel.findByIdAndUpdate(
        commentId,
        { status: newStatus },
        { new: true }
      );

      if (!updatedComment) {
        return res.status(404).send("Comment not found");
      }

      return res.send("Status updated successfully");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

module.exports = {
  allComments,
  updateStatus,
};
