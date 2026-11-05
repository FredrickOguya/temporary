"use client"

import { useActionState } from "react"
import { RegisterFormState, registerUser } from "../actions/users"

const initialState: RegisterFormState = {
  errors: {},
  values: {
    username: "",
    name: "",
    password: "",
    passwordConfirm: ""
  }
}

const RegisterPage = () => {
  const [state, formAction] =  useActionState(registerUser, initialState)
  return (
    <div>
      <h2>Register</h2>
      <form action={formAction}>

        <div>
          <label>
            Username
            <input type="text" name="username" required defaultValue={state.values?.username}/>
          </label>
          {state.errors.username && (
            <p data-testid="username-error" style={{ color: "red"}}>{state.errors.username}</p>
          )}
        </div>
        <div>
          <label>
            Name
            <input type="text" name="name" required defaultValue={state.values?.name}/>
          </label>
          {state.errors.name && (
            <p style={{ color: "red"}}>{state.errors.name}</p>
          )}
        </div>
        <div>
          <label>
            Password
            <input type="password" name="password" required defaultValue={state.values?.password}/>
          </label>
          {state.errors.password && (
            <p style={{ color: "red"}}>{state.errors.password}</p>
          )}
        </div>
        <div>
          <label>
            Confirm Password
            <input type="password" name="passwordConfirm" required defaultValue={state.values?.password}/>
          </label>
          {state.errors.passwordConfirm && (
            <p data-testid="passwordConfirm-error" style={{ color: "red"}}>{state.errors.passwordConfirm}</p>
          )}
        </div>
        <button type="submit" data-testid="register-button">Register</button>
      </form>
    </div>
  )
}

export default RegisterPage