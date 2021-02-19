const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () =>
	console.log(`Example app listening at http://localhost:${port}`)
);

const Discord = require('discord.js');
const bot = new Discord.Client();

bot.login(process.env.DISCORD_TOKEN);
bot.on('ready', () => {
	console.log('ready');
	bot.user.setActivity('好累啊');
});
to_do = {};
timer = {};
function get_remaining_tasks(task_list) {
	remaining = [];
	for (var i = 0; i < task_list.length; i++) {
		if (task_complete(task_list[i])) {
			remaining.push(task_list[i]);
		}
	}
	return remaining;
}

function embed(title, text) {
	const exampleEmbed = new Discord.MessageEmbed()
		.setColor('#0eeba5')
		.setTitle(title)
		.setDescription(text);
	return exampleEmbed;
}
function task_complete(task) {
	if (task.startsWith('~~') && task.endsWith('~~')) {
		return false;
	} else {
		return true;
	}
}
function study_session_complete(message, time) {
	if (time[message.author] !== 'stop') {
		message.channel.send(
			embed(
				'Study completed',
				'<@' + message.author + ">, it's time to take a short break"
			)
		);
		time[message.author] = undefined;
	}
}
encouraging_messages = [
	'快滚去学习！',
	'刚学多长时间啊就休息，想什么呢',
	'我对你很失望',
	'如果不学习就会一直单身的！',
	'快去做作业去',
	'休息? 不存在的 快滚去学习',
	'哈哈哈哈哈哈 what a loser',
	'还想休息？？知识都学会了吗'
];

bot.on('message', message => {
	// if(message.author.id === '649755604793163777'){
	// x = Math.floor(Math.random() * trolling_messages.length);
	// message.channel.send(trolling_messages[x])
	// }
	if (
		message.content.includes('rest') ||
		message.content.includes('break') ||
		message.content.includes('累')
	) {
		x = Math.floor(Math.random() * encouraging_messages.length);
		message.channel.send(encouraging_messages[x]);
	}

	if (message.content.startsWith('&add')) {
		if (to_do[message.author] === undefined) {
			to_do[message.author] = [];
		}
		to_do[message.author].push(message.content.slice(5));
		message.channel.send(
			embed(
				'Task added',
				'<@' +
					message.author +
					'>\n' +
					'Your task has been added to your to-do list!'
			)
		);
		task_message = '';
		for (var i = 0; i < to_do[message.author].length; i++) {
			task_message =
				task_message +
				(i + 1).toString() +
				'. ' +
				to_do[message.author][i] +
				'\n';
		}
		message.channel.send(
			embed(
				'Tasks',
				task_message +
					'\nYou have ' +
					get_remaining_tasks(to_do[message.author]).length +
					' task(s) remaining'
			)
		);
	}

	if (message.content === '&get') {
		if (
			to_do[message.author] === undefined ||
			to_do[message.author].length === 0
		) {
			message.channel.send(
				embed(
					'Tasks',
					'<@' +
						message.author +
						'>\n' +
						'You do not have any tasks to do.\nTry to add a new task by **&add task**'
				)
			);
		} else {
			task_message = '';
			for (var i = 0; i < to_do[message.author].length; i++) {
				task_message =
					task_message +
					(i + 1).toString() +
					'. ' +
					to_do[message.author][i] +
					'\n';
			}
			message.channel.send(
				embed(
					'Tasks',
					'<@' +
						message.author +
						'>\n' +
						task_message +
						'\nYou have ' +
						get_remaining_tasks(to_do[message.author]).length +
						' task(s) remaining'
				)
			);
		}
	}

	if (message.content.startsWith('&wc')) {
		task_num = parseInt(message.content.slice(4));
		if (isNaN(task_num)) {
			message.channel.send(
				embed(
					'Error',
					'<@' +
						message.author +
						'>\n' +
						"Sorry, cannot find the task you're looking for."
				)
			);
		} else if (to_do[message.author] === undefined) {
			message.channel.send(
				embed(
					'Error',
					'<@' +
						message.author +
						'>\n' +
						"Sorry, cannot find the task you're looking for."
				)
			);
		} else if (task_num <= to_do[message.author].length && task_num > 0) {
			if (!task_complete(to_do[message.author][task_num - 1])) {
				message.channel.send(
					embed(
						'Hmmm',
						'<@' + message.author + '>\n' + 'Task is already completed!\n'
					)
				);
			} else {
				message.channel.send(
					embed(
						'Task completed',
						'<@' +
							message.author +
							'>\n' +
							'Congrats! ' +
							to_do[message.author][task_num - 1] +
							' finished!\n'
					)
				);
				to_do[message.author][task_num - 1] =
					'~~' + to_do[message.author][task_num - 1] + '~~';
				task_message = '';
				for (var i = 0; i < to_do[message.author].length; i++) {
					task_message =
						task_message +
						(i + 1).toString() +
						'. ' +
						to_do[message.author][i] +
						'\n';
				}
				message.channel.send(
					embed(
						'Tasks',
						'<@' +
							message.author +
							'>\n' +
							task_message +
							'\nYou have ' +
							get_remaining_tasks(to_do[message.author]).length +
							' task(s) remaining'
					)
				);
			}
		} else {
			message.channel.send(
				embed(
					'Error',
					'<@' +
						message.author +
						'>\n' +
						"Sorry, cannot find the task you're looking for.\n"
				)
			);
		}
	}
	if (message.content === '&clear') {
		if (to_do[message.author] === undefined || to_do[message.author] === []) {
			message.channel.send(
				embed(
					'Hmmm',
					'<@' + message.author + '>\n' + 'You do not have any tasks to clear.'
				)
			);
		} else {
			to_do[message.author] = [];
			message.channel.send(
				embed(
					'Cleared',
					'<@' + message.author + '>\n' + 'Your to-do list has been cleared.'
				)
			);
		}
	}
	if (message.content.startsWith('&study')) {
		minute = parseInt(message.content.slice(7));
		if (isNaN(minute)) {
			message.channel.send(
				embed(
					'Error',
					'<@' + message.author + '>\n' + 'Sorry, please enter an integer.'
				)
			);
		} else if (
			timer[message.author] !== undefined &&
			timer[message.author] !== 'stop'
		) {
			message.channel.send(
				embed(
					'Error',
					'<@' +
						message.author +
						'>\n' +
						'Sorry, You currently have a timer. Use command **&timer** to view your timer.'
				)
			);
		} else {
			console.log(message.author.id);
			minute = Math.abs(minute);
			timer[message.author] = [Date.now(), minute];
			miliseconds = minute * 60000;

			message.channel.send(
				embed(
					'Timer Created',
					'<@' +
						message.author +
						'>\n' +
						'Timer set. ' +
						minute.toString() +
						' minute(s).'
				)
			);
			setTimeout(study_session_complete, miliseconds, message, timer);
		}
	}
	if (message.content === '&timer') {
		if (
			timer[message.author] === undefined ||
			timer[message.author] === 'stop'
		) {
			message.channel.send(
				embed(
					'Error',
					'<@' +
						message.author +
						'>\n' +
						'Sorry, You currently do not have a timer. Use command **&study <minute>** to set up your timer.'
				)
			);
		} else {
			date_now = Date.now();
			time_interval = Math.round((date_now - timer[message.author][0]) / 60000);
			time_remaining = timer[message.author][1] - time_interval;
			message.channel.send(
				embed(
					'Timer',
					'<@' +
						message.author +
						'>\n' +
						'You set a timer of ' +
						timer[message.author][1] +
						' minutes\nYou have studied for ' +
						time_interval +
						' minutes\n' +
						time_remaining +
						' minutes remaining'
				)
			);
		}
	}
	if (message.content === '&stop') {
		if (timer[message.author] !== undefined) {
			timer[message.author] = 'stop';
			message.channel.send(
				embed(
					'Stop timer',
					'<@' + message.author + '>\n' + 'You have stopped the timer.'
				)
			);
		} else {
			message.channel.send(
				embed(
					'Error',
					'<@' +
						message.author +
						'>\n' +
						"You haven't set a timer yet.\n Please use command **&study <minute> to set up a timer.** "
				)
			);
		}
	}
});

add;
