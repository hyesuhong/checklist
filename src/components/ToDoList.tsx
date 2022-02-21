import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { categoryState, toDoSelector, viewState } from '../atoms';
import CreateToDo from './CreateToDo';
import ToDo from './ToDo';
import { useForm } from 'react-hook-form';
import { HexColorPicker } from 'react-colorful';

const Container = styled.div`
	display: grid;
	grid-template-rows: min-content minmax(0, auto);
	grid-template-columns: 70px 2fr;
	height: 100vh;
`;

const Header = styled.header`
	position: relative;
	grid-column: span 2;
	height: 50px;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0 5%;
	border-bottom: 1px solid #fff;

	button.editBtn {
		position: absolute;
		top: 50%;
		right: 5%;
		transform: translateY(-50%);
		width: 40px;
		height: 26px;
		background: transparent;
		border: 1px solid ${(props) => props.theme.textColor};
		border-radius: 5px;
		outline: none;
		color: ${(props) => props.theme.textColor};
		padding: 0;
		transition: all 0.3s;
	}
	button.editBtn:hover {
		background: ${(props) => props.theme.textColor};
		color: ${(props) => props.theme.bgColor};
	}
`;

const Title = styled.h1`
	font-family: 'Raleway', sans-serif;
	font-style: italic;
	font-size: 1.7rem;
`;

const CategoryList = styled.ul`
	padding: 10px 5px;
	border-right: 1px solid ${(props) => props.theme.textColor};
	overflow-x: hidden;
	overflow-y: auto;
	::-webkit-scrollbar {
		display: none;
	}

	button {
		width: 100%;
		height: 60px;
		border-radius: 100%;
		background: #fdfdfd;
		border: none;
		outline: none;
		font-size: 1.4rem;
	}
`;

const CategoryItem = styled.li<{ bdColor?: string }>`
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 60px;
	background: #fdfdfd;
	color: #000;
	border-radius: 100%;
	margin-bottom: 10px;
	font-size: 14px;
	opacity: 0.5;
	cursor: pointer;

	&.active {
		opacity: 1;
	}

	::before {
		content: '';
		position: absolute;
		width: 100%;
		height: 100%;
		border-radius: 100%;
		border-left: 4px solid ${(props) => props.bdColor || '#fdfdfd'};
		border-bottom: 4px solid ${(props) => props.bdColor || '#fdfdfd'};
		box-sizing: border-box;
	}
`;

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
		border: 1px solid #fff;
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
			outline: none;
			color: #fff;
		}
	}
`;

const ToDoContent = styled.ul`
	flex: 1;
	overflow-x: hidden;
	overflow-y: auto;
	padding: 5px;
`;

interface IForm {
	cateName: string;
}

function ToDoList() {
	const [showModal, setShowModal] = useState(false);
	const [editMode, setEditMode] = useState(false);
	const [category, setCategory] = useRecoilState(categoryState);
	const [view, setView] = useRecoilState(viewState);
	const [color, setColor] = useState('#000000');

	const clickCategory = (event: React.MouseEvent<HTMLLIElement>) => {
		const classList = event.currentTarget.classList;
		// const dataKey = event.currentTarget.dataset.key ? Number(event.currentTarget.dataset.key) : 0;
		const dataKey = Number(event.currentTarget.dataset.key);
		if (classList.contains('active')) {
			return;
		} else {
			const categories = event.currentTarget.parentElement?.children;
			if (typeof categories != 'undefined') {
				Array.from(categories).forEach((element) => {
					if (element === event.currentTarget) {
						element.classList.add('active');
						setView(dataKey);
					} else element.classList.remove('active');
				});
			}
		}
	};

	const { register, handleSubmit, setValue } = useForm<IForm>();
	const onValid = ({ cateName }: IForm) => {
		setCategory((prev) => [...prev, { id: Date.now(), name: cateName, color: color }]);
		setValue('cateName', '');
		setColor('#ffffff');
		setShowModal(false);
	};
	useEffect(() => {
		localStorage.setItem('category', JSON.stringify(category));
	}, [category]);

	const toDos = useRecoilValue(toDoSelector);
	console.log(toDos);

	return (
		<Container>
			<Header>
				<Title>CheckCheck</Title>
				<button
					className='editBtn'
					onClick={() => {
						setEditMode((cur) => !cur);
					}}
				>
					{editMode ? 'Done' : 'Edit'}
				</button>
			</Header>

			<CategoryList>
				<CategoryItem key={0} data-key={0} className='active' onClick={clickCategory}>
					All
				</CategoryItem>
				{category.map((item) => (
					<CategoryItem key={item.id} data-key={item.id} onClick={clickCategory} bdColor={item.color}>
						{item.name}
					</CategoryItem>
				))}
				<button
					onClick={() => {
						setShowModal(true);
					}}
				>
					+
				</button>
			</CategoryList>
			<CreateToDo />

			{showModal ? (
				<SettingCategory>
					<div className='wrapper'>
						<button
							className='closeBtn'
							onClick={() => {
								setShowModal(false);
							}}
						>
							✕
						</button>
						<form onSubmit={handleSubmit(onValid)}>
							<input type='text' {...register('cateName', { required: true })} placeholder='write the category name' />
							{/* <input type='color' {...register('cateColor')} placeholder='select color' /> */}
							<HexColorPicker color={color} onChange={setColor} />
							<input type='submit' value='add category' />
						</form>
					</div>
				</SettingCategory>
			) : null}

			<ToDoContent>
				{toDos?.map((toDo) => (
					<ToDo key={toDo.id} {...toDo} mode={editMode ? 'Edit' : ''} />
				))}
			</ToDoContent>
		</Container>
	);
}

export default ToDoList;
