import {combineReducers} from '@reduxjs/toolkit';
import userLogin from './reducer/LoginReducer';
 
const rootReducer = combineReducers({
  user: userLogin,
   
});

export default rootReducer;
