const mysql = require("mysql2");
const request = require('request');
const VkBot = require("node-vk-bot-api");
const Markup = require('node-vk-bot-api/lib/markup');
const easyvk = require('easyvk');
const readline = require('readline')
const token ='';//
let bot = new VkBot(token); let specIDs = [331658531,106541016,615435367,513757464,20904658]//me,admin
request.defaults({pool:{
    maxSockets: Infinity
}});
const connection = mysql.createConnection({
	charset:'utf8',
	host: "",
	user: "",
	database: "",
	password: ""
});
 // закрытие подключения
  connection.on('error', function(err) {
    if( (err.code === 'PROTOCOL_CONNECTION_LOST')||(err.code === 'ETIMEDOUT') ) { // Connection to the MySQL server is usually
	    connection.connect(function(err){
		    if (err) {
		      console.error("Ошибка: " + err.message);
		    }
		    else{
		    	let dateNow =new Date; //(new Date).timezoneOffset(-300);
				let nowDate = dateNow.getDate()+'-'+dateNow.getMonth()+'-'+dateNow.getFullYear()+'-'+dateNow.getHours()+'-'+dateNow.getMinutes()+'-'+dateNow.getSeconds();
		      	console.log("Подключение к серверу MySQL восстановлено "+nowDate);
		    }
		});                        
    }
    else {                                      
      throw err;                                 
    }
  });

function databaseRequest(request){
	return new Promise(function (resolve,reject) {
		connection.query(request,function(err,response){
			if(err) {
				console.log(173,request,err);
				reject(err);
			}
			else resolve(response);
		})
	})
}

class Order{
	#currentUser_Id;
	orderObject = {};

	constructor(user_Id){
		if (user_Id === '') {
            throw new Error('user_Id не может быть пустым')
        }        
		this.#currentUser_Id = user_Id;
	}
	set orderData(){
		let _this= this;
		return new Promise(function (resolve,reject) {
			databaseRequest("select * from userList where id="+_this.#currentUser_Id+" and orderFinished=0").then(function(response){
				
			})
		})
	}
	get orderData(){
		let _this= this;
		return new Promise(function (resolve,reject) {
			databaseRequest("select * from userList where id="+_this.#currentUser_Id+" and orderFinished=0").then(function(response){
				if(response[0] === undefined){
					reject('empty');
				}
				else resolve(response[0]);
			})
		})
		/*databaseRequest("select * from userList where id="+this.#currentUser_Id+" and orderFinished=0").then(function(response){
			if(response === '') return 'empty';
			else return response[0];
		}).catch(function(){
			return 0;
		})*/
	}
}


let mathSubjects = [
	'Аналитическая геометрия',
	'Высшая математика',
	'Дискретная математика',
	'Дифференциальные уравнения',
	'Интегралы',
	'Линейная алгебра',
	'Логика',
	'Математика',
	'Математический анализ',
	'Системный анализ',
	'ТФКП',
	'Теория вероятностей и математическая статистика',
	'Уравнения математической физики',
];
let technicalSubjects = [
	'Гидравлика',
	'Детали машин',
	'Инженерная графика',
	'Компьютерная графика',
	'Материаловедение',
	'Метрология',
	'Механика жидкостей и газов (МЖГ)',
	'Начертательная геометрия',
	'Основы конструирования приборов (ОКП)',
	'Подъемно-транспортные машины (ПТМ)',
	'Прикладная механика',
	'Резание',
	'Программирование',
	'Сопротивление материалов',
	'Теоретическая механика',
	'Теория конструкционных материалов (ТКМ)',
	'Теория машин и механизмов (ТММ)',
	'Термодинамика',
	'Физика',
	'Электротехника',
]
let economAndGumSubjects = [
	'Биология',
	'Бухгалтерский учет',
	'Безопасность жизнедеятельности (БЖД)',
	'Государственное и муниципальное управление',
	'История',
	'Криминалистика',
	'Литература',
	'Логистика',
	'Маркетинг',
	'Медицина',
	'Международные отношения',
	'Менеджмент',
	'Обществознание',
	'Организация производства',
	'Педагогика',
	'Право (абсолютно всё право)',
	'Психология',
	'Социология',
	'Управление персоналом',
	'Филология',
	'Философия',
	'Финансы',
	'Химия',
	'Экономика',
	'Экономика предприятия',
	'Юриспруденция',
]
let languages = [
	'Английский язык',
	'Латынь',
	'Немецкий язык',
	'Русский язык',
	'Французский язык',
];
let sport = [
	'Физкультура',
	'Военная кафедра'
]
let mathResponse = ''; let techResponse = ''; let ecoAndGumresponse = ''; let languagesResponse = ''; let sportResponse = '';
for(let i= 0; i < mathSubjects.length;i++) mathResponse += i+1+'. '+mathSubjects[i]+'\n';
for(let i= 0; i < technicalSubjects.length;i++) techResponse += mathSubjects.length+i+1+'. '+technicalSubjects[i]+'\n';
for(let i= 0; i < economAndGumSubjects.length;i++) ecoAndGumresponse += mathSubjects.length+technicalSubjects.length+i+1+'. '+economAndGumSubjects[i]+'\n';
for(let i= 0; i < languages.length;i++) languagesResponse += mathSubjects.length+technicalSubjects.length+economAndGumSubjects.length+i+1+'. '+languages[i]+'\n';
for(let i= 0; i < sport.length;i++) sportResponse += mathSubjects.length+technicalSubjects.length+economAndGumSubjects.length+languages.length+i+1+'. '+sport[i]+'\n';
let subjectList = `
Выберите предмет для исполнителя.

📈 Математические дисциплины:
${mathResponse}
🤖 Технические дисциплины:
${techResponse}
💰 Экономические и 🍔гуманитарные дисциплины:
${ecoAndGumresponse}
⛩ Языки:
${languagesResponse}
⛹‍♂ Спорт:
${sportResponse}
`;

const captchaHandler = ({captcha_sid, captcha_img, resolve:solve, vk}) => {
	bot.sendMessage(331658531, `Введите капчу для картинки ${captcha_img} `);
    Solve = solve;
}
//////////////////////Bot////////////////////////
function randomInteger(min, max) {
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}
function BotReply(ctx,response = ' ',buttons = null,medias = null){
	if(medias != null) ctx.reply(response, buttons, medias);
	else ctx.reply(response, null, buttons);
}

bot.command('начать', (ctx) => {
	BotReply(ctx,'Привет Наша команда готова помочь тебе с учебой. Тебе нужна помощь?', Markup.keyboard([
		[
			Markup.button('Заказать', 'positive'),
			Markup.button('В другой раз', 'negative')
		],
		[
			Markup.button('Отключить бота', 'positive')
		],
		[
			Markup.button('Мои заказы', 'positive')
		]
	]).oneTime());
});
bot.command('Заказать', (ctx) => {
	let user_Id = ctx.message.user_id;	
	let order = new Order(user_Id);

	order.orderData.then(function(response){
		console.log(211,response);
	}).catch(function(empty){
		console.log(empty === 'empty');
	})

	BotReply(ctx,'Получил', Markup.keyboard([
		[
			Markup.button('Заказать', 'positive'),
		],
	]));	
});
bot.event('message_new', (ctx) => {
	let user_Id = ctx.message.user_id;	
	
});

bot.startPolling(console.log('startPolling'));