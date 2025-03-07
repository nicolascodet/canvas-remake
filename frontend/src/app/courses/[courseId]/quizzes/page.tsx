'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Quiz, QuizSubmission } from '@/lib/api';
import apiService from '@/lib/api';
import { AcademicCapIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function QuizzesPage() {
  const params = useParams();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [submission, setSubmission] = useState<QuizSubmission | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    fetchQuizzes();
  }, [params.courseId]);

  useEffect(() => {
    if (selectedQuiz?.time_limit_minutes && !submission) {
      setTimeLeft(selectedQuiz.time_limit_minutes * 60);
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === null || prev <= 0) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [selectedQuiz]);

  const fetchQuizzes = async () => {
    try {
      const data = await apiService.getCourseQuizzes(params.courseId as string);
      setQuizzes(data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  const handleStartQuiz = async (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setAnswers(new Array(quiz.questions.length).fill(-1));
    setSubmission(null);
  };

  const handleSubmitQuiz = async () => {
    if (!selectedQuiz) return;

    try {
      const result = await apiService.submitQuiz(selectedQuiz.id, answers);
      setSubmission(result);
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Quizzes</h2>
      </div>

      {!selectedQuiz ? (
        <div className="bg-white rounded-lg border">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="p-4 border-b last:border-b-0">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-100 flex items-center justify-center rounded">
                  <AcademicCapIcon className="h-6 w-6 text-purple-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-purple-600">{quiz.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{quiz.description}</p>
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                    <span>Due: {new Date(quiz.due_date).toLocaleDateString()}</span>
                    <span>Points: {quiz.total_points}</span>
                    {quiz.time_limit_minutes && (
                      <span>Time Limit: {quiz.time_limit_minutes} minutes</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleStartQuiz(quiz)}
                  className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
                >
                  Start Quiz
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-semibold">{selectedQuiz.title}</h3>
              <p className="text-sm text-gray-600">{selectedQuiz.description}</p>
            </div>
            {!submission && timeLeft !== null && (
              <div className="text-lg font-semibold text-purple-600">
                Time Left: {formatTime(timeLeft)}
              </div>
            )}
            <button
              onClick={() => {
                setSelectedQuiz(null);
                setSubmission(null);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {submission ? (
            <div className="space-y-4">
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <h4 className="text-2xl font-bold text-purple-600 mb-2">
                  Quiz Complete!
                </h4>
                <p className="text-lg">
                  Your Score: {submission.score} out of {selectedQuiz.total_points} points
                </p>
                <p className="text-sm text-gray-600">
                  Submitted at: {new Date(submission.submitted_at).toLocaleString()}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {selectedQuiz.questions.map((question, index) => (
                <div key={question.id} className="border-b pb-6 last:border-b-0">
                  <h4 className="font-medium mb-2">
                    Question {index + 1}: {question.question}
                  </h4>
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <label
                        key={optionIndex}
                        className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name={`question-${index}`}
                          checked={answers[index] === optionIndex}
                          onChange={() => {
                            const newAnswers = [...answers];
                            newAnswers[index] = optionIndex;
                            setAnswers(newAnswers);
                          }}
                          className="text-purple-600"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <button
                onClick={handleSubmitQuiz}
                disabled={answers.includes(-1)}
                className={`w-full px-4 py-2 rounded-md ${
                  answers.includes(-1)
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-purple-500 hover:bg-purple-600 text-white'
                }`}
              >
                Submit Quiz
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 