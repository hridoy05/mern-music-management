import {createSlice} from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: 'user',
    initialState:{
        user: null,
        allSongs:[]
    },
    reducers:{
        SetUser:(state, action)=> {
            state.user = action.payload
        },
        SetAllSongs: (state, action)=> {
            state.allSongs = action.payload
        }
    }
})

export const {SetUser, SetAllSongs} = userSlice.actions