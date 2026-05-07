import Todo from '../models/Todo.js';

export const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const createTodo = async (req, res) => {
  try {
    const { title, priority, dueDate, topic } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });
    const todo = await Todo.create({ userId: req.userId, title, priority, dueDate, topic });
    res.status(201).json(todo);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const updateTodo = async (req, res) => {
  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    res.json(todo);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
