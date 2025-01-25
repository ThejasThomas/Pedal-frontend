import {configureStore} from '@reduxjs/toolkit'
import usereducer from './slice/userSlice'
import adminreducer from './slice/adminSlice'

const store = configureStore({
    reducer:{
        user: usereducer,
        admin: adminreducer
    }
})
store.subscribe(() => {
    console.log('Current Redux State:', store.getState())
})

export default store