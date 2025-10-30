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
    
    await auth.api.signInEmail({
        body: {
            email,
            password,
        }
    });

    redirect('/journal');
}

export async function signOutAction() {
    await auth.api.signOut({
        headers: await headers()
    })

    redirect('/')
}