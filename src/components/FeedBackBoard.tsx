// src/pages/FeedbackBoard.tsx
import React from 'react';

interface Feedback {
  id: number;
  title: string;
  description: string;
  category: string;
}

const feedbacks: Feedback[] = [
  {
    id: 1,
    title: 'Improve the dark mode design',
    description: 'The dark mode has some contrast issues on smaller screens.',
    category: 'Feature Request',
  },
  {
    id: 2,
    title: 'Add multi-language support',
    description: 'Allow users to switch languages dynamically.',
    category: 'Enhancement',
  },
];

export function FeedbackBoard() {
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Feedback Board</h1>
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded">
            + Add Feedback
          </button>
        </div>

        <div className="space-y-6">
          {feedbacks.map((feedback) => (
            <div
              key={feedback.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                {feedback.title}
              </h2>
              <p className="text-gray-600 mb-4">{feedback.description}</p>
              <div className="flex items-center justify-between">
                <span className="inline-block bg-gray-200 text-gray-700 text-sm font-medium px-3 py-1 rounded-full">
                  {feedback.category}
                </span>
                <button className="text-purple-600 hover:underline font-semibold">
                  View Feedback
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FeedbackBoard;
