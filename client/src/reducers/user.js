import {
  FETCH_A_USER,
  FETCH_FRIEND_LIST,
  FETCH_FRIEND_SUGGESTION,
  FETCH_POST_USER,
  FOLLOW,
  UNFOLLOW,
  UPLOAD_COVER_IMG,
  UPLOAD_PROFILE_IMG,
} from "../constants/user";

const userReducer = (
  state = { user: [], friendList: [], friendSuggestion: [] },
  action
) => {
  switch (action.type) {
    case FETCH_A_USER:
      return { ...state, user: [...state.user, action?.payload] };

    case FETCH_POST_USER:
      return { ...state, user: [...state.user, action?.payload] };

    case FETCH_FRIEND_LIST:
      return { ...state, friendList: action?.payload };

    case FOLLOW:
    case UNFOLLOW:
      return state;

    case UPLOAD_COVER_IMG:
      return {
        ...state,
        user: state.user.map((u) =>
          u.username === action.payload.username
            ? { ...u, coverPicture: action.payload.url }
            : u
        ),
      };

    case UPLOAD_PROFILE_IMG:
      return {
        ...state,
        user: state.user.map((u) =>
          u.username === action.payload.username
            ? { ...u, profilePicture: action.payload.url }
            : u
        ),
      };

    case FETCH_FRIEND_SUGGESTION:
      return {
        ...state,
        friendSuggestion: action?.payload,
      };

    default:
      return state;
  }
};

export default userReducer;
