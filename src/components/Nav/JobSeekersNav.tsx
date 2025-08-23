import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const JobSeekersNav = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  return (
    <>
      <div>{user?.photo}</div>
      <div>{user?.firstname}</div>
      <div>{user?.email}</div>
    </>
  );
};

export default JobSeekersNav;
