"use server";

import { z } from 'zod'
import { auth } from '@/src/lib/auth';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export type SignUpState = {
    message?: string | null;
    errors?: {
        email?: string[];
        password?: string[];
        confirmPassword?: string[];
        name?: string[];
    }
}

export type SignInState = {
    message?: string | null;
    errors?: {
        email?: string[];
        password?: string[];
    }
}

export type ForgotPasswordState = {
    message?: string | null;
    errors?: {
        email?: string[];
    }
}

export type ResetPasswordState = {
    message?: string | null;
    errors?: {
        password?: string[];
        confirmPassword?: string[];
    }
}

const SignUpFormSchema = z.object({
    email: z.email({message: "Invalid email address"}),
    password: z.string().min(6, {message: "Password must be at least 6 characters"}).max(100, {message: "Password must be less than 100 characters"}),
    confirmPassword: z.string(),
    name: z.string().min(1, {message: "Name is required"}).max(100, {message: "Name must be less than 100 characters"}),
})

const SignInFormSchema = z.object({
    email: z.email({message: "Invalid email address"}),
    password: z.string().min(1, {message: "Password is empty"}),
})

const ForgotPasswordSchema = z.object({
    email: z.email({message: "Invalid email address"}),
})

const ResetPasswordSchema = z.object({
    password: z.string().min(6, {message: "Password must be at least 6 characters"}).max(100, {message: "Password must be less than 100 characters"}),
    confirmPassword: z.string(),
    token: z.string(),
})


export async function signUpAction(prevState: SignUpState, formData: FormData) {
    const validatedFields = SignUpFormSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
        name: formData.get('name')
    })
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Error validating sign up information."
        }
    }
    const { email, password, confirmPassword, name } = validatedFields.data

    if (password !== confirmPassword) {
        return {
            errors: {
                confirmPassword: ["Passwords do not match"]
            },
            message: "Error validating sign up information."
        }
    }
    await auth.api.signUpEmail({
        body: {
            email,
            password,
            name
        }
    });

    redirect('/signin');
}

export async function signInAction(prevState: SignInState, formData: FormData) {
    const validatedFields = SignInFormSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    })
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Error validating sign in information."
        }
    }
    const { email, password } = validatedFields.data
    
    try {
        await auth.api.signInEmail({
        body: {
            email,
            password,
        }
    });
    } catch (error) {
        return {
            errors: {
                password: ["Invalid email or password"],
            },
            message: "Invalid email or password"
        }
    }

    redirect('/journal');
}

export async function signOutAction() {
    await auth.api.signOut({
        headers: await headers()
    })

    redirect('/')
}

export async function forgotPasswordAction(prevState: ForgotPasswordState, formData: FormData) {
    const validatedFields = ForgotPasswordSchema.safeParse({
        email: formData.get('email'),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Error validating email."
        }
    }

    const { email } = validatedFields.data;

    await auth.api.requestPasswordReset({
        body: {
            email,
            redirectTo: '/reset-password', 
        }
    });

    return {
        message: "If an account exists with this email, you will receive a password reset link."
    };
}

export async function resetPasswordAction(prevState: ResetPasswordState, formData: FormData) {
    const validatedFields = ResetPasswordSchema.safeParse({
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
        token: formData.get('token'),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Error validating password."
        }
    }

    const { password, confirmPassword, token } = validatedFields.data

    if (password !== confirmPassword) {
        return {
            errors: {
                confirmPassword: ["Passwords do not match"]
            },
            message: "Error validating password."
        }
    }

    try {
        await auth.api.resetPassword({
            body: {
                newPassword: password,
                token
            }
        });
    } catch (error) {
         return {
            message: "Failed to reset password. The token may be invalid or expired: " + error
        }
    }

    redirect('/signin');
}