import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { categoryState, toDoSelector, viewState, modalState } from '../atoms';
import CreateToDo from './CreateToDo';
import ToDo from './ToDo';
import CreateCategory from './CreateCategory';

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

	div.btn_area {
		position: absolute;
		top: 50%;
		right: 5%;
		transform: translateY(-50%);
		display: flex;
	}

	div.btn_area > button {
		width: 40px;
		height: 26px;
		background: transparent;
		border: 1px solid ${(props) => props.theme.textColor};
		border-radius: 5px;
		outline: none;
		color: ${(props) => props.theme.textColor};
		padding: 0;
		margin-left: 10px;
		transition: all 0.3s;
	}
	div.btn_area > button:first-child {
		margin-left: 0;
	}
	div.btn_area > button:hover {
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

const ToDoContent = styled.ul`
	flex: 1;
	overflow-x: hidden;
	overflow-y: auto;
	padding: 5px;
`;

function ToDoList() {
	const [editMode, setEditMode] = useState(false);
	const category = useRecoilValue(categoryState);
	const [modal, setModalState] = useRecoilState(modalState);
	const [view, setView] = useRecoilState(viewState);

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

	useEffect(() => {
		localStorage.setItem('category', JSON.stringify(category));
	}, [category]);

	const toDos = useRecoilValue(toDoSelector);

	return (
		<Container>
			<Header>
				<Title>CheckCheck</Title>
				<div className='btn_area'>
					<button
						className='add_btn'
						onClick={() => {
							setModalState({ status: true, type: 'todo' });
						}}
					>
						Add
					</button>
					<button
						className='editBtn'
						onClick={() => {
							setEditMode((cur) => !cur);
						}}
					>
						{editMode ? 'Done' : 'Edit'}
					</button>
				</div>
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
						setModalState({ status: true, type: 'category' });
					}}
				>
					+
				</button>
			</CategoryList>

			{modal.status && modal.type === 'todo' ? <CreateToDo /> : null}
			{modal.status && modal.type === 'category' ? <CreateCategory /> : null}

			<ToDoContent>
				{toDos?.map((toDo) => (
					<ToDo key={toDo.id} {...toDo} mode={editMode ? 'Edit' : ''} />
				))}
			</ToDoContent>
		</Container>
	);
}

export default ToDoList;
