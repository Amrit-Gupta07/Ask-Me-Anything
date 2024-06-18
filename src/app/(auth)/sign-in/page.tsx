"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDebounce } from "usehooks-ts";
import { signInSchema } from "@/schemas/signInSchema";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "@/components/ui/use-toast";
import {signIn} from "next-auth/react"
import Link from "next/link";
export default function page() {
    const[isSubmitting,setIsSubmitting] = useState(false)
    const router = useRouter();
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
          identifier: "",
          password: "",
        },
      })

      const onSubmit = async(data : z.infer<typeof signInSchema>) => {
        try {
            setIsSubmitting(true);
            const result = await signIn('credentials',{
                redirect: false,
                identifier: data.identifier,
                password:data.password,
            })

            // console.log(result)

            if(result?.error){
                toast({
                    title:'Login Failed',
                    description:'Incorrect username or password',
                    variant:'destructive'
                })
            }
            if (result?.url) {
                router.replace('/dashboard');
            }

        } catch (error) {
            console.log(error)
        }
        finally{
            setIsSubmitting(false);
        }
      }
    
  return (
    <div className="bg-gray-800 min-h-screen flex justify-center items-center">
    <div className="bg-white w-full max-w-[85%] md:max-w-md rounded-lg shadow-md p-8">
        <div className="text-center">
            <h1 className="text-4xl font-extrabold mb-4"> Welcome Back to True Feedback</h1>
            <p className="mb-4">Sign in to continue your secret conversations</p>
        </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="identifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email/Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Email or Username" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Enter Password" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitting} className="p-4 w-full ">
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin mr-2" /> Please Wait
              </>
            ) : (
              <div>Sign In</div>
            )}
          </Button>
        </form>
      </Form>
      <div className="mt-4 text-center">
        <p>Not a member yet ?{' '}
        <Link href={'/sign-up'} className="text-blue-600 hover:text-blue-400">Sign Up </Link>
        </p>
      </div>
      </div>
    </div>
  )
}
