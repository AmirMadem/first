import React, { useState } from "react";
import FacebookLogin from "react-facebook-login";

import "./App.css";

function FacebookLoginComponent(props) {
  const [login, setLogin] = useState(false);

  const responseFacebook = (response) => {
    // Login failed
    if (response.status === "unknown") {
      alert("Login failed!");
      setLogin(false);
      return false;
    }
    const responseArr = [];
    responseArr.push(response);
    props.setUserPicture(response.picture.data.url);
    props.setUserName(response.name);
    const userID ="" +response.id;
    props.setUserID(userID);
    if (response.accessToken) {
      setLogin(true);
    } else {
      setLogin(false);
    }
  };

  const logout = () => {
    setLogin(false);
  };

  return (
    <div>
      {true && 
        <div className="container login-small-bunner" style={{padding:'0px'}}>
          {!login && (
            <FacebookLogin
              appId="3278070112454396"
              autoLoad={false}
              fields="name,email,picture"
              scope="public_profile,email,user_friends"
              callback={responseFacebook}
              icon="fa-facebook"
            />
          )}

          {login && (
              <></>
          )}
        </div>
      }
    </div>
  );
}

export default FacebookLoginComponent;