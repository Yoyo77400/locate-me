import { createSlice} from "@reduxjs/toolkit";

const initialState = {
    value : {
        nickname: '',
        city: [],
    },
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        addNickname: (state, action) => {
            state.value.nickname = action.payload;
        },
        addCity: (state, action) => {
            state.value.city.push(action.payload);
        },
        removeCity: (state, action) => {
            state.value.city = state.value.city.filter(city => city.name != action.payload.name);
        },
    },
})

export default userSlice.reducer;
export const { addNickname, addCity, removeCity } = userSlice.actions;