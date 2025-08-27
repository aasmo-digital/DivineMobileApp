import {combineReducers} from '@reduxjs/toolkit';
import userLogin from './reducer/LoginReducer';
import employee from "./redux_slice/employeeSlice"
 
const rootReducer = combineReducers({
  user: userLogin,
  employee:employee
   
});

export default rootReducer;
