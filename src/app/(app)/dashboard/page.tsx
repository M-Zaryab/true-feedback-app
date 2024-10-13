"use client";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { use, useCallback, useEffect, useState } from "react";
import { Message } from "@/model/user.model";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import axios, { AxiosError } from "axios";
import { ApiError } from "next/dist/server/api-utils";
import { ApiResponse } from "@/types/ApiResponse";
// import { User } from "next-auth";
import { User } from "@/model/user.model";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCcw } from "lucide-react";
import { MessageCard } from "@/components/MessageCard";
import Link from "next/link";
import { Oval } from "react-loader-spinner";

const page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof acceptMessageSchema>>({
    resolver: zodResolver(acceptMessageSchema),
  });
  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");
  const { data: session } = useSession();
  const { username } = (session?.user as User) || {};
  const [profileUrl, setProfileUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = `${window.location.protocol}//${window.location.host}`;
      setProfileUrl(`${url}/u/${username}`);
    }
  }, [username]);

  // const baseUrl = `${window.location.protocol}//${window.location.host}`;
  // const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "URL copied",
      description: "Profile URL has beed copied to clipboard",
    });
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get("/api/accept-messages");
      const currentAcceptStatus = response?.data?.data.isAcceptingMessages;
      // console.log("currentAcceptStatus ", currentAcceptStatus);
      setValue("acceptMessages", currentAcceptStatus);
    } catch (error) {
      const errorMessage = error as AxiosError<ApiError>;
      toast({
        title: "Error",
        description:
          errorMessage?.response?.data.message ||
          "Failed to fetch message settings. ",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");
        // console.log("messages ", response.data.messages);
        setMessages(response.data.messages || []);
        if (refresh) {
          toast({
            title: "Refreshed",
            description: "Showing latest messages",
          });
        }
      } catch (error) {
        const errorMessage = error as AxiosError<ApiError>;
        toast({
          title: "Error",
          description:
            errorMessage?.response?.data.message ||
            "Failed to fetch message settings. ",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages]
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchAcceptMessages();
    fetchMessages();
  }, [session, setValue, fetchAcceptMessages, fetchMessages]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post("/api/accept-messages", {
        isAcceptingMessage: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast({
        title: response.data.message,
        variant: "default",
      });
    } catch (error) {
      const errorMessage = error as AxiosError<ApiError>;
      toast({
        title: "Error",
        description:
          "Failed to fetch message settings. " ||
          errorMessage?.response?.data.message,
        variant: "destructive",
      });
    }
  };

  if (!session || !session.user) {
    return (
      <>
        <div className="flex justify-center items-center h-40 ">
          <h1 className="text-xl">
            <Button className="text-xl" variant="link">
              <Link href="/sign-in">Please Login</Link>
            </Button>
          </h1>
        </div>
      </>
    );
  }

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy your Unique Link</h2>
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
          {...register("acceptMessages")}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? "On" : "Off"}
        </span>
      </div>
      <Separator />
      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Oval
            visible={true}
            height="20"
            width="20"
            color="#fff"
            ariaLabel="oval-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={index}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <div>No messages to display</div>
        )}
      </div>
    </div>
  );
};

export default page;
