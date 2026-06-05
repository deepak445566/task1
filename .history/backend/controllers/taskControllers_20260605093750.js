import Task from "../models/Task.js";

// GET TASKS
export const getTasks = async (req, res) => {
  try {
    const { status, search } = req.query;

    let query = { userId: req.user.id };

    if (status === "pending" || status === "completed") {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};