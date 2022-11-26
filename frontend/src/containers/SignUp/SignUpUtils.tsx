export const isValidUserName = (username: string) => {
    if (username.length < 4) {
        alert('4자 이상의 아이디를 설정해 주세요');
        return false;
    }
    const regex = /^[a-z0-9]+$/i;
    if(!regex.test(username))  {
        alert('아이디는 영문과 숫자로만 입력해 주세요');
        return false;
    }

    return true;
};

export const isValidPassword = (password: string, passwordCheck: string) => {
    if (password !== passwordCheck) {
        alert('비밀번호와 비밀번호 확인에 입력된 값이 다릅니다');
        return false;
    }

    if (password.length < 8) {
        alert('8자리 이상의 비밀번호를 설정해 주세요');
        return false;
    }

    return true;
};