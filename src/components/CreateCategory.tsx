import styled from 'styled-components';
import { HexColorPicker } from 'react-colorful';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSetRecoilState } from 'recoil';
import { categoryState, modalState } from '../atoms';

const SettingCategory = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	& > div {
		width: 300px;
		padding: 10px;
		border-radius: 10px;
		background: ${(props) => props.theme.bgColor};
		border: 1px solid ${(props) => props.theme.textColor};
		text-align: right;
	}
	div.react-colorful {
		width: 100%;
		margin: 5px auto;
	}
	div.react-colorful__saturation {
		border-radius: 0;
	}
	div.react-colorful__last-control {
		border-radius: 0;
	}
	button {
		width: 30px;
		height: 30px;
		font-size: 20px;
		background: transparent;
		border: none;
		outline: none;
		color: #fff;
	}
	form {
		margin-top: 10px;
		text-align: left;
		input {
			width: 100%;
			height: 30px;
			background: transparent;
			border: 1px solid #fff;
			padding: 0 5px;
			outline: none;
			color: #fff;
		}
	}
`;

interface IForm {
	cateName: string;
}

function CreateCategory() {
	const [color, setColor] = useState('#000000');
	const setModalState = useSetRecoilState(modalState);
	const setCategory = useSetRecoilState(categoryState);
	const { register, handleSubmit, setValue } = useForm<IForm>();
	const onValid = ({ cateName }: IForm) => {
		setCategory((prev) => [...prev, { id: Date.now(), name: cateName, color: color }]);
		setValue('cateName', '');
		setColor('#ffffff');
		setModalState({ status: false, type: '' });
	};

	return (
		<SettingCategory>
			<div className='wrapper'>
				<button
					className='closeBtn'
					onClick={() => {
						setModalState({ status: false, type: '' });
					}}
				>
					✕
				</button>
				<form onSubmit={handleSubmit(onValid)}>
					<input type='text' {...register('cateName', { required: true })} placeholder='write the category name' />
					<HexColorPicker color={color} onChange={setColor} />
					<input type='submit' value='add category' />
				</form>
			</div>
		</SettingCategory>
	);
}

export default CreateCategory;
