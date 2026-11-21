export const UPDATE_USER_DATA = 'UPDATE_USER_DATA';

const update_user_data = (userData) => {
    return { type: UPDATE_USER_DATA, payload: userData };
};

export default update_user_data;
