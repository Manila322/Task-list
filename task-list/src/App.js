import React, { useEffect, useState } from 'react';
import styles from './App.module.css';

export const App = () => {
	const [taskList, setTaskList] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [refreshTaskFlag, setRefreshTaskFlag] = useState(false);
	const [task, setTask] = useState('');
	const [searchPhrase, setSearchPhrase] = useState('');
	const [sortAlphabetically, setSortAlphabetically] = useState(false);

	const refreshTask = () => setRefreshTaskFlag(!refreshTaskFlag);

	const handleInputChange = (e) => {
		setTask(e.target.value);
	};

	const handleSearchInputChange = (e) => {
		setSearchPhrase(e.target.value);
	};

	useEffect(() => {
		setIsLoading(true);

		fetch('http://localhost:3005/task')
			.then((loadedData) => loadedData.json())
			.then((loadedTask) => {
				setTaskList(loadedTask);
			})
			.finally(() => setIsLoading(false));
	}, [refreshTaskFlag]);

	const requestAddTask = () => {
		fetch('http://localhost:3005/task', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json;charset=utf-8' },
			body: JSON.stringify({
				title: task,
			}),
		})
			.then((rawResponse) => rawResponse.json())
			.then((response) => {
				console.log('Задача добавлена, ответ сервера:', response);
				refreshTask();
			});
	};

	const requestChangeTask = (id) => {
		fetch(`http://localhost:3005/task/${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json;charset=utf-8' },
			body: JSON.stringify({
				title: task,
			}),
		})
			.then((rawResponse) => rawResponse.json())
			.then((response) => {
				console.log('Задача изменена, ответ сервера:', response);
				refreshTask();
			});
	};

	const requestDeleteTask = (id) => {
		fetch(`http://localhost:3005/task/${id}`, {
			method: 'DELETE',
		})
			.then((rawResponse) => rawResponse.json())
			.then((response) => {
				console.log('Задача удалена, ответ сервера:', response);
				refreshTask();
			});
	};

	const handleSortTasks = () => {
		if (sortAlphabetically) {
			setTaskList([...taskList.sort((a, b) => a.title.localeCompare(b.title))]);
		} else {
			refreshTask();
		}
		setSortAlphabetically(!sortAlphabetically);
	};

	const filteredTasks = taskList.filter((task) =>
		task.title.toLowerCase().includes(searchPhrase.toLowerCase()),
	);

	return (
		<div className={styles.app}>
			<form>
				<input
					name="task"
					type="text"
					placeholder="Введите новую задачу"
					value={task}
					onChange={handleInputChange}
				/>
			</form>
			<button onClick={requestAddTask}>Добавить новую задачу</button>
			<button onClick={handleSortTasks}>
				{sortAlphabetically ? 'Сбросить сортировку' : 'Сортировать по алфавиту'}
			</button>
			<input
				type="text"
				placeholder="Поиск по задачам"
				value={searchPhrase}
				onChange={handleSearchInputChange}
			/>
			<ul className="taskList">
				{isLoading ? (
					<div className={styles.loader}></div>
				) : (
					filteredTasks.map(({ id, title }) => (
						<li key={id}>
							{title}{' '}
							<button onClick={() => requestChangeTask(id)}>
								Изменить
							</button>{' '}
							<button onClick={() => requestDeleteTask(id)}>Удалить</button>
						</li>
					))
				)}
			</ul>
		</div>
	);
};
