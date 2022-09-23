import React, { useEffect} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SetAllSongs, SetUser } from "../redux/userSlice";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import Layout from "./Layout";

function ProtectedRoute({ children }) {
 
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [readyToRender, setReadyToRender] = React.useState(false);
  const dispatch = useDispatch();
  const getUserData = async () => {
    try {
      dispatch(ShowLoading())
      const response = await axios.post(
        "http://localhost:5500/api/v1/user/get-user-data",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(HideLoading())
      if (response.data.success) {
        dispatch(SetUser(response.data.data));
      } else {
        alert(response.data.message);
      }
      setReadyToRender(true);
    } catch (error) {
      dispatch(HideLoading())
      localStorage.removeItem("token");
      setReadyToRender(true);
      navigate("/login");
    }
  };

  useEffect(() => {
    if (user === null) {
      getUserData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const getAllSongs = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axios.post(
        "http://localhost:5500/api/v1/get-all-songs",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(SetAllSongs(response.data.data));
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      console.log(error);
    }
  };

  useEffect(() => {
    getAllSongs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <div>{readyToRender && <Layout>{children}</Layout>}</div>;
}

export default ProtectedRoute;