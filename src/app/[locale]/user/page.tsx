"use client";
import JobSeekersNav from "@/components/Nav/JobSeekersNav";
import Nav from "@/components/Nav/Nav";
import { useLogoutUserMutation } from "@/services/authAPI";


const UserPage = () => {
  const [userLogout] = useLogoutUserMutation();

  const handleLogout = async () => {
    try {
      await userLogout(null).unwrap();
      window.location.href = "/";
    } catch (e) {
      console.log("Error happend while logging out", e);
    }
  };

  return (
    <>
      <Nav />
      <div> THis is End users page</div>
      <button onClick={handleLogout}>Logout</button>
    </>
  );
};

export default UserPage;
