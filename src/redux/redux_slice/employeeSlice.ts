// src/redux/slices/employeeSlice.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface IdProof {
  backImageUrl: string;
  frontImageUrl: string;
  idNumber: string;
  idType: string;
}

interface WorkLocation {
  latitude: string;
  longitude: string;
  radius: number;
}

export interface Employee {
  __v: number;
  _id: string;
  address: string;
  alternateContactNo: string;
  assignedArea: string;
  assignedCity: string;
  contactNo: string;
  createdAt: string;
  createdBy: string;
  dailySalary: number;
  email: string;
  fullName: string;
  idProof: IdProof;
  isActive: boolean;
  profilePhotoUrl: string;
  role: string;
  state: string;
  uniqueId: string;
  updatedAt: string;
  workLocation: WorkLocation;
}

interface EmployeeState {
  employee: Employee | null;
}

const initialState: EmployeeState = {
  employee: null,
};

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    setEmployee: (state, action: PayloadAction<Employee>) => {
      state.employee = action.payload;
    },
    clearEmployee: state => {
      state.employee = null;
    },
  },
});

export const {setEmployee, clearEmployee} = employeeSlice.actions;
export default employeeSlice.reducer;
