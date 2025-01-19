import { AppState } from '@reduxStore/index';
import { TypedUseSelectorHook, useSelector } from 'react-redux';

export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
