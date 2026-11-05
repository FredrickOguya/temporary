"use server"

import { db } from "@/db"
import { users } from "@/db/schema"
import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"

export type RegisterFormState = {
  errors: {
    username?:string
    password?: string
    passwordConfirm?: string
    name?: string
  }
  values?: {
    name: string
    username: string
    password: string
    passwordConfirm: string
  }
}

export const registerUser = async ( prevState: RegisterFormState,  formData: FormData) => {
  const username = (formData.get("username") as string)?.trim()
  const name = (formData.get("name")as string)?.trim()
  const password = formData.get("password") as string
  const passwordConfirm = formData.get("passwordConfirm") as string

  const errors: RegisterFormState["errors"] = {}

  if (!username || username.length < 4) {
    errors.username = "Username must be at least 4 characters long"
  }

  if (!password || password.length < 4) {
    errors.password = "Password must be at least 4 characters long"
  }

  if(passwordConfirm !== password) {
    errors.passwordConfirm = "Passwords do not match"
  }

  if(!name) {
    errors.name = "name is required"
  }

  if (Object.keys(errors).length > 0){
    return {
      errors,
      values: {username, name, password, passwordConfirm}
    }
  }


  const passwordHash = await bcrypt.hash(password, 10)
  try {
    await db.insert(users).values({
      username, name, passwordHash
    })    
  } catch {
    return {
      errors: {
        username: "Username already exists"
      },
      values: { username, name, password, passwordConfirm }
    }
  }


  redirect("/login")
}