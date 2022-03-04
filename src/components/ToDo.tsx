import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { categoryState, Conditions, IToDos, toDoState } from '../atoms';
import { IconRemove } from '../assets/image/icon';
import CheckBox from './CheckBox';

const ToDoItem = styled.li<{ bdColor?: string }>`
	position: relative;
	padding: 10px 5px;
	border-radius: 5px;
	border-left: 3px solid ${(props) => props.bdColor};
	margin-bottom: 10px;
	button.removeBtn {
		position: absolute;
		top: 50%;
		right: 0;
		transform: translateY(-50%);
		width: 26px;
		height: 26px;
		padding: 0;
		background: transparent;
		border: none;
		outline: none;
	}
`;

interface IToDoItem extends IToDos {
	mode: string;
}

function ToDo({ text, category, id, condition, mode }: IToDoItem) {
	const categorySet = useRecoilValue(categoryState);
	const [toDos, setToDos] = useRecoilState(toDoState);
	const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const {
			currentTarget: { value, checked },
		} = event;

		setToDos((prev) => {
			const targetIndex = prev.findIndex((todo) => todo.id === Number(value));
			const newToDo = { text: text, id: id, category: category, condition: checked ? Conditions.DONE : Conditions.YET };
			return [...prev.slice(0, targetIndex), newToDo, ...prev.slice(targetIndex + 1)];
		});
	};

	const removeItem = (event: React.MouseEvent<HTMLButtonElement>) => {
		setToDos((prev) => {
			const targetIndex = prev.findIndex((todo) => todo.id === id);
			return [...prev.slice(0, targetIndex), ...prev.slice(targetIndex + 1)];
		});
		localStorage.setItem('toDo', JSON.stringify(toDos));
	};

	return (
		<ToDoItem bdColor={categorySet.find((cate) => cate.id === Number(category))?.color}>
			{/* <CheckBox id={id.toString()} text={text} category={category} checked={condition === Conditions.YET ? false : true} disabled={mode === 'Edit' ? true : false} /> */}
			<input type='checkbox' id={`CHK_${id}`} value={id} onChange={onChange} checked={condition === Conditions.YET ? false : true} disabled={mode === 'Edit' ? true : false} />
			<label htmlFor={`CHK_${id}`}></label>
			<span>{text}</span>
			{mode === 'Edit' ? (
				<button className='removeBtn' onClick={removeItem}>
					<IconRemove fill='#fff' />
				</button>
			) : null}
		</ToDoItem>
	);
}

export default ToDo;
