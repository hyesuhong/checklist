import { useForm } from 'react-hook-form';
import { useSetRecoilState } from 'recoil';
import { toDoState } from '../atoms';

/* react hook form -> 여러 인풋을 사용할 때 좋은 라이브러리. validation을 하기 편함 */
interface IForm {
	toDo: string;
}

function CreateToDo() {
	/* useState와 비슷한 형태로 사용할 수 있음 */
	const modifier = useSetRecoilState(toDoState);
	/*
  - register을 사용하면 기존에 useState, onChange 등을 사용해서 관리하던 것들을 해결해줌
  - ...register('toDo') : es6. register함수가 리턴하는 객체를 인풋에 props로 전달
  - watch : form의 입력값들의 변화를 관찰할 수 있게 해주는 함수
  - handleSubmit : onSubmit 의 역할을 대신해주고, validation 체크도 하는 함수
  - formState.errors : error가 일어난 곳과 종류를 알 수 있고 그에 따른 메세지를 전달할 수 있음. 
  - setError : 특정한 에러를 발생시켜줌
  */
	const { register, handleSubmit, setValue } = useForm<IForm>();
	const onValid = ({ toDo }: IForm) => {
		modifier((prev) => [
			{ text: toDo, id: Date.now(), category: 'TO_DO' },
			...prev,
		]);
		setValue('toDo', '');
	};

	return (
		<form onSubmit={handleSubmit(onValid)}>
			<input
				{...register('toDo', { required: 'Please write your to do' })}
				placeholder='Write a to do'
			/>
			<button>Add</button>
		</form>
	);
}
export default CreateToDo;