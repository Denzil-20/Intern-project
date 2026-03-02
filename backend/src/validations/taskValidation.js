const { z } = require("zod");

const taskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().optional()
});

module.exports = { taskSchema };