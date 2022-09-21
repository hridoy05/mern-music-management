/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SetUser } from "../redux/userSlice";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import Layout from "./Layout";


function ProtectedRoute({ children }) {
 
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [readyToRender, setReadyToRender] = useState(false);
  const dispatch = useDispatch();
  const getUserData = async () => {
    try {
      dispatch(ShowLoading())
      const response = await axios.post(
        "http://localhost:5500/api/v1/get-user-data",
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
  }, []);
  

  return <div>{readyToRender && <Layout>{children}</Layout>}</div>;
}

export default ProtectedRoute;