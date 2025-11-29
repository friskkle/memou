"use client";

import React, { useActionState, useState } from "react";
import {
  signInAction,
  SignInState,
  signUpAction,
  SignUpState,
  forgotPasswordAction,
  ForgotPasswordState,
  resetPasswordAction,
  ResetPasswordState,
} from "@/src/lib/actions/auth";
import { PrimaryButton } from "../../elements/primary-button";

type AuthView = 'signin' | 'signup' | 'forgot-password';

export function AuthForm() {
  const [view, setView] = useState<AuthView>('signin');

  const getTitle = () => {
    switch (view) {
      case 'signin': return 'Sign In';
      case 'signup': return 'Sign Up';
      case 'forgot-password': return 'Reset Password';
    }
  };

  return (
    <div className="flex flex-col rounded-2xl bg-white py-10 px-10 md:px-16 md:min-w-lg shadow-md">
      <div className="flex rounded-md">
        <h1 className="text-2xl font-semibold mb-6 rounded-md">
          {getTitle()}
        </h1>
      </div>
      
      {view === 'signin' && <SignInForm onForgotPassword={() => setView('forgot-password')} />}
      {view === 'signup' && <SignUpForm />}
      {view === 'forgot-password' && <ForgotPasswordForm onBack={() => setView('signin')} />}

      <div className="mt-4 text-center text-sm text-gray-600">
        {view === 'signin' && (
          <div className="cursor-pointer" onClick={() => setView('signup')}>
            {`Don't have an account? `}
            <p className="text-blue-500 inline">Sign Up</p>
          </div>
        )}
        {view === 'signup' && (
          <div className="cursor-pointer" onClick={() => setView('signin')}>
            {`Already have an account? `}
            <p className="text-blue-500 inline">Sign In</p>
          </div>
        )}
        {view === 'forgot-password' && (
          <div className="cursor-pointer" onClick={() => setView('signin')}>
            <p className="text-blue-500 inline">Back to Sign In</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function SignInForm({ onForgotPassword }: { onForgotPassword: () => void }) {
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

      <div className="flex items-center justify-between">
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
          type="button"
          onClick={onForgotPassword}
          className="text-sm text-blue-500 hover:underline"
        >
          Forgot Password?
        </button>
      </div>

      <PrimaryButton size="small" type="submit" className="mt-4 w-full">
        Sign In
      </PrimaryButton>
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

      <PrimaryButton size="small" type="submit" className="mt-4 w-full">
        Sign Up
      </PrimaryButton>
    </form>
  );
}

export function ForgotPasswordForm({ onBack }: { onBack: () => void }) {
  const initialState: ForgotPasswordState = { message: null, errors: {} };
  const [state, formAction] = useActionState(forgotPasswordAction, initialState);

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

      {state.message && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md text-sm">
          {state.message}
        </div>
      )}

      <PrimaryButton size="small" type="submit" className="mt-4 w-full">
        Send Reset Link
      </PrimaryButton>
    </form>
  );
}

export function ResetPasswordForm({ token }: { token: string }) {
  const initialState: ResetPasswordState = { message: null, errors: {} };
  const [state, formAction] = useActionState(resetPasswordAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-1 w-full">
        <input type="hidden" name="token" value={token} />
      <div className="w-full">
        <label
          className="block text-sm font-medium text-gray-700 mb-1 px-1"
          htmlFor="password"
        >
          New Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter New Password"
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
          Confirm New Password
        </label>
        <input
          type="password"
          id="confirm-password"
          name="confirmPassword"
          placeholder="Confirm New Password"
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

      {state.message && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {state.message}
        </div>
      )}

      <PrimaryButton size="small" type="submit" className="mt-4 w-full">
        Reset Password
      </PrimaryButton>
    </form>
  );
}
