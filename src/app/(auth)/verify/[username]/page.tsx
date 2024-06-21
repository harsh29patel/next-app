'use client'
import { useToast } from '@/components/ui/use-toast';
import { verifySchema } from '@/schemas/verifySchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation'
import React from 'react'
import {  useForm } from 'react-hook-form';
import * as z from 'zod'
import axios, { Axios, AxiosError } from 'axios';
import { ApiResponse } from '@/types/apiResponse';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

    const VerifyPage = () => {
    const router = useRouter();
    const params= useParams<{username:string}>();
    const {toast}:any = useToast();

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver:zodResolver(verifySchema)
    })
    const onSubmit = async (data: z.infer<typeof verifySchema>) =>{
        try {
         const response =    await axios.post(`/api/verifyCode`,{
                username:params.username,
                code:data.code
            })

            toast({
                title:"Success",
                description:response.data.message
            })
            router.replace('/sign-in')
        } catch (error) {
            console.error("Error in signing in of user",error)
            const axiosError = error as AxiosError<ApiResponse>;
         
            toast({
                title:"Sign In failed",
                description:  axiosError.response?.data.message,
                variant:"destructive"
            })
        }
    }
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-800">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
              Join True Feedback
            </h1>
            <p className="mb-4">Sign up to start your anonymous adventure</p>
          </div>
          <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          name="code"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verification Code</FormLabel>
              <FormControl>
                <Input placeholder="code" {...field} />
              </FormControl>
            
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
          </div>
          </div>
    )
    }

    export default VerifyPage