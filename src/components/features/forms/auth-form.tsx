'use client';

import React, { useActionState, useState } from 'react';
import {
  signInAction,
  SignInState,
  signUpAction,
  SignUpState,
} from '@/src/lib/actions/auth';

export function AuthForm() {
  const [isSignIn, setIsSignIn] = useState(true);
  return (
    <div className="flex flex-col rounded-2xl bg-white py-10 px-10 md:px-16 md:min-w-lg shadow-md">
      <div className="flex rounded-md">
        <h1 className="text-2xl font-semibold mb-6 rounded-md">{isSignIn ? `Sign In` : `Sign Up`}</h1>
      </div>
      {isSignIn ? <SignInForm /> : <SignUpForm />}
      <div
        onClick={() => {
          setIsSignIn(!isSignIn);
        }}
        className="mt-4 text-center text-sm text-gray-600 cursor-pointer"
      >
        {isSignIn ? (
          <div>
            {`Don't have an account? `}
            <p className="text-blue-500 inline">Sign Up</p>
          </div>
        ) : (
          <div>
            {`Already have an account? `}
            <p className="text-blue-500 inline">Sign In</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function SignInForm() {
  const initialState: SignInState = { message: null, errors: {} };
  const [state, formAction] = useActionState(signInAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-1 w-full">
      <div className="w-full">
        <label
          className="block text-sm font-medium text-gray-700 mb-1 px-1"
          htmlFor="email"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          aria-describedby="email-error"
          className="peer block w-full rounded-lg hover:bg-gray-200 bg-gray-100 active:border-gray-200 py-2 px-3 text-sm placeholder:text-gray-500 transition-all duration-75"
        />
        <div
          id="email-error"
          aria-live="polite"
          aria-atomic="true"
          className="min-h-3"
        >
          {state.errors?.email && (
            <p className="mt-1 text-sm text-red-600">{state.errors.email}</p>
          )}
        </div>
      </div>
      <div className="w-full">
        <label
          className="block text-sm font-medium text-gray-700 mb-1 px-1"
          htmlFor="password"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter Password"
          aria-describedby="password-error"
          className="peer block w-full rounded-lg hover:bg-gray-200 bg-gray-100 active:border-gray-200 py-2 px-3 text-sm placeholder:text-gray-500 transition-all duration-75"
        />
        <div
          id="password-error"
          aria-live="polite"
          aria-atomic="true"
          className="min-h-3"
        >
          {state.errors?.password && (
            <p className="mt-1 text-sm text-red-600">{state.errors.password}</p>
          )}
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="rememberMe"
          name="rememberMe"
          className="mr-2"
        />
        <label htmlFor="rememberMe" className="text-sm text-gray-700">
          Remember Me
        </label>
      </div>

      <button
        type="submit"
        className="mt-4 w-full rounded-lg bg-[#D49273] py-2 px-4 text-white hover:bg-[#9A654B] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Sign In
      </button>
    </form>
  );
}

export function SignUpForm() {
  const initialState: SignUpState = { message: null, errors: {} };
  const [state, formAction] = useActionState(signUpAction, initialState);

  return (
    <form action={formAction} className="flex flex-col w-full">
      <div className="w-full">
        <label
          className="block text-sm font-medium text-gray-700 mb-1 px-1"
          htmlFor="name"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Enter your name"
          aria-describedby="name-error"
          className="peer block w-full rounded-lg hover:bg-gray-200 bg-gray-100 active:border-gray-200 py-2 px-3 text-sm placeholder:text-gray-500 transition-all duration-75"
        />
        <div
          id="name-error"
          aria-live="polite"
          aria-atomic="true"
          className="min-h-3"
        >
          {state.errors?.name && (
            <p className="mt-1 text-sm text-red-600">{state.errors.name}</p>
          )}
        </div>
      </div>
      <div className="w-full">
        <label
          className="block text-sm font-medium text-gray-700 mb-1 px-1"
          htmlFor="email"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          aria-describedby="email-error"
          className="peer block w-full rounded-lg hover:bg-gray-200 bg-gray-100 active:border-gray-200 py-2 px-3 text-sm placeholder:text-gray-500 transition-all duration-75"
        />
        <div
          id="email-error"
          aria-live="polite"
          aria-atomic="true"
          className="min-h-3"
        >
          {state.errors?.email && (
            <p className="mt-1 text-sm text-red-600">{state.errors.email}</p>
          )}
        </div>
      </div>
      <div className="w-full">
        <label
          className="block text-sm font-medium text-gray-700 mb-1 px-1"
          htmlFor="password"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter Password"
          aria-describedby="password-error"
          className="peer block w-full rounded-lg hover:bg-gray-200 bg-gray-100 active:border-gray-200 py-2 px-3 text-sm placeholder:text-gray-500 transition-all duration-75"
        />
        <div
          id="password-error"
          aria-live="polite"
          aria-atomic="true"
          className="min-h-3"
        >
          {state.errors?.password && (
            <p className="mt-1 text-sm text-red-600">{state.errors.password}</p>
          )}
        </div>
      </div>
      <div className="w-full">
        <label
          className="block text-sm font-medium text-gray-700 mb-1 px-1"
          htmlFor="confirm-password"
        >
          Confirm Password
        </label>
        <input
          type="password"
          id="confirm-password"
          name="confirmPassword"
          placeholder="Confirm Password"
          aria-describedby="confirm-password-error"
          className="peer block w-full rounded-lg hover:bg-gray-200 bg-gray-100 active:border-gray-200 py-2 px-3 text-sm placeholder:text-gray-500 transition-all duration-75"
        />
        <div
          id="confirm-password-error"
          aria-live="polite"
          aria-atomic="true"
          className="min-h-3"
        >
          {state.errors?.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">
              {state.errors.confirmPassword}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="mt-4 w-full rounded-lg bg-[#D49273] py-2 px-4 text-white hover:bg-[#9A654B] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Sign Up
      </button>
    </form>
  );
}
