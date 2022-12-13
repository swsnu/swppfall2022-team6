import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "..";
import { useDispatch } from "react-redux";

export interface ApiErrorType {
  code: ApiErrorCode;
  msg: string;
};

export enum ApiErrorCode {
  NONE,
  TOKEN,
  BAD_REQUEST,
  AUTH_FAIL,
  SERVER
}

export enum ApiErrorSource {
  SIGNIN,
  SIGNUP,
  USER,
  HASHTAG,
  POSITION,
  POST,
  REPORT
}

// export const checkApiResponseStatus = async(status: number, source: ApiErrorSource) => {
//   let code : ApiErrorCode;
//   let msg : string;
//   if (status === 401) {
//       code = ApiErrorCode.TOKEN;
//       msg = "로그인 후 2시간이 경과되었습니다. 다시 로그인해주세요.";
//   } else if (status === 403) {
//       code = ApiErrorCode.AUTH_FAIL;
//       msg = source === ApiErrorSource.USER? "이메일이나 비밀번호가 틀립니다.": "권한이 없습니다";
//   } else if (status == 400) {
//       code = ApiErrorCode.BAD_REQUEST;
//       msg = source === ApiErrorSource.USER? "이메일이나 비밀번호를 올바른 형식으로 입력해주세요": "올바른 형식으로 입력해주세요";
//   } else {
//       code = ApiErrorCode.SERVER;
//       msg = "서버에 문제가 발생했습니다. 다시 로드해 주세요";
//   }
//   const data: ApiErrorType = {code, msg};
//   console.log(data);
//   setApiError(data);
//   console.log("done");
// };

export const checkApiResponseStatus = createAsyncThunk(
  "checkApiResponseStatus",
  async (data: {status: number, source: ApiErrorSource}, {dispatch}) => {
    let code : ApiErrorCode;
    let msg : string;
    if (data.status === 401) {
        code = ApiErrorCode.TOKEN;
        msg = "로그인 후 2시간이 경과되었습니다. 다시 로그인해주세요.";
    } else if (data.status === 403) {
        code = ApiErrorCode.AUTH_FAIL;
        msg = data.source === ApiErrorSource.SIGNIN? "이메일이나 비밀번호가 틀립니다.": "권한이 없습니다";
    } else if (data.status == 400) {
        code = ApiErrorCode.BAD_REQUEST;
        if (data.source === ApiErrorSource.SIGNIN){
          msg = "이메일을 올바른 형식으로 입력해주세요"
        }else if( data.source === ApiErrorSource.SIGNUP ){
          msg = "중복되는 이메일/아이디 입니다. 다른 이메일/아이디를 입력해주세요"
        }else{
          msg = "bad request";
        }
    } else {
        code = ApiErrorCode.SERVER;
        msg = "서버에 문제가 발생했습니다. 다시 로드해 주세요";
    }
    const error: ApiErrorType = {code, msg};
    dispatch(setApiError(error));
  }
);

export interface ApiErrorState { apiError: ApiErrorType };

const defaultApiError: ApiErrorType = {
  code: ApiErrorCode.NONE,
  msg: ""
};

const initialState: ApiErrorState = {
  apiError: {
    code: ApiErrorCode.NONE,
    msg: ""
  }
};

export const apiErrorSlice = createSlice({
  name: "apiError",
  initialState,
  reducers: {
    setApiError: (state, action: PayloadAction<ApiErrorType>) => {
      const newApiError = {...action.payload};
      state.apiError = newApiError;
    },
    setDefaultApiError: (state,  _action) => {
      state.apiError = defaultApiError;
    },
  },
});

export const setApiError = createAsyncThunk(
  "setApiError",
  async (data: ApiErrorType, {dispatch}) => {
    dispatch(apiErrorActions.setApiError(data));
    return data;
  }
);
export const setDefaultApiError = createAsyncThunk(
  "setApiError",
  async (_, {dispatch}) => {
    dispatch(apiErrorActions.setDefaultApiError({}));
  }
);


export const apiErrorActions = apiErrorSlice.actions;
export const selectApiError = (state: RootState) => state.apiErrors;
export default apiErrorSlice.reducer;