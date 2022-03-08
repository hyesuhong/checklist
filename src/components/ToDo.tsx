import React from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import { categoryState, Conditions, IToDos, toDoState } from '../atoms';
import { IconRemove } from '../assets/image/icon';

const ToDoItem = styled.li<{ bdColor?: string }>`
	position: relative;
	padding: 10px 5px;
	border-radius: 5px;
	border-left: 3px solid ${(props) => props.bdColor};
	margin-bottom: 10px;

	input[type='checkbox'] {
		display: none;
	}

	input[type='checkbox'] + label {
		position: relative;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
	input[type='checkbox'] + label::before {
		content: '';
		width: 16px;
		height: 16px;
		border: 1px solid ${(props) => props.theme.textColor};
		box-sizing: border-box;
		margin-right: 4px;
	}
	input[type='checkbox'] + label::after {
		content: '';
		position: absolute;
		top: 50%;
		left: 8px;
		transform: translate(-50%, -70%) rotateZ(-45deg);
		width: 8px;
		height: 4px;
		border-bottom: 2px solid ${(props) => props.theme.bgColor};
		border-left: 2px solid ${(props) => props.theme.bgColor};
		opacity: 0;
	}
	input[type='checkbox']:checked + label::before {
		background: ${(props) => props.theme.textColor};
	}
	input[type='checkbox']:checked + label::after {
		opacity: 1;
	}
	input[type='checkbox']:disabled + label {
		opacity: 0.4;
	}

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
	const setToDos = useSetRecoilState(toDoState);
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
	};

	return (
		<ToDoItem bdColor={categorySet.find((cate) => cate.id === Number(category))?.color}>
			<input type='checkbox' id={`CHK_${id}`} value={id} onChange={onChange} checked={condition === Conditions.YET ? false : true} disabled={mode === 'Edit' ? true : false} />
			<label htmlFor={`CHK_${id}`}>{text}</label>
			{mode === 'Edit' ? (
				<button className='removeBtn' onClick={removeItem}>
					<IconRemove fill='#fff' />
				</button>
			) : null}
		</ToDoItem>
	);
}

export default ToDo;
