document.addEventListener('DOMContentLoaded', function () {
  const taskInput = document.querySelector('.task__input');
  const addTaskButton = document.querySelector('.task__button');
  const taskList = document.querySelector('.task__list');
  const taskCounter = document.querySelector('.task__counter');
  const taskBox = document.querySelector('.task__box');

  let savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];

  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(savedTasks));
  }

  function displayTasks() {
    taskList.innerHTML = '';
    savedTasks.forEach(function (taskText, index) {
      const li = document.createElement('li');
      li.classList.add('task__item');
      li.innerHTML = `
      <span class="task__result">${taskText}</span>
      <div class="task__edit-buttons">
        <button class="task__edit-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25">
        <g fill="none" stroke-width="2.083" stroke-linecap="round" stroke-linejoin="round" stroke="#000">
          <path
            d="M20.832 16.668v4.164c0 1.152-.93 2.086-2.082 2.086H4.168a2.086 2.086 0 01-2.086-2.086V6.25c0-1.152.934-2.082 2.086-2.082h4.164" />
          <path d="M13.02 16.457l9.898-10-4.375-4.375-9.898 9.898-.313 4.688zm0 0" />
        </g>
      </svg>
        </button>
        <button class="task__delete-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25">
        <path
          d="M9.375 17.957h2.082V10.02H9.375zm4.168 0h2.082V10.02h-2.082zm-6.25 1.984h10.414V8.035H7.293zm2.082-13.89h6.25V4.066h-6.25zm8.332 0V2.082H7.293v3.969H2.082v1.984h3.125v13.89h14.586V8.036h3.125V6.051zm0 0"
          fill-rule="evenodd" />
      </svg>
        </button>
      </div>
    `;
      taskList.appendChild(li);

      const deleteButton = li.querySelector('.task__delete-button');
      deleteButton.addEventListener('click', function () {
        const taskIndex = savedTasks.indexOf(taskText);
        if (taskIndex !== -1) {
          savedTasks.splice(taskIndex, 1);
          saveTasks();
          displayTasks();
          addCounterOfTasks();
        }
      });

      const editButton = li.querySelector('.task__edit-button');
      editButton.addEventListener('click', function () {
        const editedText = prompt('Редактировать задачу:', taskText);
        if (editedText !== null) {
          savedTasks[index] = editedText;
          saveTasks();
          displayTasks();
        }
      });
    });

    addCounterOfTasks();
  }

  displayTasks();

  addTaskButton.addEventListener('click', function (e) {
    e.preventDefault();
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
      savedTasks.push(taskText);
      saveTasks();
      displayTasks();
      taskInput.value = '';
      addCounterOfTasks();
    }
  });

  function addCounterOfTasks() {
    if (savedTasks.length > 0) {
      taskCounter.innerHTML = `Количество задач: ${savedTasks.length}`;
      taskBox.style.marginBottom = '15px';
    } else {
      taskCounter.innerHTML = ''; // Очищаем содержимое, если нет задач
      taskBox.style.marginBottom = '0px';
    }
  }



  // Калькулятор
  let firstNumber = '', secondNumber = '', sign = '', finish = false;
  const digit = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'],
    actions = ['-', '+', 'X', '/'],
    calcOut = document.querySelector('.calc__screen p'); // Экран калькулятора

  function clearAll() {
    firstNumber = '';
    secondNumber = '';
    sign = '';
    finish = false;
    calcOut.textContent = 0;
  }

  // Была нажата AC
  document.querySelector('.button--ac').onclick = () => {
    clearAll(); // Очищает поле калькулятора
  }

  function roundToThreeDecimals(number) {
    return parseFloat(number.toFixed(2));
  }

  document.querySelector('.calc__buttons').onclick = (e) => {
    if (!e.target.classList.contains('calc__button')) return; // Нажато пустое пространство между кнопками
    if (e.target.classList.contains('button--ac')) return; // Нажата AC

    calcOut.textContent = '';
    const key = e.target.textContent;

    // Была нажата цифра или точка
    if (digit.includes(key)) {
      if (secondNumber === '' && sign === '') {
        firstNumber += key;
        calcOut.textContent = firstNumber;
      } else if (firstNumber !== '' && secondNumber !== '' && finish) {
        secondNumber = key;
        finish = false;
        calcOut.textContent = secondNumber;
      } else {
        secondNumber += key;
        calcOut.textContent = secondNumber;
      }
      return;
    }

    // Было нажато действие (+, -, /, X)
    if (actions.includes(key)) {
      sign = key;
      calcOut.textContent = firstNumber;
    }

    // Была нажата кнопка "Равно"
    if (key === '=') {
      if (secondNumber === '') secondNumber = firstNumber;
      switch (sign) {
        case '+':
          firstNumber = (+firstNumber) + (+secondNumber);
          break;
        case '-':
          firstNumber = firstNumber - secondNumber;
          break;
        case 'X':
          firstNumber = firstNumber * secondNumber;
          break;
        case '/':
          if (secondNumber === '0') {
            calcOut.textContent = 'Деление на 0';
            firstNumber = '';
            secondNumber = '';
            sign = '';
            return;
          }
          firstNumber = firstNumber / secondNumber;
          firstNumber = roundToThreeDecimals(firstNumber);
          break;
      }
      finish = true;
      calcOut.textContent = firstNumber;
    }

    // Была нажата кнопка "+/-"
    if (key === '+/-') {
      firstNumber = -firstNumber;
      calcOut.textContent = firstNumber;
      console.log(firstNumber);
    }

    // Была нажата кнопка "%"    
    if (key === '%') {
      if (firstNumber !== '' && !secondNumber && sign === '') {
        // Если только первое число было введено, то вычисляем процент от него
        firstNumber = (+firstNumber) / 100;
        firstNumber = roundToThreeDecimals(firstNumber);
        calcOut.textContent = firstNumber;
      } else if (firstNumber !== '' && secondNumber !== '' && sign === '') {
        // Если введено первое и второе число без оператора, то вычисляем процент от первого числа
        firstNumber = (+firstNumber) * (+secondNumber) / 100;
        firstNumber = roundToThreeDecimals(firstNumber);
        calcOut.textContent = firstNumber;
      } else if (firstNumber !== '' && secondNumber === '' && sign !== '') {
        // Если введено первое число и оператор, но не второе число, то вычисляем процент от первого числа
        firstNumber = (+firstNumber) / 100;
        firstNumber = roundToThreeDecimals(firstNumber);
        calcOut.textContent = firstNumber;
      }
    }

    console.log(`Первое число: ${firstNumber}, знак: ${sign}, второе число ${secondNumber}`);
  };

  // Счётчик

  const counterDecrease = document.querySelector('.counter__decrease');
  const counterResult = document.querySelector('.counter__result');
  const counterIncrease = document.querySelector('.counter__increase');
  let counter = 0;

  counterDecrease.addEventListener('click', () => {
    if (counter > 0) {
      counter--;
      updateCount();
    }
  });

  counterIncrease.addEventListener('click', () => {
    counter++;
    updateCount();
  });

  function updateCount() {
    counterResult.textContent = counter;
    counterResult.classList.add('animate-count'); // Добавляем класс для анимации
    setTimeout(() => {
      counterResult.classList.remove('animate-count'); // Удаляем класс после анимации
    }, 300);
  }

  updateCount();

  // Генератор паролей

  const passwordGeneratorForm = document.querySelector('.password__form');
  const passwordLengthInput = document.querySelector('.password__input');
  const includeLowercaseInput = document.querySelectorAll('.password__checkbox')[0];
  const includeUppercaseInput = document.querySelectorAll('.password__checkbox')[1];
  const includeNumbersInput = document.querySelectorAll('.password__checkbox')[2];
  const includeSpecialCharactersInput = document.querySelectorAll('.password__checkbox')[3];
  const passwordOutput = document.querySelector('.password__output');

  passwordGeneratorForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const length = parseInt(passwordLengthInput.value);
    const includeLowercase = includeLowercaseInput.checked;
    const includeUppercase = includeUppercaseInput.checked;
    const includeNumbers = includeNumbersInput.checked;
    const includeSpecialCharacters = includeSpecialCharactersInput.checked;

    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numberChars = '0123456789';
    const specialChars = '!@#$%^&*';

    let availableChars = '';
    if (includeLowercase) availableChars += lowercaseChars;
    if (includeUppercase) availableChars += uppercaseChars;
    if (includeNumbers) availableChars += numberChars;
    if (includeSpecialCharacters) availableChars += specialChars;

    if (availableChars === '') {
      alert('Выберите хотя бы один тип символов для генерации пароля.');
      return;
    }

    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * availableChars.length);
      password += availableChars[randomIndex];
    }

    passwordOutput.textContent = password;
  });

});
