import React from 'react';
import { useSetRecoilState } from 'recoil';
import { Categories, IToDos, toDoState } from '../atoms';

function ToDo({ text, category, id }: IToDos) {
	const setToDos = useSetRecoilState(toDoState);
	const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		const {
			currentTarget: { name },
		} = event;
		setToDos((prev) => {
			const targetIndex = prev.findIndex((todo) => todo.id === id);
			const newToDo = { text: text, id: id, category: name as any };
			return [
				...prev.slice(0, targetIndex),
				newToDo,
				...prev.slice(targetIndex + 1),
			];
		});
	};
	return (
		<li>
			<span>{text}</span>
			{category !== Categories.DONE && (
				<button onClick={onClick} name={Categories.DONE}>
					Done
				</button>
			)}
			{category !== Categories.DOING && (
				<button onClick={onClick} name={Categories.DOING}>
					Doing
				</button>
			)}
			{category !== Categories.TO_DO && (
				<button onClick={onClick} name={Categories.TO_DO}>
					To Do
				</button>
			)}
		</li>
	);
}

export default ToDo;
