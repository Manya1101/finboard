import { createSlice } from "@reduxjs/toolkit";
import { nanoid } from "@reduxjs/toolkit";

const widgetSlice = createSlice({
  name: "widgets",
  initialState: {
    list: [],
  },
  reducers: {
    addWidget: {
      reducer: (state, action) => {
        state.list.push(action.payload);
      },
      prepare: (widget) => {
        return {
          payload: {
            ...widget,
            id: nanoid(), //  ALWAYS UNIQUE
          },
        };
      },
    },
    deleteWidget: (state, action) => {
      state.list = state.list.filter(
        (widget) => widget.id !== action.payload
      );
    },
    updateWidget: (state, action) => {
      const index = state.list.findIndex(w => w.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = {
          ...state.list[index],
          ...action.payload.changes,
        };
      }
    },

    clearWidgets: (state) => {
      state.list = [];
    },
    reorderWidgets: (state, action) => {
      state.list = action.payload;
    },
  },
});

export const { addWidget, deleteWidget ,updateWidget,reorderWidgets } = widgetSlice.actions;
export default widgetSlice.reducer;
