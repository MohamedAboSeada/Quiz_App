// fetch the questions
let Questions = null;

async function fetchData() {
	try {
		const response = await fetch('js/q.json');
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('There was a problem with the fetch operation:', error);
		return null;
	}
}

async function loadQuestions() {
	Questions = await fetchData();
}

// initialize all variables
const timer_span = document.getElementById('timer');
const question_cont = document.getElementById('question');
const try_ = document.getElementById('try_again');
const start_quiz = document.getElementById('start_quiz');
const steps = document.querySelector('.steps').children;
const loader = document.querySelector('.loader');

// for summary
const correct_answers = document.getElementById('correct_answers');
const wrong_answers = document.getElementById('wrong_answers');
const not_answered = document.getElementById('not_answered');

// initialize for wrong and correct answers
let wrong = [];
let correct = [];
let notSolved = [];
let timer = null;
let timeRemaining = 21; // in seconds
let counter = 0;

// my app screens
const start_screen = document.querySelector('.start_screen');
const mid = document.querySelector('.mid');
const last = document.querySelector('.last_screen');

// first shuffle the Questions (helper function)
function shuffle(arr) {
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]]; // Swap elements
	}
}

// set language direction
function setTextDirection(text) {
	const rtlLangRegex =
		/[\u0600-\u06FF\u0750-\u077F\u0590-\u05FF\uFE70-\uFEFF\uFB50-\uFDFF\u2000-\u206F\u2070-\u209F\u20A0-\u20CF\u2100-\u214F\u2190-\u21FF\u2200-\u22FF\uFB1D-\uFB4F]+/;

	if (rtlLangRegex.test(text)) {
		document.querySelector('#question h1').style.direction = 'rtl';
	} else {
		document.querySelector('#question h1').style.direction = 'ltr';
	}
}

// play sounds function
function playClickSound() {
	let d = new Audio('audio/general-click.wav');
	d.play();
}

// move step function
function moveStep() {
	[...steps].forEach((step) => {
		step.classList.remove('active');
	});
	steps[counter].classList.add('active');
}

// Call loadQuestions synchronously
loadQuestions().then(() => {
	console.log('Questions loaded:', Questions);
	shuffle(Questions);
	console.log(Questions);
	loader.innerHTML = "تم تحميل البيانات بنجاح";
	setTimeout(_=>{
		loader.style.top = '-100%';
	},1000)
	// make a question structure
	function MakeQuestion(qNum) {
		// shuffle the Questions
		shuffle(Questions[qNum].Options);

		// make question template
		let question = `
        <h1 id="title">${Questions[qNum].Question_Title}</h1>
        <div class="one">
            <button id="op1">${Questions[qNum].Options[0]}</button>
            <button id="op2">${Questions[qNum].Options[1]}</button>
        </div>
        <div class="two">
            <button id="op3">${Questions[qNum].Options[2]}</button>
            <button id="op4">${Questions[qNum].Options[3]}</button>
        </div>
    `;
		question_cont.innerHTML = question;

		// change the direction of text depend on question title
		setTextDirection(Questions[qNum].Question_Title);
	}

	// timer
	let timer_int = null;
	function startTimer(duration, display) {
		var timer = duration,
			seconds;
		timer_int = setInterval(function () {
			seconds = parseInt(timer % 60, 10);

			// Display the remaining seconds
			display.textContent = seconds;

			// Check if the timer has reached 0
			if (--timer < 0) {
				if (counter < 9) {
					notSolved.push(Questions[counter]);
					counter++;
					MakeQuestion(counter);
					moveStep();
					timer = duration;
				} else {
					clearInterval(timer_int);
					correct_answers.textContent = correct.length;
					wrong_answers.textContent = wrong.length;
					not_answered.textContent = notSolved.length + 1;

					mid.classList.add('hide');
					last.classList.remove('hide');
				}
			}
		}, 1000);
	}

	function clearAndRestartTimer() {
		clearInterval(timer_int); // Clear the interval
		timer_span.textContent = '10'; // Update display
		setTimeout((_) => {
			startTimer(10, timer_span); // Restart the timer after 1 second
		}, 100);
	}

	// make start quiz action (start game)
	start_quiz.addEventListener('click', (_) => {
		start_screen.classList.add('hide');
		mid.classList.remove('hide');

		playClickSound();

		// make first question
		MakeQuestion(counter);

		// move step
		moveStep();

		// start timer
		clearAndRestartTimer();
	});

	// middle game
	question_cont.addEventListener('click', (e) => {
		// when buttons clicked
		if (e.target.tagName === 'BUTTON') {
			playClickSound();

			clearAndRestartTimer();

			// if button text content == question.correctAnswer
			if (e.target.textContent === Questions[counter].Correct_Answer) {
				// added to correct answers
				correct.push(Questions[counter]);
			} else {
				// add the answer to wrong answers
				wrong.push(Questions[counter]);
			}

			if (counter < 9) {
				// increase the counter and make new question
				counter++;
				MakeQuestion(counter);
				moveStep();
			} else {
				correct_answers.textContent = correct.length;
				wrong_answers.textContent = wrong.length;
				not_answered.textContent = notSolved.length;

				mid.classList.add('hide');
				last.classList.remove('hide');
			}
		}
	});

	// end game
	function try_again() {
		// shuffle the questions again
		shuffle(Questions);

		correct = [];
		wrong = [];
		notSolved = [];

		// Reset counter to 0
		counter = 0;
		moveStep();

		playClickSound();

		start_screen.classList.remove('hide');
		last.classList.add('hide');

	}
	try_.addEventListener('click', try_again);
});
