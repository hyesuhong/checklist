import React from 'react';
import { useSetRecoilState } from 'recoil';
import { IToDos, toDoState } from '../atoms';

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
			{category !== 'DONE' && (
				<button onClick={onClick} name='DONE'>
					Done
				</button>
			)}
			{category !== 'DOING' && (
				<button onClick={onClick} name='DOING'>
					Doing
				</button>
			)}
			{category !== 'TO_DO' && (
				<button onClick={onClick} name='TO_DO'>
					To Do
				</button>
			)}
		</li>
	);
}

export default ToDo;
