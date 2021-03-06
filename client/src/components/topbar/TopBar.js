import "./topbar.css";
import { Chat, Notifications, Person, Search } from "@material-ui/icons";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../../actions/auth";

const TopBar = () => {
  const [user, setUser] = useState();
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const dispatch = useDispatch();
  const loggedUser = JSON.parse(localStorage.getItem("profile")).user;

  const activeUser = useSelector((state) =>
    state.userReducer.user?.find((u) => u._id === loggedUser?._id)
  );

  useEffect(() => {
    if (activeUser) setUser(activeUser);
  }, [activeUser]);

  const logOut = () => {
    dispatch(signOut());

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
          <Link to="addfriend" style={{ textDecoration: "none" }}>
            <div className="topbarIconItem">
              <Person style={{ color: "white" }} />
              <span className="topbarIconBadge">1</span>
            </div>
          </Link>
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
        <Link to={`/profile/${user?.username}`}>
          <img
            src={
              user?.profilePicture
                ? user.profilePicture
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
