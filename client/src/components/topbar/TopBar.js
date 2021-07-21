import "./topbar.css";
import { Chat, Notifications, Person, Search } from "@material-ui/icons";
import { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { LOGOUT } from "../../constants/auth";

const TopBar = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const history = useHistory();
  const dispatch = useDispatch();

  const logOut = () => {
    dispatch({ type: LOGOUT });
    history.push("/login");
    setUser(null);
  };

  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">BharatSocial</span>
        </Link>
      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <Search className="searchIcon" />
          <input placeholder="Search for... " className="searchInput" />
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarLinks">
          <Link to="/" style={{ textDecoration: "none" }}>
            <span className="topbarLink">Homepage</span>
          </Link>
          <Link
            to={`/profile/${user?.username}`}
            style={{ textDecoration: "none" }}
          >
            <span className="topbarLink">Timeline</span>
          </Link>
        </div>
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <Person />
            <span className="topbarIconBadge">1</span>
          </div>
          <Link to="messenger" style={{ textDecoration: "none" }}>
            <div className="topbarIconItem">
              <Chat style={{ color: "white" }} />
              <span className="topbarIconBadge">1</span>
            </div>
          </Link>
          <div className="topbarIconItem">
            <Notifications />
            <span className="topbarIconBadge">1</span>
          </div>
        </div>
        <div className="topbarLinks" onClick={logOut}>
          <span className="topbarLink">LogOut</span>
        </div>
        <Link to={`/profile/${user.username}`}>
          <img
            src={
              user.profilePicture
                ? PF + user.profilePicture
                : PF + "person/noAvatar.png"
            }
            alt=""
            className="topbarImg"
          />
        </Link>
      </div>
    </div>
  );
};

export default TopBar;
