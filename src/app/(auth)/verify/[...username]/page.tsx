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
import { verifySchema } from "@/schemas/verifySchema";
import { usernameValidation } from "@/schemas/signUpSchema";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";

import { toast } from "@/components/ui/use-toast";

export default function VerifyAccount() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const params = useParams<{ username: string }>();
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      setIsSubmitting(true);
      const response = await axios.post<ApiResponse>(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      });

      if(!response.data.success){
        return toast({
            title: 'Failed',
            description: response.data.message,
        })
      }

      toast({
        title: 'Success',
        description: response.data.message,
      });
      router.replace(`/sigin-in`)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Verification Failed',
        description:
          axiosError.response?.data.message ??
          'An error occurred. Please try again.',
        variant: 'destructive',
      });
    }finally{
        setIsSubmitting(false)
    }
  };
  return (
    <div>
      Verify Code
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verify Code</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Code" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <div>
                {" "}
                <Loader2 /> Please Wait
              </div>
            ) : (
              <div>Sign Up</div>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
