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
import { Textarea } from "@/components/ui/textarea";
import { messageSchema } from "@/schemas/messageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });
  const [isLoading, setIsLoading] = useState(false);

  const initialMessageString =
    "What's your favorite movie?||Do you have any pets?||What's your dream job?";
  const specialCharater = "||";

  const parseInputString = (message: string): string[] => {
    return initialMessageString.split(specialCharater);
  };

  const { watch, handleSubmit, setValue } = useForm();

  const messageContent = form.watch("content");

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>(`/api/send-message`, {
        username,
        content: data.content,
      });

      toast({
        title: response.data.message,
        variant: "default",
      });
      form.setValue("content", "");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ?? "Failed to sent message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMessageClick = (message: string) => {
    form.setValue("content", message);
  };

  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Public Profile Link
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous message to to @{username}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 animate-spin" /> Please Wait
              </>
            ) : (
              <div>Send</div>
            )}
          </Button>
        </form>
      </Form>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Messages</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          {parseInputString(initialMessageString).map((message, index) => {
            return (
              <Button 
              key={index}  
              variant="outline"
              className="mb-2"

              onClick={() => handleMessageClick(message)}
              >
                {message}
              </Button>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
