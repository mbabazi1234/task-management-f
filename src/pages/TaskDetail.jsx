import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTask } from "../context/TaskContext";
import { formatDate } from "../utils/formatData";

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTaskById, currentTask, loading, deleteTask, toggleTaskStatus } = useTask();
  
  useEffect(() => {
    getTaskById(id);
  }, [id, getTaskById]);
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const success = await deleteTask(id);
      if (success) {
        navigate('/');
      }
    }
  };
  
  const handleToggleStatus = async () => {
    if (currentTask) {
      await toggleTaskStatus(id, !currentTask.completed);
    }
  };
  
  if (loading || !currentTask) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"> </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link to="/" className="text-indigo-600 hover:text-indigo-800">
            &larr; Back to Tasks
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 mt-2">
            {currentTask.title}
          </h1>
        </div>
        
        <div className="flex space-x-2">
          <button
           type='button'
            onClick={handleToggleStatus}
            className={`px-4 py-2 rounded-md ${
              currentTask.completed 
                ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' 
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {currentTask.completed ? 'Mark Incomplete' : 'Mark Complete'}
          </button>
          <Link
            to={`/tasks/${id}/edit`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Edit
          </Link>
          <button
            type='button'
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
          >
            Delete
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500">
        <div className="mb-4">
          <div className="flex items-center">
            <span className={`px-3 py-1 rounded-full text-sm ${
              currentTask.completed
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {currentTask.completed ? 'Completed' : 'Active'}
            </span>
            <span className="ml-4 text-gray-500">
              Created: {formatDate(currentTask.createdAt)}
            </span>
            {currentTask.updatedAt !== currentTask.createdAt && (
              <span className="ml-4 text-gray-500">
                Updated: {formatDate(currentTask.updatedAt)}
              </span>
            )}
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Description</h3>
          <p className="text-gray-600 whitespace-pre-line">{currentTask.description}</p>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;