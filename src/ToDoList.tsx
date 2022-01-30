import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

/* react hook form -> 여러 인풋을 사용할 때 좋은 라이브러리. validation을 하기 편함 */

// function ToDoList() {
// 	const [toDo, setToDo] = useState('');
// 	const onChange = (event: React.FormEvent<HTMLInputElement>) => {
// 		const {
// 			currentTarget: { value },
// 		} = event;
// 		setToDo(value);
// 	};
// 	const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
// 		event.preventDefault();
// 		console.log(toDo);
// 	};
// 	return (
// 		<div>
// 			<form onSubmit={onSubmit}>
// 				<input placeholder='Write a to do' value={toDo} onChange={onChange} />
// 				<button>Add</button>
// 			</form>
// 		</div>
// 	);
// }

interface IForm {
	Email: string;
	FirstName: string;
	LastName: string;
	PW: string;
	PWchk: string;
	extraError?: string;
}

function ToDoList() {
	/*
  - register을 사용하면 기존에 useState, onChange 등을 사용해서 관리하던 것들을 해결해줌
  - ...register('toDo') : es6. register함수가 리턴하는 객체를 인풋에 props로 전달
  - watch : form의 입력값들의 변화를 관찰할 수 있게 해주는 함수
  - handleSubmit : onSubmit 의 역할을 대신해주고, validation 체크도 하는 함수
  - formState.errors : error가 일어난 곳과 종류를 알 수 있고 그에 따른 메세지를 전달할 수 있음. 
  - setError : 특정한 에러를 발생시켜줌
  */
	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
	} = useForm<IForm>({
		defaultValues: {
			Email: '@naver.com',
		},
	});
	const onValid = (data: IForm) => {
		if (data.PW !== data.PWchk) {
			setError(
				'PWchk',
				{ message: 'password is not same' },
				{ shouldFocus: true }
			);
		}
		setError('extraError', { message: 'Server offline' });
		console.log(data);
	};

	console.log(errors);

	return (
		<div>
			<form
				style={{ display: 'flex', flexDirection: 'column' }}
				onSubmit={handleSubmit(onValid)}
			>
				<input
					{...register('Email', {
						required: { value: true, message: 'email is required' },
						pattern: {
							value: /^[A-Za-z0-9._%+-]+@naver.com$/,
							message: 'only naver.com can allowed',
						},
					})}
					placeholder='Email'
				/>
				<span>{errors?.Email?.message}</span>
				<input
					{...register('FirstName', {
						required: 'name is required',
						validate: {
							noNico: (value) =>
								value.includes('nico') ? 'nico cannot join' : true,
							noNick: (value) =>
								value.includes('nick') ? 'nick cannot join' : true,
						},
					})}
					placeholder='FirstName'
				/>
				<input
					{...(register('LastName'), { minLength: 10 })}
					placeholder='LastName'
				/>
				<input
					{...register('PW', {
						required: 'Password is required',
						minLength: { value: 5, message: 'too short' },
					})}
					placeholder='PW'
				/>
				<input
					{...register('PWchk', { required: 'Password is required' })}
					placeholder='PWchk'
				/>
				<button>Add</button>
			</form>
		</div>
	);
}

export default ToDoList;
