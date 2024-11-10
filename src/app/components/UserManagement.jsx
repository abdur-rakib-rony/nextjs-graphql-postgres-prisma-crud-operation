"use client";

import React, { useState, useTransition } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { createUser, updateUser, deleteUser } from '@/app/actions/userActions';

function UserManagement({ users = [] }) {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState(null);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError(null);
    
    startTransition(async () => {
      try {
        const result = await createUser(name, email);
        if (result.error) {
          setError(result.error);
        } else {
          setName("");
          setEmail("");
        }
      } catch (err) {
        setError(err.message);
      }
    });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        const result = await updateUser(editingUser.id, name, email);
        if (result.error) {
          setError(result.error);
        } else {
          setEditingUser(null);
          setName("");
          setEmail("");
        }
      } catch (err) {
        setError(err.message);
      }
    });
  };

  const handleDeleteUser = async (id) => {
    setError(null);

    startTransition(async () => {
      try {
        const result = await deleteUser(id);
        if (result.error) {
          setError(result.error);
        }
      } catch (err) {
        setError(err.message);
      }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md w-full max-w-4xl mx-auto mt-8">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold">User Management</h2>
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
            {error}
          </div>
        )}

        <form
          onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
          className="space-y-4 mb-8"
        >
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            disabled={isPending}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            disabled={isPending}
            required
          />
          <button
            type="submit"
            className={`w-full py-2 px-4 rounded-md text-white font-medium 
              ${isPending ? "bg-blue-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
            disabled={isPending}
          >
            {isPending ? (
              <svg className="animate-spin h-5 w-5 mx-auto" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : editingUser ? (
              "Update User"
            ) : (
              "Create User"
            )}
          </button>

          {editingUser && (
            <button
              type="button"
              onClick={() => {
                setEditingUser(null);
                setName("");
                setEmail("");
              }}
              className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 disabled:bg-gray-100"
              disabled={isPending}
            >
              Cancel Edit
            </button>
          )}
        </form>

        {isPending && (
          <div className="fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-md shadow-lg">
            Saving changes...
          </div>
        )}

        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-md"
            >
              <div>
                <h3 className="font-medium">{user.name}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setEditingUser(user);
                    setName(user.name);
                    setEmail(user.email);
                  }}
                  disabled={isPending}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md disabled:opacity-50"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  disabled={isPending}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserManagement;