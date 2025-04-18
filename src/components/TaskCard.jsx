import React, { useState } from "react";
import { useTask } from "../context/TaskContext";
import { formatDate } from "../utils/formatData";
import { Link } from "react-router-dom";

const TaskCard = ({ task }) => {
  const { toggleTaskStatus, deleteTask } = useTask();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggleStatus = async () => {
    await toggleTaskStatus(task._id, !task.completed);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setIsDeleting(true);
      await deleteTask(task._id);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${task.completed ? 'border-green-500' : 'border-yellow-500'}`}>
      <div className="flex justify-between">
        <h3 className={`text-xl font-semibold ${task.completed ? 'line-through text-gray-500' : ''}`}>
          {task.title}
        </h3>
        <div className="flex space-x-2">
          <button
           type='button'
            onClick={handleToggleStatus}
            className={`px-3 py-1 rounded-md text-sm ${task.completed ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}
          >
            {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
          </button>
        </div>
      </div>
      
      <p className={`mt-2 text-gray-600 ${task.completed ? 'line-through text-gray-400' : ''}`}>
        {task.description.length > 100 
          ? `${task.description.substring(0, 100)}...` 
          : task.description}
      </p>
      
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-500">
          Created: {formatDate(task.createdAt)}
        </span>
        
        <div className="flex space-x-2">
          <Link 
            to={`/tasks/${task._id}`}
            className="text-indigo-600 hover:text-indigo-800 text-sm"
          >
            View Details
          </Link>
          <Link 
            to={`/tasks/${task._id}/edit`}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Edit
          </Link>
          <button
           type='button'
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
