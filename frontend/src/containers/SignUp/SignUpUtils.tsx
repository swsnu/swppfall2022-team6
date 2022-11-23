export const isValidUserName = (username: string) => {
    if (username.length < 4) {
        alert('4자 이상의 아이디를 설정해 주세요');
        return false;
    }

		// 사실 위의 username 길이 제한 역시 regex로 설정할 수 있습니다!
		// 다만, 여기서는 alert문 문구를 다르게 하기 위해 if문을 분리했습니다.
		// ^(입력 시작), a-z(알파벳), 0-9(숫자), +(1번 이상), $(입력 끝부분), i(대소문자 구분없음)
    const regex = /^[a-z0-9]+$/i;
    if(!regex.test(username))  {
        alert('아이디는 영문과 숫자로만 입력해 주세요');
        return false;
    }

    return true;
};

// 비밀번호 (8자 이상, 비밀번호 - 비밀번호 확인 값 일치)
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