export interface ValidType {
    isValid: boolean;
    message: string;
}

export const checkValidUserName = (username: string) => {
    let isValid = true;
    let message = "";
    const regex = /^[a-z0-9]+$/i;

    if (username.length < 4) {
        isValid = false;
        message = '4자 이상의 아이디를 설정해 주세요';
    }
    if(!regex.test(username))  {
        isValid = false;
        message = '아이디는 영문과 숫자로만 입력해 주세요';
    }
    const res: ValidType = {isValid, message};
    return res;
};

export const checkValidEmail = (email: string) => {
    let isValid = true;
    let message = "";
    const emailRegex = /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{1,})$/i;

    if (!emailRegex.test(email)){
        isValid = false;
        message = '올바른 이메일 형식을 입력해 주세요';
    }
    const res: ValidType = {isValid, message};
    return res;
};

export const checkValidPassword = (password: string) => {
    let isValid = true;
    let message = "";

    if (password.length < 8) {
        isValid = false;
        message = '8자리 이상의 비밀번호를 설정해 주세요';
    }
    const res: ValidType = {isValid, message};
    return res;
};
export const checkValidPasswordCheck = (password: string, passwordCheck: string) => {
    let isValid = true;
    let message = "";

    if (password !== passwordCheck) {
        isValid = false;
        message = '비밀번호와 비밀번호 확인에 입력된 값이 다릅니다';
    }
    const res: ValidType = {isValid, message};
    return res;
};