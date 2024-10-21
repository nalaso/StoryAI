"use server"
import { signIn } from "@/auth"

export const signInGoogle = async () => {
    await signIn("google")
}