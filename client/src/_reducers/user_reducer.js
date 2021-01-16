import {
    LOGIN_USER,
    REGISTER_USER
} from '../_actions/types';

// 파라미터 state는 이전 state
export default function (state = {}, action) {
    switch (action.type) {
        case LOGIN_USER:
            return { ...state, loginSuccess: action.payload }
            break;
        case REGISTER_USER:
            return { ...state, register: action.payload }
            break;

        default:
            return state;
    }
}