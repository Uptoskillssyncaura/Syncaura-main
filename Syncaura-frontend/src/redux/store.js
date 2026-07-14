import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./slices/themeSlice";
import meetingReducer from "./slices/meetingSlice";
import notificationReducer from "./slices/notificationSlice";
import documentReducer from "./slices/documentSlice";
import uiReducer from "./uiSlice";
import authReducer from "./slices/authSlice";
import languageReducer from "./slices/languageSlice";
import reportReducer from "./slices/reportSlice";
import noticeReducer from "./slices/noticeSlice";
import complaintReducer from "./slices/complaintSlice";
import taskReducer from "./slices/taskSlice";

export const store = configureStore({
  reducer: {
    
    theme: themeReducer,
    meeting: meetingReducer,
    notification: notificationReducer,
    documents: documentReducer,
    ui: uiReducer,
    language: languageReducer,
    reports: reportReducer,
    auth: authReducer,
    notice: noticeReducer,
    complaint: complaintReducer,
    tasks: taskReducer,
  },
});