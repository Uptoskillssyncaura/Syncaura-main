// import { createSlice } from "@reduxjs/toolkit";
// import {
//   fetchTasks,
//   createTask,
//   updateTask,
//   deleteTask,
//   updateTaskStatus,
//   addSubtask,
//   toggleSubtaskStatus,
// } from "../features/taskThunks";
 
// const initialState = {
//   tasks: [],
//   isLoading: false,
//   error: null,
// };
// const normalizeTask = (t) => {
//   if (!t || typeof t !== "object") return t;
//   const assigned = t.assignedTo || t.assigned_to || t.assigned_user_name || null;
//   return {
//     ...t,
//     assignedTo: assigned,
//     assigned_to: assigned,
//   };
// };

// const taskSlice = createSlice({
// // <<<<<<< fix/project-creation-and-task-assignment

// // const normalizeTask = (t) => {
// //   if (!t || typeof t !== "object") return t;
// //   const assigned = t.assignedTo || t.assigned_to || t.assigned_user_name || null;
// //   return {
// //     ...t,
// //     assignedTo: assigned,
// //     assigned_to: assigned,
// //   };
// // };

// // =======
 
// // >>>>>>> main
// const taskSlice = createSlice({
//   name: "tasks",
//   initialState,
//   reducers: {
//     clearTaskError(state) {
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Fetch all tasks
//       .addCase(fetchTasks.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(fetchTasks.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.tasks = Array.isArray(action.payload)
//           ? action.payload.map(normalizeTask)
//           : [];
//       })
//       .addCase(fetchTasks.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload;
//       })
 
//       // Create task
//       .addCase(createTask.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(createTask.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.tasks.unshift(normalizeTask(action.payload));
//       })
//       .addCase(createTask.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload;
//       })
 
//       // Update task
//       .addCase(updateTask.fulfilled, (state, action) => {
//         const idx = state.tasks.findIndex((t) => t.id === action.payload.id);
//         if (idx !== -1) state.tasks[idx] = normalizeTask(action.payload);
//       })
 
//       // Delete task
//       .addCase(deleteTask.fulfilled, (state, action) => {
//         state.tasks = state.tasks.filter((t) => t.id !== action.payload);
//       })
 
//       // Update task status
//       // Merge (not replace) — the status endpoint only returns the bare task
//       // row, so replacing wholesale would wipe out the subtasks array that's
//       // already loaded in the store.
//       .addCase(updateTaskStatus.fulfilled, (state, action) => {
//         const idx = state.tasks.findIndex((t) => t.id === action.payload.id);
// // <<<<<<< fix/project-creation-and-task-assignment
// //         if (idx !== -1) state.tasks[idx] = normalizeTask(action.payload);
// // =======
// //         if (idx !== -1) {
// //           state.tasks[idx] = { ...state.tasks[idx], ...action.payload };
// //         }
// // >>>>>>> main
//       .addCase(updateTask.fulfilled, (state, action) => {
//     const idx = state.tasks.findIndex((t) => t.id === action.payload.id);

//     if (idx !== -1) {
//         state.tasks[idx] = normalizeTask(action.payload);
//     }
// })
 
//       // Add subtask
//       .addCase(addSubtask.fulfilled, (state, action) => {
// // <<<<<<< fix/project-creation-and-task-assignment
// //         const idx = state.tasks.findIndex((t) => t.id === action.payload.id);
// //         if (idx !== -1) state.tasks[idx] = normalizeTask(action.payload);
// // =======
// //         const idx = state.tasks.findIndex(
// //           (t) => t.id === action.payload.task_id,
// //         );
// //         if (idx !== -1) {
// //           if (!state.tasks[idx].subtasks) state.tasks[idx].subtasks = [];
// //           state.tasks[idx].subtasks.push(action.payload);
// //         }
// //       })
 
// //       // Toggle subtask status
// //       .addCase(toggleSubtaskStatus.fulfilled, (state, action) => {
// //         const idx = state.tasks.findIndex(
// //           (t) => t.id === action.payload.task_id,
// //         );
// //         if (idx !== -1 && state.tasks[idx].subtasks) {
// //           const sIdx = state.tasks[idx].subtasks.findIndex(
// //             (s) => s.id === action.payload.id,
// //           );
// //           if (sIdx !== -1) state.tasks[idx].subtasks[sIdx] = action.payload;
// //         }
// // >>>>>>> main
//         // Add subtask
// .addCase(addSubtask.fulfilled, (state, action) => {
//     const idx = state.tasks.findIndex(
//         (t) => t.id === action.payload.task_id
//     );

//     if (idx !== -1) {
//         if (!state.tasks[idx].subtasks) {
//             state.tasks[idx].subtasks = [];
//         }

//         state.tasks[idx].subtasks.push(action.payload);
//     }
// })
//       });
//   },
// });
 
// export const { clearTaskError } = taskSlice.actions;
// export default taskSlice.reducer;


//---------------------------------Conflict solved code below-----------------------------

import { createSlice } from "@reduxjs/toolkit";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  addSubtask,
  toggleSubtaskStatus,
} from "../features/taskThunks";

const initialState = {
  tasks: [],
  isLoading: false,
  error: null,
};

const normalizeTask = (t) => {
  if (!t || typeof t !== "object") return t;

  const assigned =
    t.assignedTo ||
    t.assigned_to ||
    t.assigned_user_name ||
    null;

  return {
    ...t,
    assignedTo: assigned,
    assigned_to: assigned,
  };
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    clearTaskError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Fetch all tasks
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = Array.isArray(action.payload)
          ? action.payload.map(normalizeTask)
          : [];
      })

      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Create task
      .addCase(createTask.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(createTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks.unshift(normalizeTask(action.payload));
      })

      .addCase(createTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Update task
      .addCase(updateTask.fulfilled, (state, action) => {
        const idx = state.tasks.findIndex(
          (t) => t.id === action.payload.id
        );

        if (idx !== -1) {
          state.tasks[idx] = normalizeTask(action.payload);
        }
      })

      // Delete task
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(
          (t) => t.id !== action.payload
        );
      })

      // Update task status
      // Merge instead of replace so existing subtasks are preserved.
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const idx = state.tasks.findIndex(
          (t) => t.id === action.payload.id
        );

        if (idx !== -1) {
          state.tasks[idx] = {
            ...state.tasks[idx],
            ...action.payload,
          };
        }
      })

      // Add subtask
      .addCase(addSubtask.fulfilled, (state, action) => {
        const idx = state.tasks.findIndex(
          (t) => t.id === action.payload.task_id
        );

        if (idx !== -1) {
          if (!state.tasks[idx].subtasks) {
            state.tasks[idx].subtasks = [];
          }

          state.tasks[idx].subtasks.push(action.payload);
        }
      })

      // Toggle subtask status
      .addCase(toggleSubtaskStatus.fulfilled, (state, action) => {
        const idx = state.tasks.findIndex(
          (t) => t.id === action.payload.task_id
        );

        if (idx !== -1 && state.tasks[idx].subtasks) {
          const sIdx = state.tasks[idx].subtasks.findIndex(
            (s) => s.id === action.payload.id
          );

          if (sIdx !== -1) {
            state.tasks[idx].subtasks[sIdx] = action.payload;
          }
        }
      });
  },
});

export const { clearTaskError } = taskSlice.actions;

export default taskSlice.reducer;