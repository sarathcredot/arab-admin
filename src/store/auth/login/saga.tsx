import { call, put, takeEvery, takeLatest } from "redux-saga/effects";

// Login Redux States
import { LoginTypes } from "./actionTypes";
import { apiError, loginSuccess, logoutUserSuccess } from "./actions";

//Include Both Helper File with needed methods
import { getFirebaseBackend } from "../../../helpers/firebase_helper";
import {
  postFakeLogin,
  postJwtLogin,
  postSocialLogin,
} from "../../../helpers/fakebackend_helper";
import { gql, useMutation } from "@apollo/client";

const fireBaseBackend = getFirebaseBackend();



const LOGIN_MUTATION=gql `
mutation UpdateCategory($input: AdminLoginInput!) {
  loginAdmin(input: $input) {
    _id
    token
  }
}

`

// function* loginUser({ payload: { user, history } }: any) {
//   try {
//     if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
//       const response: Promise<any> = yield call(
//         fireBaseBackend.loginUser,
//         user.email,
//         user.password
//       );
//       yield put(loginSuccess(response));
//     } else if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {
//       const response: Promise<any> = yield call(postJwtLogin, {
//         email: user.email,
//         password: user.password,
//       });
//       localStorage.setItem("authUser", JSON.stringify(response));
//       yield put(loginSuccess(response));
//     } else if (process.env.REACT_APP_DEFAULTAUTH === "fake") {
//       const response: Promise<any> = yield call(postFakeLogin, {
//         email: user.email,
//         password: user.password,
//       });
//       localStorage.setItem("authUser", JSON.stringify(response));
//       yield put(loginSuccess(response));
//     }
//     history("/dashboard");
//   } catch (error) {
//     yield put(apiError(error));
//   }
// }

function*  loginUser({ payload: { user, history } }: any) {
  console.log("response", user);
  try {
    const { data } = yield call(() =>
      useMutation(LOGIN_MUTATION, {
        variables: {
          input: {
            email: user.email,
            password: user.password,
          },
        },
      })
    );

    console.log(data); 

    const response = data;
    console.log(response,"edfgdhfghkl")
    if (response) {

    console.log("response", response);
      localStorage.setItem("authUser", JSON.stringify(response));
      yield put(loginSuccess(response));
      history.push("/dashboard");
    } else {
      // Handle authentication failure
      yield put(apiError('Authentication failed'));
    }
  } catch (error) {
    // Handle other errors
    yield put(apiError(error));
  }
}

function* logoutUser({ payload: { history } }: any) {
  try {
    localStorage.removeItem("authUser");

    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const response: Promise<any> = yield call(fireBaseBackend.logout);
      yield put(logoutUserSuccess(response));
    }
    history.push("/login");
  } catch (error) {
    yield put(apiError(error));
  }
}

function* socialLogin({ payload: { type, history } }: any): Generator<any> {
  try {
    let response;
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const fireBaseBackend = getFirebaseBackend();
     const response = yield call(fireBaseBackend.socialLoginUser, type);
      if (response) {
        history("/dashboard");
      } else {
        history("/login");
      }
      localStorage.setItem("authUser", JSON.stringify(response));
      yield put(loginSuccess(response));
    }
    if (response)
      history("/dashboard");
  } catch (error) {
    yield put(apiError(error));
  }
}


function* authSaga() {
  yield takeEvery(LoginTypes.LOGIN_USER, loginUser);
  yield takeLatest(LoginTypes.SOCIAL_LOGIN, socialLogin);
  yield takeEvery(LoginTypes.LOGOUT_USER, logoutUser);
}

export default authSaga;
