'use client';
import CustomInputField from '@/app/components/input';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import CustomAlerts from '../components/customAlerts';
import { SERVER_URL } from '@/constant';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const loginHandler = async () => {
    try {
      if (email && password) {
        setError('');
        const response = await fetch(`${SERVER_URL}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });
        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('token', data.token);
          router.replace('/quizzes');
        } else {
          const errorData = await response.json();
          setError(errorData.message);
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(error?.message);
      console.log('Error fetching data:', error);
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-screen bg-[#141414]">
      {error && <CustomAlerts message={error} />}
      <div className="p-8 rounded-lg bg-black text-center h-fit gap-y-6 text-white flex flex-col bg-[#1a1a1a]">
        <h2 className="text-4xl font-bold">Login</h2>
        <p className="w-[80%] mx-auto text-sm">
          Enter your details to get sign in to your account
        </p>
        <CustomInputField
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
          type="email"
        />
        <CustomInputField
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          type="password"
        />
        <button
          onClick={loginHandler}
          className="py-2 px-4 bg-orange-400 text-white rounded-md mt-2 hover:bg-orange-500 text-sm"
        >
          Sign in
        </button>
        <p className="text-sm">
          Don&apos;t have an account.{' '}
          <span className="text-blue-400 hover:cursor-pointer">Register now.</span>
        </p>
      </div>
    </div>
  );
}
