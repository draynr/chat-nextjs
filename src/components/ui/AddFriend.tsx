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
        className="block text-sm font-med leading-6 text-gray-900"
      >
        add friend (email)
      </label>
      <div className="mt-2 flex gap-4">
        <input
          {...register("email")}
          type="text"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="bobsmith@hotmail.com"
        />
        <Button>add</Button>
      </div>
      <p className="mt-1 text-sm text-red-600"> {errors.email?.message}</p>
      {successState ? (
        <p className="mt-1 text-sm text-green-600">Request sent! </p>
      ) : null}
    </form>
  );
};

export default AddFriend;
