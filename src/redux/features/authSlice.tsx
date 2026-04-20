import { createSlice} from "@reduxjs/toolkit"
import { Session } from "@supabase/supabase-js"
interface InitState{
    isLoggedIn:boolean;
    user:Session|null
}
const initialState:InitState = {
    isLoggedIn:false,
    user:null
}
const authSlice = createSlice({
    name:"auth",
    reducers:{
        setUserSession:(state,{payload}:{payload:Session|null})=>{
            state.isLoggedIn = !!payload?.access_token
            state.user = payload
        }
    },
    initialState
})

export const {setUserSession} = authSlice.actions
export default authSlice.reducer
