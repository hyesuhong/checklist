import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { categoryState, toDoSelector, toDoState, viewState } from '../atoms';
import CreateToDo from './CreateToDo';
import ToDo from './ToDo';
import { useForm } from 'react-hook-form';

const Container = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	max-width: 480px;
	height: calc(100vh - 20px);
	margin: 10px auto;
	border-radius: 10px;
	border: 1px solid #fff;
	padding-bottom: 40px;
`;

const Header = styled.header`
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	flex: 0 0 50px;
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
		border: 1px solid #fff;
		border-radius: 5px;
		outline: none;
		color: #fff;
		padding: 0;
	}
`;

const Title = styled.h1`
	font-family: 'Raleway', sans-serif;
	font-style: italic;
	font-size: 1.7rem;
`;

const CategoryList = styled.ul`
	flex: 0 0 80px;
	display: flex;
	justify-content: flex-start;
	align-items: center;
	padding: 0 5%;
	margin: 10px 0;
	overflow-x: auto;
	overflow-y: hidden;
	::-webkit-scrollbar {
		display: none;
	}
`;

const CategoryItem = styled.li<{ bdColor?: string }>`
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	flex: 0 0 80px;
	height: 80px;
	background: #fdfdfd;
	color: #000;
	border-radius: 100%;
	margin-right: 20px;
	font-size: 14px;
	opacity: 0.5;

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
	div {
		width: 200px;
		padding: 10px;
		border-radius: 10px;
		background: ${(props) => props.theme.bgColor};
		border: 1px solid #fff;
		text-align: right;
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
			margin-bottom: 5px;
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
	cateColor?: string;
}

function ToDoList() {
	const [showModal, setShowModal] = useState(false);
	const [editMode, setEditMode] = useState(false);
	const [category, setCategory] = useRecoilState(categoryState);
	const [view, setView] = useRecoilState(viewState);
	const lsCategory = localStorage.getItem('category');
	if (lsCategory === null) {
		localStorage.setItem('category', JSON.stringify(category));
	} else {
		const stringCategory = JSON.stringify(category);
		if (lsCategory != stringCategory) {
			if (lsCategory.length > stringCategory.length) {
				setCategory(JSON.parse(localStorage.getItem('category') as string));
			} else {
				localStorage.setItem('category', JSON.stringify(category));
			}
		}
	}

	const clickCategory = (event: React.MouseEvent<HTMLLIElement>) => {
		const classList = event.currentTarget.classList;
		const dataKey = event.currentTarget.dataset.key ? event.currentTarget.dataset.key : '0';
		if (classList.contains('active')) {
			return;
		} else {
			const categories = event.currentTarget.parentElement?.children;
			if (typeof categories != 'undefined') {
				Array.from(categories).forEach((element) => {
					if (element == event.currentTarget) {
						element.classList.add('active');
						setView(dataKey);
					} else element.classList.remove('active');
				});
			}
		}
	};

	const { register, handleSubmit, setValue } = useForm<IForm>();
	const onValid = ({ cateName, cateColor }: IForm) => {
		setCategory((prev) => [...prev, { id: Date.now(), name: cateName, color: cateColor }]);
		// localStorage.setItem('category', JSON.stringify(category));
		setValue('cateName', '');
		setValue('cateColor', '');
		setShowModal(false);
	};

	const [toDoArr, setToDoArr] = useRecoilState(toDoState);
	const lsToDo = localStorage.getItem('toDo');
	useEffect(() => {
		if (lsToDo === null) {
			localStorage.setItem('toDo', JSON.stringify(toDoArr));
		} else {
			const stringToDoArr = JSON.stringify(toDoArr);
			if (lsToDo != stringToDoArr) {
				setToDoArr(JSON.parse(localStorage.getItem('toDo') as string));
			}
		}
	}, []);

	const toDos = useRecoilValue(toDoSelector);

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
							<input type='color' {...register('cateColor')} placeholder='select color' />
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
