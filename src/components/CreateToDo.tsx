import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import { categoryState, Conditions, modalState, toDoState } from '../atoms';

const AddToDoModal = styled.div`
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

	& > div > button {
		width: 30px;
		height: 30px;
		font-size: 20px;
		background: transparent;
		border: none;
		outline: none;
		color: #fff;
	}
`;

const AddToDoForm = styled.form`
	display: flex;
	flex-direction: column;

	select {
		flex: 0 0 40px;
		background: ${(props) => props.theme.bgColor};
		border: none;
		outline: none;
		color: ${(props) => props.theme.textColor};
	}
	input {
		width: 100%;
		height: 30px;
		background: transparent;
		border: 1px solid ${(props) => props.theme.textColor};
		padding: 0 5px;
		outline: none;
		color: ${(props) => props.theme.textColor};
		margin: 5px auto;
	}
	button {
		flex: 0 0 40px;
		height: 100%;
		font-size: 30px;
		padding: 0;
		color: ${(props) => props.theme.textColor};
		background: transparent;
		border: none;
		outline: none;
	}
`;

/* react hook form -> 여러 인풋을 사용할 때 좋은 라이브러리. validation을 하기 편함 */
interface IForm {
	toDo: string;
	categoryId: number;
}

function CreateToDo() {
	/* useState와 비슷한 형태로 사용할 수 있음 */
	const [toDos, setToDos] = useRecoilState(toDoState);
	const category = useRecoilValue(categoryState);
	const setModalState = useSetRecoilState(modalState);
	/*
  - register을 사용하면 기존에 useState, onChange 등을 사용해서 관리하던 것들을 해결해줌
  - ...register('toDo') : es6. register함수가 리턴하는 객체를 인풋에 props로 전달
  - watch : form의 입력값들의 변화를 관찰할 수 있게 해주는 함수
  - handleSubmit : onSubmit 의 역할을 대신해주고, validation 체크도 하는 함수
  - formState.errors : error가 일어난 곳과 종류를 알 수 있고 그에 따른 메세지를 전달할 수 있음. 
  - setError : 특정한 에러를 발생시켜줌
  */
	const { register, handleSubmit, setValue } = useForm<IForm>();
	const onValid = async ({ toDo, categoryId }: IForm) => {
		await setToDos((prev) => [{ text: toDo, id: Date.now(), category: categoryId, condition: Conditions.YET }, ...prev]);
		setValue('toDo', '');
		setModalState({ status: false, type: '' });
	};

	useEffect(() => {
		localStorage.setItem('toDo', JSON.stringify(toDos));
	}, [toDos]);

	return (
		<AddToDoModal>
			<div>
				<button
					className='closeBtn'
					onClick={() => {
						setModalState({ status: false, type: '' });
					}}
				>
					✕
				</button>
				<AddToDoForm onSubmit={handleSubmit(onValid)}>
					<select {...register('categoryId')}>
						{Object.values(category).map((item) => (
							<option value={item.id} key={item.id}>
								{item.name}
							</option>
						))}
					</select>
					<input {...register('toDo', { required: true })} placeholder='Write a to do' />
					<input type='submit' value='add to do' />
				</AddToDoForm>
			</div>
		</AddToDoModal>
	);
}
export default CreateToDo;
