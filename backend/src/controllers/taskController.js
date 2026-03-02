const prisma = require("../config/prisma");
const { taskSchema } = require("../validations/taskValidation");

// Create Task
exports.createTask = async (req, res) => {
  try {
    const validated = taskSchema.parse(req.body);

    const task = await prisma.task.create({
      data: {
        title: validated.title,
        content: validated.content,
        userId: req.user.userId
      }
    });

    res.status(201).json(task);
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        errors: error.issues.map(e => ({
          field: e.path[0],
          message: e.message
        }))
      });
    }

    res.status(400).json({ message: error.message });
  }
};

// Get My Tasks
exports.getMyTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.user.userId }
    });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get Single Task
exports.getTaskById = async (req, res) => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: req.params.id }
    });

    if (!task || task.userId !== req.user.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update Task
exports.updateTask = async (req, res) => {
  try {
    const validated = taskSchema.partial().parse(req.body);

    const task = await prisma.task.findUnique({
      where: { id: req.params.id }
    });

    if (!task || task.userId !== req.user.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const updatedTask = await prisma.task.update({
      where: { id: req.params.id },
      data: validated
    });

    res.status(200).json(updatedTask);
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        errors: error.issues.map(e => ({
          field: e.path[0],
          message: e.message
        }))
      });
    }

    res.status(400).json({ message: error.message });
  }
};

// Delete Task
exports.deleteTask = async (req, res) => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: req.params.id }
    });

    if (!task || task.userId !== req.user.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await prisma.task.delete({
      where: { id: req.params.id }
    });

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};