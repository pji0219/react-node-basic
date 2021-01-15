import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../_actions/user_action';

function LoginPage(props) {

    const dispatch = useDispatch();

    const [Email, setEmail] = useState()
    const [Password, setPassword] = useState()

    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value)
    }

    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value)
    }

    const onSubmitHandler = (event) => {
        event.preventDefault(); // 새로고침 막아줌 그렇게 하는 이유는 새로고침이 되어 버리면 아래에 그 다음에 할 일을 못하기 때문에
        // console.log(`email: ${Email}`);
        // console.log(`password: ${Password}`);

        let body = {
            enail: Email,
            password: Password
        }

        dispatch(loginUser(body))
            .then(response => {
                if (response.payload.loginSuccess) {
                    props.history.push('/') // 루트 페이지로 이동
                } else {
                    alert('Error')
                }
            })

    }

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            width: '100%', height: '100vh'
        }}>

            <form style={{ display: 'flex', flexDirection: 'column' }}
                onSubmit={onSubmitHandler}
            >
                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler} />
                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler} />
                <br />
                <button type="submit">Login</button>
            </form>

        </div>
    )
}

export default LoginPage
