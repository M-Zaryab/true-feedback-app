import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Message } from "@/model/user.model";
import { useToast } from "@/hooks/use-toast";
import axios, { AxiosError } from "axios";
import { Alertdialog } from "./AlterDialog";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

export function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  const { toast } = useToast();

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete(`/api/delete-message/${message._id}`);
      console.log("response ", response);
      toast({
        title: response.data.message,
      });
      const messageId: string = `${message?._id}`;
      onMessageDelete(messageId);
    } catch (error) {
      const axiosError = error as AxiosError;
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle className="text-xl">{message.content}</CardTitle>
      </CardHeader>
      <CardFooter className="flex justify-between">
        {/* <Button onClick={handleDeleteConfirm} variant="destructive">
          Delete
        </Button> */}
        <Alertdialog handleDeleteConfirm={handleDeleteConfirm} />
      </CardFooter>
    </Card>
  );
}
