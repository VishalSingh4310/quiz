'use client';
import { SERVER_URL } from '@/constant';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Quiz } from '../quizzes.types';
import CustomAlerts from '@/app/components/customAlerts';

function QuizDetails() {
  const params = useParams();
  const router = useRouter();
  const quizName = params.quiz ? decodeURIComponent(params?.quiz as string) : '';
  const [quiz, setQuiz] = useState<Quiz>();
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
  useEffect(() => {
    const fetchQuizzes = async () => {
      setError('');
      try {
        const res = await fetch(`${SERVER_URL}/api/quiz/${quizName}`, {
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
        console.error('Error fetching quizzes:', error);
      }
    };

    fetchQuizzes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="w-full h-full flex items-center justify-center py-10">
      {error && <CustomAlerts message={error} />}
      <div className="max-w-[80%] w-full">
        <h1 className="mb-8 text-5xl font-medium">{quiz?.name || ''}</h1>
        {quiz?.description && (
          <div className="mb-4">
            <h3 className="mb-4 text-xl font-medium">Description</h3>
            <p className="text-ellipsis text-gray-700 sm:w-4/5 ">{quiz?.description}</p>
          </div>
        )}
        {quiz?.instructions?.length && (
          <div className="mb-4">
            <h3 className="mb-4 text-xl font-medium">Instructions</h3>
            {quiz?.instructions.map((ins, index) => (
              <p
                key={index}
                className="text-ellipsis text-gray-700 sm:w-4/5 flex items-center"
              >
                <span className="w-[6px] h-[6px] bg-black rounded-full mr-2 block" />
                {ins}
              </p>
            ))}
          </div>
        )}
        <div className="mb-4 flex items-center">
          <h3 className="text-xl font-medium">Number of Questions:</h3>
          <p className="pl-2">{quiz?.questions}</p>
        </div>
        <div className="mb-4 flex items-center">
          <h3 className="text-xl font-medium">Total Marks:</h3>
          <p className="pl-2">{quiz?.totalPoints}</p>
        </div>
        <button
          onClick={() => router.push(`/quiz?id=${quiz?._id}`)}
          className="py-3 px-6 text-xl bg-orange-400 text-white rounded-md mt-2 hover:bg-orange-500 text-sm"
        >
          Take Quiz
        </button>
      </div>
    </div>
  );
}

export default QuizDetails;
