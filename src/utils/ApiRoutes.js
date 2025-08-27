import {AppConstant} from './AppConstant';

export const ApiRoutes = {
  login: AppConstant.BASEURL + '/api/auth/login', //complete
  employeeCheckIn: AppConstant.BASEURL + '/api/attendance/checkin', //complete
  employeeCheckOut: AppConstant.BASEURL + '/api/attendance/checkout', //complete
  getMyAttendence: AppConstant.BASEURL + '/api/attendance/me', //complete
  getEmployeeInfo: AppConstant.BASEURL + '/api/auth/me', //complete
  addTask: AppConstant.BASEURL + '/api/tasks',
  getEmployeeTasks: AppConstant.BASEURL + '/api/tasks/me',
  getAllSalarySlips: AppConstant.BASEURL + '',
};
