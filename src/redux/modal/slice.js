import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  transactions: {
    transactionDate: " ",
    type: " ",
    categoryID: " ",
    comment: " ",
    amount: 0,
  },
  isEditModalOpen: false,
  isAddModalOpen: false,
  isProfileModalOpen: false,
  isLogOutModalOpen: false,
  isRepeatModalOpen: false,
  repeatTransactionId: null,
  isEditId: " ",
};
const modalsSlice = createSlice({
  name: "modals",
  initialState,
  reducers: {
    operateTransactionData: (state, action) => {
      state.transactions = action.payload;
    },
    openEditModal: (state, action) => {
      state.isEditModalOpen = true;
      state.isEditId = action.payload;
    },
    closeEditModal: (state) => {
      state.isEditModalOpen = false;
      state.transactions = initialState.transactions;
    },
    openAddModal: (state) => {
      state.isAddModalOpen = true;
    },
    closeAddModal: (state) => {
      state.isAddModalOpen = false;
      state.transactions = initialState.transactions;
    },
    addEditId: (state, action) => {
      state.isEditId = action.payload;
    },
    openProfileModal: (state) => {
      state.isProfileModalOpen = true;
    },
    closeProfileModal: (state) => {
      state.isProfileModalOpen = false;
    },
    openLogOutModal: (state) => {
      state.isLogOutModalOpen = true;
    },
    closeLogOutModal: (state) => {
      state.isLogOutModalOpen = false;
    },
    openRepeatModal: (state, action) => {
      state.isRepeatModalOpen = true;
      state.repeatTransactionId = action.payload;
    },
    closeRepeatModal: (state) => {
      state.isRepeatModalOpen = false;
      state.repeatTransactionId = null;
    },
  },
});
export const {
  operateTransactionData,
  openEditModal,
  closeEditModal,
  openAddModal,
  closeAddModal,
  addEditId,
  openProfileModal,
  closeProfileModal,
  openLogOutModal,
  closeLogOutModal,
  openRepeatModal,
  closeRepeatModal,
} = modalsSlice.actions;
export const modalsReducer = modalsSlice.reducer;