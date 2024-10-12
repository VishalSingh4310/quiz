'use client';
import { SERVER_URL } from '@/constant';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Quiz } from '../quizzes/quizzes.types';
import CustomAlerts from '../components/customAlerts';

function QuizOnGoing() {
  const searchParams = useSearchParams();
  const quizId = searchParams.get('id');
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz>();
  const [finalQuiz, setFinalQuiz] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [isFinshed, setFinished] = useState(false);
  const [score, setScore] = useState(0);
  const token = localStorage.getItem('token');
  useEffect(() => {
    const fetchQuizzes = async () => {
      setError('');
      try {
        const res = await fetch(`${SERVER_URL}/api/quiz/take-quiz/${quizId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (res.status === 401) {
          router.replace('/auth');
          return;
        }
        const data = await res.json();
        setQuiz(data);
      } catch (error: any) {
        setError(error.message);
        console.error('Error fetching quiz:', error);
      }
    };

    fetchQuizzes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const answerHandler = (questionId: string, answer: string) => {
    const answerExists = finalQuiz.find((quiz) => quiz.questionId === questionId);
    if (answerExists) {
      const updateFinalQuiz = finalQuiz.map((quiz) => {
        if (quiz.questionId === questionId) {
          return { ...quiz, answer };
        }
        return quiz;
      });
      setFinalQuiz(updateFinalQuiz);
    } else {
      setFinalQuiz((prev) => [...prev, { questionId, answer }]);
    }
  };
  const submitHandler = async () => {
    try {
      setFinished(true);
      setError('');
      const response = await fetch(`${SERVER_URL}/api/quiz/results/${quizId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ questionWithAnswer: finalQuiz })
      });
      if (response.status === 401) {
        router.replace('/auth');
        return;
      }
      if (response.ok) {
        const data = await response.json();
        setScore(data?.score || 0);
      } else {
        const errorData = await response.json();
        setError(errorData.message);
      }
    } catch (error: any) {
      setError(error?.message);
      console.log('Error fetching data:', error);
    }
  };
  return (
    <div className="w-full h-full flex justify-center h-screen py-10">
      {error && <CustomAlerts message={error} />}
      {!isFinshed ? (
        <div className="max-w-[80%] w-full">
          <h1 className="mb-8 text-5xl font-medium">{quiz?.name}</h1>
          <div>
            {(quiz?.questions || []).map((data: any, index: number) => (
              <div className="mb-6">
                <div className="flex mb-2 items-start justify-between w-full">
                  <div className="flex items-center">
                    <span className="font-medium">{index + 1}. </span>
                    <h5 className="ml-1 text-lg font-medium">{data.question}</h5>
                  </div>
                  <span className="bg-green-200 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                    Points:{data.points}
                  </span>
                </div>
                <div>
                  {data.options.map((option: any) => (
                    <div key={option._id} className="flex mb-2 items-center">
                      <input
                        onChange={(e) => answerHandler(data._id, e.target.value)}
                        id={option?._id}
                        type="radio"
                        value={option?.answer}
                        checked={
                          finalQuiz.find(
                            (quiz) =>
                              quiz.answer === option.answer &&
                              quiz.questionId === data._id
                          )
                            ? true
                            : false
                        }
                        className="h-4 w-4 border-gray-300 focus:ring-2 focus:ring-blue-300"
                      />
                      <label
                        htmlFor={option?._id}
                        className="text-sm text-gray-500 ms-3 dark:text-neutral-400"
                      >
                        {option?.answer || ''}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={submitHandler}
            className="py-3 mb-4 px-6 text-xl bg-orange-400 text-white rounded-md mt-2 hover:bg-orange-500 text-sm"
          >
            Submit
          </button>
        </div>
      ) : (
        <div className="max-w-[80%] w-full flex flex-col items-center">
          <div className="mb-4 flex flex-col mx-auto items-center justify-center w-[300px] h-[300px] border-[15px] border-teal-400 rounded-full bg-teal-200">
            <h1 className="mb-8 text-4xl font-medium">Your Score</h1>
            <h1 className="text-4xl font-medium">
              {score}/{quiz?.totalPoints}
            </h1>
          </div>
          <h3 className="mb-2 text-3xl font-medium text-center">
            {score === 0 ? 'Better luck next time!' : 'Congratulation'}
          </h3>
          {score !== 0 && (
            <p className="text-gray-700 text-center">Great job, You did it.</p>
          )}
          <button
            onClick={() => router.replace('/quizzes')}
            className="mx-auto py-3 px-6 text-xl bg-orange-400 text-white rounded-md mt-4 hover:bg-orange-500 text-sm"
          >
            Back to Home
          </button>
        </div>
      )}
    </div>
  );
}

export default QuizOnGoing;
