import { atom, selector } from 'recoil';

/* ts에게 한정된 데이터만 받는다고 알려주고 싶다면 category처럼! */
// type은 복사 붙여넣기를 안하게 해주는 변수? 같은 것. 다른 파일에서는 접근할 수 없음
// type categories = 'DONE' | 'DOING' | 'TO_DO';

// 다른 파일에서도 사용할 수 있는 것은 enum
// 기본으로 리턴하는 값은 순서(숫자). 다른 값을 원한다면 = '원하는 값'을 해줘야 함.
export enum Categories {
	'TO_DO' = 'TO_DO',
	'DOING' = 'DOING',
	'DONE' = 'DONE',
}

export interface IToDos {
	text: string;
	id: number;
	category: Categories;
}

export const categoryState = atom<Categories>({
	key: 'category',
	default: Categories.TO_DO,
});

export const toDoState = atom<IToDos[]>({
	key: 'toDo',
	default: [],
});

/* selector : atom의 output을 변형시키는 도구 */
export const toDoSelector = selector({
	key: 'toDoSelector',
	get: ({ get }) => {
		const toDos = get(toDoState);
		const category = get(categoryState);
		return toDos.filter((toDo) => toDo.category === category);
		// return [
		// 	toDos.filter((toDo) => toDo.category === 'TO_DO'),
		// 	toDos.filter((toDo) => toDo.category === 'DOING'),
		// 	toDos.filter((toDo) => toDo.category === 'DONE'),
		// ];
	},
});
