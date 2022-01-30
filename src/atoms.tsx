import { atom } from 'recoil';

/* ts에게 한정된 데이터만 받는다고 알려주고 싶다면 category처럼! */
export interface IToDos {
	text: string;
	id: number;
	category: 'DONE' | 'DOING' | 'TO_DO';
}

export const toDoState = atom<IToDos[]>({
	key: 'toDo',
	default: [],
});
