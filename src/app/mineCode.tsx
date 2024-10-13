// "use client";
// import { Button } from "@/components/ui/button";
// import { useToast } from "@/hooks/use-toast";
// import axios, { AxiosError } from "axios";
// import { Loader2 } from "lucide-react";
// import { ApiError } from "next/dist/server/api-utils";
// import { useParams } from "next/navigation";
// import { useState } from "react";

// import { Message, useCompletion } from "ai/react";

// const page = () => {
//   // const { messages, input, handleInputChange, handleSubmit } = useChat();
//   // console.log({ messages, input, handleInputChange, handleSubmit });
//   const [sending, setSending] = useState(false);
//   const [inputValue, setInputValue] = useState("");
//   const params = useParams();
//   const { username } = params;
//   const { toast } = useToast();
//   const {
//     complete,
//     completion,
//     isLoading: isSuggestLoading,
//     error,
//   } = useCompletion({
//     api: "/api/chat",
//   });

//   const fetchSuggestedMessages = async () => {
//     try {
//       await complete("");
//     } catch (error) {
//       console.error("Error fetching messages:", error);
//       // Handle error appropriately
//     }
//   };

//   const handleOnChange = (e: any) => {
//     e.preventDefault();
//     setInputValue(e.target.value);
//   };

//   const handleSendMessage = async () => {
//     setInputValue("");
//     try {
//       setSending(true);
//       const response = await axios.post("/api/send-message", {
//         content: inputValue,
//         username,
//       });
//       toast({
//         title: `${response.data.statusCode < 300 ? "Success" : "Failed"}`,
//         description: response.data.message || "Message sent successfully",
//       });
//     } catch (error) {
//       const axiosError = error as AxiosError<ApiError>;
//       toast({
//         title: "Failed",
//         description:
//           axiosError?.response?.data.message || "Failed to send message",
//         variant: "destructive",
//       });
//     } finally {
//       setSending(false);
//     }
//   };

//   return (
//     <main className=" p-6 mx-auto min-h-screen w-[70%] flex flex-col items-center">
//       <section className="w-full">
//         <div className="mt-10">
//           <h1 className="text-center text-4xl font-bold lg:text-6xl">
//             Public Profile Link
//           </h1>
//         </div>
//         <div className=" flex flex-col gap-6 items-center justify-center mt-14 w-full">
//           <p className="font-bold">Send anonymous message to @{username}</p>
//           <textarea
//             className="flex border-ring h-20 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
//             placeholder="Write your message here"
//             value={inputValue}
//             onChange={handleOnChange}
//           />
//           <Button disabled={sending} onClick={handleSendMessage}>
//             {sending ? (
//               <>
//                 <Loader2 />
//                 <div>Sending</div>
//               </>
//             ) : (
//               <div>Send</div>
//             )}
//           </Button>
//         </div>
//       </section>

//       <section className="w-full bg-yellow-200">
//         <Button
//           onClick={fetchSuggestedMessages}
//           className="my-4"
//           disabled={isSuggestLoading}
//         >
//           Suggest Messages
//         </Button>

//         {/* <form onSubmit={handleSubmit}>
//           <input
//             name="prompt"
//             value={input}
//             onChange={handleInputChange}
//             id="input"
//           />
//           <button type="submit">Submit</button>
//           <div>Completion {completion}</div>
//         </form> */}

//         {/* <form onSubmit={handleSubmit}>
//           <input
//             className="text-black fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded"
//             value={input}
//             placeholder="Say something..."
//             onChange={handleInputChange}
//           />
//         </form> */}
//       </section>
//     </main>
//   );
// };

// export default page;
