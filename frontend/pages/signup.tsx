import { GetServerSidePropsContext } from 'next'
import Link from 'next/link'
import { useState } from 'react'
import { useMutation } from 'react-query'
import { SubmitHandler, useForm } from 'react-hook-form'
import Input, { Inputs } from '@/components/Auth/Input'
import * as authService from '@/lib/auth.service'
import Button from '@/components/Auth/Button'

interface IMessage {
  text: string
  type: 'success' | 'error'
}

const SignUp = () => {
  const [message, setMessage] = useState<IMessage | null>()
  const { isLoading, mutateAsync } = useMutation(authService.signup)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      await mutateAsync(data)
      setMessage({
        text: 'Sign up succesful, you can now login.',
        type: 'success',
      })
      reset()
    } catch (error: any) {
      setMessage({ text: error.message, type: 'error' })
    }
  }

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <div className="w-full md:max-w-xl px-4">
        {/* HEADER */}
        <h1 className="font-display text-5xl tracking-tight text-center">
          SIGN UP
        </h1>

        {/* FORM */}
        <form className="mt-16 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {message && (
            <div
              className={`w-full ${
                message.type === 'error'
                  ? 'bg-red-100 border-stone-300'
                  : 'bg-green-500 text-white'
              }  text-center py-4 rounded`}
            >
              {message.text}
            </div>
          )}
          <Input text="email" register={register} />
          {errors.email && (
            <span className="text-xs">This field is required</span>
          )}

          <Input text="password" register={register} />
          {errors.password && (
            <span className="text-xs">This field is required</span>
          )}
          <Button text="Sign Up" type="submit" disabled={isLoading} />
        </form>

        {/* FOOTER */}
        <p className="mt-4">
          Already have an account?
          <Link href="/login" legacyBehavior>
            <button type="button" className="underline ml-2">
              Log in here
            </button>
          </Link>
        </p>
      </div>
    </div>
  )
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  try {
    // user found in the cookies
    await authService.getRefreshTokenSSR(context)

    context.res.writeHead(302, {
      Location: '/',
    })
    context.res.end()
    return { props: {} as never }
  } catch (err) {
    // user not found in the cookies
    return { props: {} as never }
  }
}

export default SignUp
