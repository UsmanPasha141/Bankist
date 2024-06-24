'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// BANKIST APPLICATION implementation

// displaying the movements
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  // .textContent = 0;

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__date">3 days ago</div>
          <div class="movements__value">${mov} ₹</div>
        </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
// displayMovements(account1.movements);

// to display the balance in the respective account
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.innerHTML = `${acc.balance}.00 ₹`;
};
// calcDisplayBalance(account1.movements);

const calcDisplaySummary = function (account) {
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}₹`;

  const outcomes = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov, i, arr) => {
      // console.log(arr);
      return acc + mov;
    }, 0);
  labelSumOut.textContent = `${Math.abs(outcomes)}₹`;

  const interestRate = account.interestRate;
  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposits => (deposits * interestRate) / 100)
    .filter((int, i, arr) => int >= 1) //only the values which are greater than 1 are included when we calculate the interest Rate and deposites
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}₹`;
};
// calcDisplaySummary(account1.movements);

// creating the user name and putting it into the respective objects
const createUserNames = function (accs) {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('');
    // console.log(acc.username);
  });
};
// console.log(containerMovements.innerHTML);
// const user = 'Steven Thomas Williams'; // stw
// const user = 'usman Pasha'; // up
createUserNames(accounts);

const updateUI = function (acc) {
  // display movements
  displayMovements(acc.movements);

  // display balance
  calcDisplayBalance(acc);

  // display summary
  calcDisplaySummary(acc);
};

// EventHandlers
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  // Prevent form from submiting or refreshing
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  // console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and dislay message
    labelWelcome.textContent = `WELCOME BACK, ${currentAccount.owner
      .split(' ')[0]
      .toUpperCase()}`;

    // setting opacity to 100
    containerApp.style.opacity = '100';

    // making the input field as empty
    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur();

    updateUI(currentAccount);
  } else {
    alert('YOU HAVE ENTERED WRONG CREDENTIALS');
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault(); //prevent from reloading the page bcz of btn is inform tag
  const amount = Number(inputTransferAmount.value);
  const recieverAcc = accounts.find(acc => {
    return acc.username === inputTransferTo.value;
  });

  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferTo.blur();

  // add the negative movement to the current user
  if (
    amount > 0 &&
    recieverAcc &&
    amount <= currentAccount.balance &&
    recieverAcc?.username !== currentAccount.username
  ) {
    // doing the transfer
    currentAccount.movements.push(-amount);
    recieverAcc.movements.push(amount);

    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault(); //preventinf from the refresh
  const amount = Number(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some(mov => mov >= (amount * 10) / 100)
  ) {
    // Add the movement
    currentAccount.movements.push(amount);

    // update ui
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  // preventing from the refresh if we click the btn
  e.preventDefault();
  // deleting the user
  const closeusername = inputCloseUsername.value;
  const closeuserpin = Number(inputClosePin.value);

  inputCloseUsername.value = inputClosePin.value = '';
  inputCloseUsername.blur();
  // console.log(closeusername, closeuserpin);
  if (
    closeusername === currentAccount.username &&
    closeuserpin === currentAccount.pin
  ) {
    const closeaccIndex = accounts.findIndex(acc => {
      return acc.username === closeusername && acc.pin === closeuserpin;
    });
    // delete account
    accounts.splice(closeaccIndex, 1);

    // hide UI
    containerApp.style.opacity = '0';
  }
});

let sorted = false;
btnSort.addEventListener('click', function () {
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

/*
let arr = ['a', 'b', 'c', 'd', 'e'];

console.log(arr.slice(1));
console.log(arr.slice(1, 3));
console.log(arr.slice(-1));
console.log(arr.slice(-2));
console.log(arr.slice(-3));
console.log(arr.slice(1, -2));
console.log(arr.slice());
console.log([...arr]);

//splice
console.log(arr.splice(2));
arr.splice(-1);
console.log(arr);

arr.splice(1, 2);
console.log(arr);

//reverse
arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse());
console.log(arr2);

// concat
const letters = arr.concat(arr2);
console.log(letters);
// const [...letters1] = [...arr, ...arr2];
// console.log(letters1);

// join
console.log(letters.join(' - '));
*/

/*
const arr = [23, 11, 64];
console.log(arr[0]);
console.log(arr.at(0));

//getting the last method
console.log(arr[arr.length - 1]);
console.log(arr.slice(-1)[0]);
console.log(arr.at(-2));
console.log('usman'.at(0));
console.log('usman'.at(-1));
*/

//using bank account data
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// for (const val of movements) {
// for (const [index, val] of movements.entries()) {
//   if (val > 0) {
//     console.log('Movement ' + (index + 1) + ' you deposited ' + val);
//   } else {
//     console.log('Movement ' + (index + 1) + ' you withdrawed ' + Math.abs(val));
//   }
//   // console.log(index);
// }
/*
movements.forEach(function (movement, index, array) {
  movement > 0 &&
    console.log(`Movement ${index + 1} you deposited : ${movement}`);
  movement < 0 &&
    console.log(`Movement ${index + 1} you withdrawed : ${Math.abs(movement)}`);
  // movement == 1300 && console.log(array);
});
// 0 : function(200)
// 1 : function(450)
// 2 : function(400)
*/

/*
//forEach with map
const currencies = new Map([
  ['USD', 'United States of Amerioca'],
  ['EUR', 'Euro'],
  ['GPB', 'Pound sterling'],
]);
currencies.forEach(function (value, key, map) {
  console.log(`the ${key} is the Curency of ${value} country`);
});

// forEach set
const currenciesUnique = new Set(['USD', 'USD', 'USD', 'USD', 'EUR', 'EUR']);
// console.log(currenciesUnique);
currenciesUnique.forEach((value, key, set) => console.log(value, key, set));
*/
// const s = document.querySelector('.welcome');
// const input = Number(prompt('Enter the number'));
// if (input === 1) {
//   // s.forEach(element => {
//   s.style.backgroundColor = 'pink';
//   // });
// }

///////////////////////////////////////
// Coding Challenge #1

/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀
*/
/*
const julia = [3, 5, 2, 12, 7];
const kate = [4, 1, 15, 8, 3];

const checkDogs = (julia, kate) => {
  const copyjulia = julia.slice(1, -2);
  // console.log(copyjulia);

  const bothData = [...copyjulia, ...kate];
  console.log(bothData);

  bothData.forEach((age, i) => {
    age >= 3 &&
      console.log(`Dog number ${i + 1} is an adult, and is ${age} years old`);
    age < 3 && console.log(`Dog number ${i + 1} is still a puppy 🐶`);
  });
};
// checkDogs(julia, kate);
checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);
*/

// map method
/*
const dollerToRs = 81.4;
// const movementsRupee = movements.map(function (mov) {
//   return mov * dollerToRs;
//   // return 23;
// });

const movementsRupee = movements.map(mov => mov * dollerToRs);

console.log(movements);
console.log(movementsRupee);

let movementsArray = [];
for (let [i, mov] of movements.entries()) {
  movementsArray[i++] = mov * 2; // or by using push method
}
console.log(movementsArray);

const movementDescription = movements.map(
  (mov, i) =>
  `Movement ${i + 1} you ${mov > 0 ? 'deposited' : 'withdrawed'} : ${Math.abs(
      mov
    )}`
    );
console.log(movementDescription);
*/

// filter method
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
/*
const deposites = movements.filter(function (mov, i, arr) {
  // if (mov > 0) {
  //   return mov;
  // }
  return mov > 0;
});
console.log(deposites);

const withdrawals = movements.filter(mov => mov < 0);
console.log(withdrawals);
*/
/*
// reduce method
console.log(movements);
// accoumulator -> (sum)
const balance = movements.reduce((acc, curr, i, arr) => {
  console.log(`Iteration number ${i} : ${acc}`);
  return (acc += curr); // or acc + curr
}, 0);
console.log(balance);

// maximum value in movement using reduce method
const maxi = movements.reduce((max, curr) => {
  if (max > curr) return max;
  else return curr;
}, movements[0]);
console.log(maxi);
*/

//////////////////////////////////////////
// Coding Challenge #2

/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/
/*
const calcAverageHumanAge = function (ages) {
  const humanAges = ages.map(age => {
    if (age <= 2) return 2 * age;
    else return 16 + age * 4;
  });
  console.log(humanAges);
  const adultdogsAge = humanAges.filter(age => {
    if (age >= 18) return age;
  });
  console.log(adultdogsAge);
  const avgAdultDogAge = adultdogsAge.reduce((total, age) => {
    return total + age;
  }, 0);
  console.log(avgAdultDogAge);
  return avgAdultDogAge / adultdogsAge.length;
};
console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));
*/

// deposites are in dollers then convert into rupee add them all to jow what is the balance
// const depositeBalanaceInUSD = movements
//   .filter(mov => mov > 0)
//   .map(fmov => fmov * 81.1)
//   .reduce((acc, fmmov) => acc + fmmov, 0);
// console.log(depositeBalanaceInUSD);

// const calcAvghumanAgeArrow = ages => {
//   return ages
//     .map(age => {
//       if (age <= 2) return 2 * age;
//       else return age * 4 + 16;
//     })
//     .filter((age1, i, arr) => {
//       // console.log(arr);
//       return age1 > 18;
//     })
//     .reduce((acc, age2, i, arr) => {
//       return acc + age2 / arr.length;
//     }, 0);
// };
// console.log(calcAvghumanAgeArrow([5, 2, 4, 1, 15, 8, 3]));
// console.log(calcAvghumanAgeArrow([16, 6, 10, 5, 6, 1, 4]));

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const firstwithdrawal = movements.find(mov => mov < 0);
// console.log(firstwithdrawal);

// console.log(accounts);
// const account = accounts.find(acc => acc.username === 'js');
// console.log(account);

// const a = new Set([1, 1, 1, 2, 3]);
// console.log(a);
// const ar = [...a];
// console.log(ar);
// const m = new Map([
//   ['na', 'usman'],
//   ['roll', 1],
// ]);
// console.log(m);
// const ar1 = [...m];
// console.log(ar1);

/*
console.log(movements);
// equality
console.log(movements.includes(-130));

// some methods
// conditions
const anyDeposite = movements.some(mov => mov > 0); //true
// const anyDeposite = movements.some(mov => mov > 55550); //false
console.log(anyDeposite);
*/
/*

// EVERY
console.log(movements.every(mov => mov > 0));

// every element is deposit in account4
console.log(account4.movements?.every(mov => mov > 0));

//seperate callback
const deposit = mov => mov > 0;
console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));
*/
/*
// flat and faltmap method
const arr = [[1, 2, 3], [4, 5, 6], 7, 8];

const flatenedArr = arr.flat();
console.log(flatenedArr);

const arrDeep = [[1, [2, 3]], [[4, 5], 6], 7, 8];
console.log(arrDeep.flat(2));

const accountsMovemnts = accounts.map(acc => acc.movements);
console.log(accountsMovemnts);
const allMovements = accountsMovemnts.flat();
console.log(allMovements);
const sum = allMovements.reduce((acc, mov) => {
  return acc + mov;
}, 0);
console.log(sum);

console.log(
  accounts
    .map(acc => acc.movements)
    .flat()
    .reduce((acc, mov) => acc + mov, 0)
);

const accountMovements2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(accountMovements2);
*/

/*
// sorting with Strings
const owners = ['usman', 'sunil', 'vikas', 'thrishan'];
console.log(owners.sort());

// sorting with
console.log(movements);

//acsending order
movements.sort((a, b) => a - b);
console.log(movements);

// decsending oredr
movements.sort((a, b) => b - a);
console.log(movements);
*/

// array filling through the program
/*
const s = new Array(7);
console.log(s);
// s.fill(1);
s.fill(1, 2, 6);
console.log(s);

// frray.from programatically
const y = Array.from({ length: 7 }, () => 1);
console.log(y);

const z = Array.from({ length: 7 }, (_, i) => i + 1);
console.log(z);
*/
/*
const k = Array.from({ length: 50 }, () => (Math.random() * 6).toFixed(0));
console.log(k);

const kk = Array.from({ length: 100 }, () =>
  (Math.random() * (10 - 5) + 5).toFixed(0)
);
console.log(kk);
*/
/*
labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    ele => ele.textContent.replace(' ₹', '')
  );
  console.log(movementsUI);
});

///////////////////////////////////////
// Array Methods Practice
// 1.
const bankDepositSum = accounts
  .flatMap(accuont => accuont.movements)
  .filter(mov => mov > 0)
  .reduce((acc, mov) => acc + mov, 0);
console.log(bankDepositSum);

// 2.
const numDeposit1000 = accounts
  .flatMap(accuont => accuont.movements)
  .reduce((count, mov) => (count += mov >= 1000 ? 1 : 0), 0);
console.log(numDeposit1000);

// pre and post incrementation
let a = 10;
console.log(a++);
console.log(a);
console.log(++a);

// 3
// const sums = accounts
const { deposits, withdrawals } = accounts
  .flatMap(accuont => accuont.movements)
  .reduce(
    (acc, mov) => {
      // mov > 0 ? (acc.deposits += mov) : (acc.withdrawal += mov);
      acc[mov > 0 ? 'deposits' : 'withdrawals'] += mov;
      return acc;
    },
    { deposits: 0, withdrawals: 0 }
  );
console.log(deposits, withdrawals);

//reduce method with array as accumulator
console.log(movements);
const reduceArray = movements.reduce((acc, mov) => {
  mov > 0 ? acc.push(mov) : 0;
  return acc;
}, []);
console.log(reduceArray);

// 4
// this is a nice title => This Is a Nice Title
//Do not capitalize short words like "and," "or," "but," "nor," "a," "an," "the," "as," "at," "by," "for," "in," "of," "on," "per," "to," "up," and "with" unless they are the first or last word of the title or are part of a proper noun.
const converttitleCase = function (title) {
  const exception = ['a', 'an', 'the', 'but', 'or', 'on', 'in', 'with', 'and'];
  // title = title.toLowerCase();
  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word => {
      if (!exception.includes(word)) {
        return word[0].toUpperCase() + word.slice(1);
      }
      return word;
    })
    .join(' ');
  return titleCase;
};
console.log(converttitleCase('this is a nice title and not small'));
console.log(converttitleCase('this is not a LONG title but NOT TOO lONG'));
console.log(
  converttitleCase('this is an another title,The place is chintamani')
);
*/

///////////////////////////////////////
// Coding Challenge #4

/* 
Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).

1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

TEST DATA:

GOOD LUCK 😀
*/
/*

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

// 1
dogs.forEach(
  dog => (dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28))
);
console.log(dogs);

// 2
dogs.forEach(dog => {
  dog.owners.find(owner => {
    if (owner === 'Sarah') {
      if (dog.curFood > dog.recommendedFood) {
        console.log("it's eating too much");
      } else if (
        dog.current > dog.recommended * 0.9 &&
        dog.current < dog.recommended * 1.1
      ) {
        console.log("it's eating OK");
      } else {
        console.log("it's eating too little");
      }
    }
  });
});
// jhonas did
const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(dogSarah);
console.log(
  `Sarah's dog is eating too ${
    dogSarah.curFood > dogSarah.recommendedFood ? 'much' : 'little'
  }`
);

// 3
const ownersEatTooMuch = dogs
  .filter(dog => dog.curFood > dog.recommendedFood)
  .flatMap(dogToo => dogToo.owners);
console.log(ownersEatTooMuch);

const ownersEatTooLittle = dogs
  .filter(dog => dog.curFood < dog.recommendedFood)
  .flatMap(dogLittle => dogLittle.owners);
console.log(ownersEatTooLittle);

// 4
console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much!`);
console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too little!`);

// 5
const result5 = dogs.some(dog => dog.curFood === dog.recommendedFood);
console.log(result5);

// 6
const result6 = dogs.some(
  dog =>
    dog.curFood > dog.recommendedFood * 0.9 &&
    dog.curFood < dog.recommendedFood * 1.1
);
console.log(result6);

// 7
const result7 = dogs.filter(
  dog =>
    dog.curFood > dog.recommendedFood * 0.9 &&
    dog.curFood < dog.recommendedFood * 1.1
);
console.log(result7);

// 8
const dogCopy = dogs.slice();
console.log(dogCopy);
dogCopy.sort((a, b) => a.recommendedFood - b.recommendedFood);
console.log(dogCopy);
*/
