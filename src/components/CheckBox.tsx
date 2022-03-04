import React from 'react';
import { useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import { Conditions, toDoState } from '../atoms';

const CheckWrap = styled.div`
	input[type='checkbox'] {
		display: none;
	}
	label {
		position: relative;
		padding-left: 20px;
	}
	label::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 0;
		transform: translateY(-50%);
		width: 16px;
		height: 16px;
		border: 1px solid ${(props) => props.theme.textColor};
		box-sizing: border-box;
	}
	label::after {
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
`;

interface IChkBox {
	id: string;
	text: string;
	category: number;
	checked: boolean;
	disabled: boolean;
}

function CheckBox({ id, text, category, checked, disabled }: IChkBox) {
	const setToDos = useSetRecoilState(toDoState);
	const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const {
			currentTarget: { value, checked },
		} = event;

		setToDos((prev) => {
			const targetIndex = prev.findIndex((todo) => todo.id === Number(value));
			const newToDo = { text: text, id: Number(id), category: category, condition: checked ? Conditions.DONE : Conditions.YET };
			return [...prev.slice(0, targetIndex), newToDo, ...prev.slice(targetIndex + 1)];
		});
	};

	return (
		<CheckWrap>
			<input type='checkbox' id={`CHK_${id}`} onChange={onChange} checked={checked} disabled={disabled} />
			<label htmlFor={`CHK_${id}`}>
				<span>{text}</span>
			</label>
		</CheckWrap>
	);
}

export default CheckBox;
