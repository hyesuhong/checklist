import { useForm } from 'react-hook-form';
import { useRecoilValue, useSetRecoilState } from 'recoil';
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
		padding: 5px 10px 10px;
		border-radius: 10px;
		background: ${(props) => props.theme.bgColor};
		border: 1px solid ${(props) => props.theme.textColor};
		text-align: right;
	}

	& > div > button.closeBtn {
		width: 30px;
		height: 30px;
		font-size: 20px;
		background: transparent;
		border: none;
		outline: none;
		color: #fff;
		margin-bottom: 5px;
	}
`;

const AddToDoForm = styled.form`
	display: flex;
	flex-direction: column;

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
`;

const SelectBox = styled.div`
	position: relative;
	flex: 0 0 30px;

	select {
		appearance: none;
		-webkit-appearance: none;
		width: 100%;
		height: 100%;
		background: transparent;
		border: 1px solid ${(props) => props.theme.textColor};
		outline: none;
		color: ${(props) => props.theme.textColor};
		padding: 0 5px;
		border-radius: 0;
		box-sizing: border-box;
	}

	&::after {
		content: '';
		position: absolute;
		top: 50%;
		right: 8px;
		transform: translateY(-50%) rotateZ(-45deg);
		width: 6px;
		height: 6px;
		border-bottom: 1px solid ${(props) => props.theme.textColor};
		border-left: 1px solid ${(props) => props.theme.textColor};
	}
`;

interface ICreateToDoProps {
	selectedCategory: number;
}

/* react hook form -> 여러 인풋을 사용할 때 좋은 라이브러리. validation을 하기 편함 */
interface IForm {
	toDo: string;
	categoryId: number;
}

function CreateToDo({ selectedCategory }: ICreateToDoProps) {
	/* useState와 비슷한 형태로 사용할 수 있음 */
	const setToDos = useSetRecoilState(toDoState);
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
					<SelectBox>
						<select {...register('categoryId')} value={selectedCategory === 0 ? 1 : selectedCategory}>
							{Object.values(category).map((item) => (
								<option value={item.id} key={item.id}>
									{item.name}
								</option>
							))}
						</select>
					</SelectBox>
					<input {...register('toDo', { required: true })} placeholder='Write a to do' />
					<input type='submit' value='add to do' />
				</AddToDoForm>
			</div>
		</AddToDoModal>
	);
}
export default CreateToDo;
