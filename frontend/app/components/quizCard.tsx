import { useRouter } from 'next/navigation';
import React, { FC } from 'react';
interface QuizeCardProps {
  quizId: string;
  name?: string;
  description?: string;
  link?: string;
}
const QuizCard: FC<QuizeCardProps> = ({ name, description, quizId }) => {
  const router = useRouter();
  return (
    <div className="w-full lg:max-w-full">
      <div className="rounded-md border border-gray-200  lg:border-gray-300 bg-white  p-4 flex flex-col justify-between leading-normal">
        <div className="mb-4">
          <div className="text-gray-900 font-bold text-xl mb-2">{name}</div>
          <p className="line-clamp-3 text-gray-700 text-base">{description}</p>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => router.push(`/quizzes/${quizId}`)}
            className="py-2 px-4 bg-orange-400 text-white rounded-md mt-2 hover:bg-orange-500 text-sm"
          >
            Go to details
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizCard;
