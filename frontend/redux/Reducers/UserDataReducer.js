import { UPDATE_USER_DATA } from '@redux/Actions/UserDataAction';
import { safeUser } from '@utils/functions/safe_user';

/*
 * An action with NO payload keeps the state it had. It must never return `undefined`: redux
 * throws on that, and the throw comes out of `dispatch` — inside whatever was running at the
 * time. The stripping lives here because this is the one door into `userData`.
 */
const updateUserData = (state = {}, { type, payload }) => {
    switch (type) {
        case UPDATE_USER_DATA:
            return payload === undefined ? state : safeUser(payload);
        default:
            return state;
    }
};

export default updateUserData;
