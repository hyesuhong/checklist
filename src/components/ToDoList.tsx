import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Categories, categoryState, toDoSelector } from '../atoms';
import CreateToDo from './CreateToDo';
import ToDo from './ToDo';

function ToDoList() {
	// const [toDo, doing, done] = useRecoilValue(toDoSelector);
	const toDos = useRecoilValue(toDoSelector);
	const [category, setCategory] = useRecoilState(categoryState);
	const onInput = (event: React.FormEvent<HTMLSelectElement>) => {
		setCategory(event.currentTarget.value as any);
	};

	return (
		<div>
			<h1>To Do</h1>
			<hr />
			<form>
				<select value={category} onInput={onInput}>
					{Object.values(Categories).map((cate) => (
						<option value={cate} key={cate}>
							{cate.toLowerCase()}
						</option>
					))}
				</select>
			</form>
			<CreateToDo />
			<h2>{Categories[category]}</h2>
			<ul>
				{toDos?.map((toDo) => (
					<ToDo key={toDo.id} {...toDo} />
				))}
			</ul>
		</div>
	);
}

export default ToDoList;
