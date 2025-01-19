import { AppDispatch } from '@reduxStore/index';
import { useDispatch } from 'react-redux';

export const useAppDispatch = () => useDispatch<AppDispatch>();
