"use client";
import MessageCard from "@/components/MessageCard";
import React, { useCallback, useEffect, useState } from "react";
import { Message } from "@/model/User";
import { useToast } from "@/components/ui/use-toast";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { User } from "next-auth";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, RefreshCcw } from "lucide-react";

const UserDashboard = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { data: session } = useSession();

  const { toast } = useToast();

//   const username = session?.user.username as User;

  const handleDeleteMessage = (messageId: string) => {
    setMessages(
      messages.filter((message) => {

        return message._id !== messageId;
      })
    );
  };

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    try {
      setIsLoading(true);
      setIsSwitchLoading(true);

      const response = await axios.get<ApiResponse>(`/api/get-messages`);
      setMessages(response.data.messages || []);
      if (refresh) {
        toast({
          title: "Refreshed Messages",
          description: "Showing latest messages",
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ?? "Failed to fetch messages",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsSwitchLoading(false);
    }
  }, [setIsLoading,setMessages,toast]);



  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "URL Copied!",
      description: "Profile URL has been copied",
    });
  };

  const form = useForm<z.infer<typeof acceptMessageSchema>>({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { register, setValue, watch } = useForm();
  const isUseracceptMessages = watch("btn_acceptMessages");


  const fetchAcceptMessages = useCallback(async () => {
    try {
      setIsSwitchLoading(true);

      const response = await axios.get<ApiResponse>(`/api/accept-messages`);
      setValue("btn_acceptMessages", response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ?? "Fail to fetch message settings",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const handleSwitchChange = async () => {
    try{
        setIsSwitchLoading(true);
        const response = await axios.post<ApiResponse>(`api/accept-messages`,{
            acceptMessages: !isUseracceptMessages
        })
        setValue('btn_acceptMessages',!isUseracceptMessages)
        toast({
            title : response.data.message,
            variant : "default"
        })
    }
    catch(error){
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: "Error",
          description:
            axiosError.response?.data.message ?? "Failed to update message status",
          variant: "destructive",
        });
    }
    finally{
        setIsSwitchLoading(false)
    }
  };

  useEffect(() => {
    if (!session || !session.user) return;
    fetchAcceptMessages();
    fetchMessages();
  }, [session, fetchMessages, toast, setValue, fetchAcceptMessages]);

  if (!session || !session.user) {
    return <div></div>;
  }
  const {username} = session.user as User;


  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;
  return (
    <div className=" my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded max-w-6xl w-full">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy your unique link</h2>
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>
      <div className="mb-4">
        <Switch 
          {...register('btn_acceptMessages')}

        checked = {isUseracceptMessages}
        onCheckedChange={handleSwitchChange}
        disabled={isSwitchLoading}
        />
        <span className="ml-2">
            Accept Messages: {isUseracceptMessages ?'On' : 'Off'}
        </span>
      </div>
      <Button
      className="mb-4"
       variant={"outline"}
       onClick={() => {
       return fetchMessages(true)
       }}
      >{
        isLoading ? (
            <Loader2 className="animate-spin h-4 w-4"/>
        ):(
            <RefreshCcw className="h-4 w-4"/>
        )

    }
      </Button>
      <div className="grid  grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => {
            return (
              <MessageCard
                key={index}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            );
          })
        ) : (
          <p>No messages to display</p>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
