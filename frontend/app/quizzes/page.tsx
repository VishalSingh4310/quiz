'use client';
import QuizCard from '@/app/components/quizCard';
import { SERVER_URL } from '@/constant';
import React, { useEffect, useState } from 'react';
import { Quiz } from './quizzes.types';
import CustomAlerts from '../components/customAlerts';
import { useRouter } from 'next/navigation';

const Quizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const token = localStorage.getItem('token');
  const [error, setError] = useState('');
  const router = useRouter();
  useEffect(() => {
    const fetchQuizzes = async () => {
      setError('');
      try {
        const res = await fetch(`${SERVER_URL}/api/quiz`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (res.status === 401) {
          router.replace('/auth');
          return;
        }
        const data = await res.json();

        setQuizzes(data);
      } catch (error: any) {
        setError(error.message);
        console.log('Error fetching quizzes:', error);
      }
    };

    fetchQuizzes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="w-full h-full flex items-center justify-center py-10">
      {error && <CustomAlerts message={error} />}
      <div className="max-w-[80%] w-full">
        <h1 className="mb-8 text-5xl font-medium">Quizzes</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
          {(quizzes || []).map((quiz: Quiz) => (
            <QuizCard
              key={quiz._id}
              quizId={quiz._id}
              name={quiz.name}
              description={quiz.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Quizzes;
