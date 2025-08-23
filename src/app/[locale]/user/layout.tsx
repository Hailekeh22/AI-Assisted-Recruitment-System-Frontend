"use client";

import { hydrateUser } from "@/store/slices/authSlice";
import { ReactNode, useEffect } from "react";
import { useDispatch } from "react-redux";

type Props = {
  children: ReactNode;
};

export default function UserLayout({ children }: Props) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(hydrateUser());
  }, [dispatch]);

  return (
    <div>
      <main>{children}</main>
    </div>
  );
}
