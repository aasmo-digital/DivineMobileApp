import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/home/HomeScreen';
import AttendanceScreen from '../screens/attendence/AttendanceScreen';
import SubmitTaskScreen from '../screens/submit_task/SubmitTaskScreen';
import TaskHistoryScreen from '../screens/task_history/TaskHistoryScreen';
import AttendanceHistoryScreen from '../screens/attendencehistory/AttendanceHistoryScreen';
import SalarySlipsScreen from '../screens/salaryslips/SalarySlipsScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {CustomTabBar} from '../components';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator();
const TaskStack = createNativeStackNavigator();

// function TaskNavigator() {
//   return (
//     <TaskStack.Navigator screenOptions={{headerShown: false}}>
//       <TaskStack.Screen
//         name="TaskList"
//         component={TaskHistoryScreen}
//         options={{title: 'My Submitted Tasks'}}
//       />
//       <TaskStack.Screen
//         name="SubmitTask"
//         component={SubmitTaskScreen}
//         options={{title: 'Submit New Task'}}
//       />
//     </TaskStack.Navigator>
//   );
// }

const AppNavigator = () => (
  <Tab.Navigator
    screenOptions={{headerShown: false}}
    tabBar={props => <CustomTabBar {...props} />}>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Attendance" component={AttendanceScreen} />
    {/* <Tab.Screen name="Tasks" component={TaskNavigator} /> */}
    <Tab.Screen name="History" component={AttendanceHistoryScreen} />
    {/* <Tab.Screen name="Salary" component={SalarySlipsScreen} /> */}
    <Tab.Screen name="Profile" component={ProfileScreen} />


  </Tab.Navigator>
);

export default AppNavigator;
