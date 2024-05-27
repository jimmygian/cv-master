import { useEffect, useState } from "react";
import { useGlobalContext } from "../../utils/GlobalContext";
import { 
  // Navigate, 
  useNavigate } from "react-router-dom";
import "./logingood.css";
import { useAuth } from "../../utils/contexts/authContext";
import { getUserCVs } from "../../config/firestore";
// import { setDoc } from "firebase/firestore";

export default function Home(props) {
  const { userLoggedIn, currentUser } = useAuth();
  const { logout, capitalize } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(false);
  const [userCVsLength, setUserCVsLength] = useState(0);
  const navigate = useNavigate();

  // FETCH COMPONENT DATA
  useEffect(() => {
    const fetchCVs = async () => {
      if (!currentUser) return; // Stop fetch if not logged in
      
      setIsLoading(true);
      try {
        const CVs = await getUserCVs(currentUser.uid);
        // console.log(CVs);
        setUserCVsLength(CVs.length);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCVs();
  }, [currentUser]);

  // NAVIGATION
  function goToCVs() {
    navigate("/myCVs");
  }
  function goToSearch() {
    navigate("/searchJobs");
  }
  function goToEditor() {
    console.log("Pressed!");
    navigate("/editor");
  }

  return (
    <div className="loginCompWrapper">
      {isLoading ? (
        <h1>Loading...</h1>
      ) : (
        <>
          <h1>{`Welcome, ${capitalize(currentUser.email)}!`}</h1>
          {userCVsLength > 0 ? (
            <h3 className="CVcound">
              You have created{" "}
              <a
                className="goToCVsLink"
                tabIndex="0"
                onClick={goToCVs}
              >{`${userCVsLength} CVs`}</a>
            </h3>
          ) : (
            <h3 className="CVcound">Lets create your first CV!</h3>
          )}
          <div className="container-fluid actionContainer">
            <button onClick={goToEditor} className=" btn welcomeBtn">
              Create CV
            </button>
            {userCVsLength > 0 && (
              <button onClick={goToSearch} className=" btn welcomeBtn">
                Search Jobs
              </button>
            )}
            <button onClick={logout} className=" btn welcomeBtn">
              Log out?
            </button>
          </div>
        </>
      )}
    </div>
  );
}
