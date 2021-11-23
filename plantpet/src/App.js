import plant from "./plant_logo.png";
import loading from "./loading.gif";
import defBackground from "./background.png";
import React, { useState, useEffect } from "react";
import ProgressBar from "react-bootstrap/ProgressBar";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import "bootstrap/dist/css/bootstrap.min.css";
import Levels from "./Components/Levels";
import Seed from "./Components/Seed";
import "./App.css";
import waterplant from "./water.png";
import leaderboard from "./leaderboard.png";
import logo from "./gamelogo.png";
import instructions from "./instructions.png";
import shopbutton from "./shop.png";
import info from "./info.png";
import LoginButton from "./Components/Loginout/LoginButton";
import LogoutButton from "./Components/Loginout/LogoutButton";
import Profile from "./Components/Profile";
import { useAuth0 } from "@auth0/auth0-react";
//import axios from "axios";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import Button from "react-bootstrap/Button";
import Leaderboard from "./Components/Leaderboard";
import growBackground from "./growth.png";

const axios = require("axios");
const cors = require("cors");

function App() {
  const [background, setBackground] = useState(defBackground);
  const [fertilize, setFertilize] = useState(false);
  const { isLoading } = useAuth0();
  //if (isLoading) {
  //return <div>loading...</div>
  //}
  const { user, isAuthenticated } = useAuth0();

  //backend setup stuff
  /*const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);*/
  document.body.style = "background: #ACBD67;";
  const [water, setWater] = useState(0);
  const clickHandlerWater = () => {
    if (!fertilize) {
      setWater((oldwater)=> oldwater+1);
    } else {
      setWater((oldwater)=> oldwater+7);
    }
    if (water > 19 || (water > 13 && fertilize) ) {
      setWater(0);
      let tempUser = currUser;
      tempUser.PlantLevel = tempUser.PlantLevel + 0.25;
      let tempStr = "http://localhost:2500/users/" + String(tempUser.UserID);
      axios
        .patch(tempStr, tempUser)
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
      setLevel(level + 0.25);
    }
  };

  const clickFertilizer = () => {
    let tempUser = currUser;
    tempUser.PlantLevel = tempUser.PlantLevel + 0.1;
    console.log("-here");
    console.log(tempUser.UserID);
    console.log("-here");
    let tempStr = "http://localhost:2500/users/" + String(tempUser.UserID);
    console.log(tempStr);
    axios
      .patch(tempStr, tempUser)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
    setLevel(level + 0.1);
    setSeed(seed + 5);
    setBackground(growBackground);
    setFertilize(true);
    setTimeout(() => {
      setBackground(defBackground);
      setFertilize(false);
    }, 5000);
  };

  const [level, setLevel] = useState(1);
  const [currUser, setCurrUser] = useState([]);
  const [seed, setSeed] = useState(0);

  //isAuthenticated && setLevel(10);
  const [allUsers, setAllUsers] = useState([]);
  useEffect(() => {
    const interval = setInterval(() => {
      console.log(seed);
      setSeed((prevSeed) => prevSeed + 1);
      let tempUser = currUser;
      tempUser.SeedCount = tempUser.SeedCount + 1;
      let tempStr = "http://localhost:2500/users/" + String(tempUser.UserID);
      console.log("currUser:");
      console.log(currUser);
      /*axios
        .patch(tempStr, tempUser)
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });*/
    }, 5000);

    setLevel(level + 0.25);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    console.log("in use effect!");
    axios.get("http://localhost:2500/users").then(function (response) {
      let currUserData = JSON.stringify(user, null, 2);
      setAllUsers(response.data);
      let allData = response.data["users"];
      setLevel(5);
    });
  }, []);

  return (
    <div style={{ backgroundImage: `url(${background})` }}>
      <div className="App">
        <Navbar
          className="navbar-custom"
          expand="lg"
          variant="light"
          bg="light"
        >
          <Container>
            <Navbar.Brand href="#">
              <img className="logo" src={logo}></img>
            </Navbar.Brand>
            <Navbar.Text>
              <Profile
                allUsers={allUsers}
                setCurrUserProf={setCurrUser}
                setLevelProf={setLevel}
                setSeedProf={setSeed}
              />
              {!isAuthenticated && !isLoading && <LoginButton />}
              {isAuthenticated && !isLoading && <LogoutButton />}
              <Popup
                trigger={
                  <button className="directions">
                    {" "}
                    <img className="instlogo" src={info}></img>{" "}
                  </button>
                }
                modal
              >
                <span>
                  {" "}
                  <img className="instructions" src={instructions}></img>{" "}
                </span>
              </Popup>
            </Navbar.Text>
          </Container>
        </Navbar>

        {isLoading && (
          <div>
            <img className="loading" src={loading}></img>
          </div>
        )}
        <div>
          {isAuthenticated && !isLoading && (
            <div>
              <Levels level={level} arg="hello" />
            </div>
          )}
          {isAuthenticated && !isLoading && (
            <Seed className="seed" seed={seed} />
          )}
          <div className="leaderHolder">
            {isAuthenticated && !isLoading && (
              <Popup
                trigger={
                  <button className="leaderboard">
                    <img src={leaderboard} className="leader" />
                  </button>
                }
              >
                <Leaderboard />
              </Popup>
            )}
          </div>
        </div>
        {isAuthenticated && !isLoading && (
          <img src={plant} className="imgprop" />
        )}
        {isAuthenticated && !isLoading && (
          <div className="container">
            <div className="water">
              <div className="progBar">
                <ProgressBar animated variant="success" now={water} max={21} />
              </div>
              <button onClick={clickHandlerWater} className="waterButton">
                <img className="waterlogo" src={waterplant}></img>
              </button>
            </div>
          </div>
        )}

        {isAuthenticated && !isLoading && (
          <div className="shop">
            <Popup
              trigger={
                <button className="shopButton">
                  <img className="shoplogo" src={shopbutton}></img>
                </button>
              }
              position="top center"
            >
              {/* popup content here */}
              <div>
                <Button onClick={clickFertilizer} variant="success" size="lg">
                  Fertilizer
                </Button>{" "}
                <Button onClick={clickFertilizer} variant="warning" size="lg">
                  Growth Light
                </Button>{" "}
              </div>
            </Popup>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
