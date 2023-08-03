"use client";
import { FC, useState } from "react";
import Button from "./Button";
import { checkFriend } from "@/lib/validCheck/addFriend";
import axios, { AxiosError } from "axios";
import { z, ZodError } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface AddFriendProps {}

type FormData = z.infer<typeof checkFriend>;
const AddFriend: FC<AddFriendProps> = ({}) => {
  const [successState, setSuccessState] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(checkFriend),
  });

  const addFriend = async (email: string) => {
    try {
      const validEmail = checkFriend.parse({ email });
      await axios.post("/api/friends/add", {
        email: validEmail,
      });
      setSuccessState(true);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError("email", { message: error.message });
        return;
      }
      if (error instanceof AxiosError) {
        setError("email", { message: error.response?.data });
        return;
      }
      setError("email", { message: "Something went wrong..." });
    }
  };

  const onSubmit = (data: FormData) => {
    addFriend(data.email);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm">
      <label
        htmlFor="email"
        className="px-6 block text-sm font-med leading-6 text-slate-100"
      >
        Friend Email
      </label>
      <div className="px-6 mt-2 flex gap-4">
        <input
          {...register("email")}
          type="text"
          className="block w-full rounded-md border-0 py-1.5 text-black-100 shadow-sm ring-1 ring-inset ring-gray-900 placeholder:text-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-500 sm:text-sm sm:leading-6"
          placeholder="bobsmith@hotmail.com"
        />
        <Button className="hover:bg-yellow-400">Add</Button>
      </div>
      <p className="mt-1 text-sm text-red-600"> {errors.email?.message}</p>
      {successState ? (
        <p className="mt-1 text-sm text-green-600">Request sent! </p>
      ) : null}
    </form>
  );
};

export default AddFriend;
