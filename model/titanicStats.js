import fs from 'fs';
import readline from 'readline';

let totalFares = 0,
  firstClassFaresAvg = 0,
  secondClassFaresAvg = 0,
  thirdClassFaresAvg = 0,
  survived = 0, notSurvived = 0,
  survivedMen = 0, survivedWomen = 0, survivedChildren = 0,
  notSurvivedMen = 0, notSurvivedWomen = 0, notSurvivedChildren = 0,
  fareOfFirstClass = 0, fareOfSecondClass = 0, fareOfThirdClass = 0,
  isFirstLine = true;
const firstClass = [], secondClass = [], thirdClass = [];

const titanicStream = fs.createReadStream('../train.csv', 'utf8');
const reader = readline.createInterface({
  input: titanicStream,
  crlfDelay: Infinity
});
reader.on('line', (line) => {
  if (isFirstLine) {
    isFirstLine = false;
    return;
  }
  const passengerLine = line.split(/(?<!\s),(?!\s)/);
  const passengerObj = getPassenger(passengerLine);
  const avgFareObj = getAvgFareByClasses(passengerObj);

  totalFares += passengerObj.fare;

  const avgFareByClasses = getAvgFareByClasses(passengerObj);
  firstClassFaresAvg = (avgFareObj.fareOfFirstClass / avgFareObj.firstClass.length).toFixed(2);
  secondClassFaresAvg = (avgFareObj.fareOfSecondClass / avgFareObj.secondClass.length).toFixed(2);
  thirdClassFaresAvg = (avgFareObj.fareOfThirdClass / avgFareObj.thirdClass.length).toFixed(2);


  if (passengerObj.survived === '1') {
    survived++;
    if (passengerObj.sex === 'male') {
      survivedMen++;
    } else {
      survivedWomen++;
    }
    if (passengerObj.age < 18 && passengerObj.age !== '') {
      survivedChildren++;
    }

  } else {
    notSurvived++;
    if (passengerObj.sex === 'male') {
      notSurvivedMen++;
    } else {
      notSurvivedWomen++;
    }
    if (passengerObj.age < 18 && passengerObj.age !== '') {
      notSurvivedChildren++;
    }
  }
});

reader.on('close', () => {
  console.log(`Total fares: ${totalFares.toFixed(2)}`);
  console.log(`Fist class average fares: ${firstClassFaresAvg}`);
  console.log(`Second class average fares: ${secondClassFaresAvg}`);
  console.log(`Third class average fares: ${thirdClassFaresAvg}`);
  console.log(`Survived: ${survived}`);
  console.log(`Not survived: ${notSurvived}`);
  console.log(`Male survived: ${survivedMen}`);
  console.log(`Female survived: ${survivedWomen}`);
  console.log(`Children survived: ${survivedChildren}`);
  console.log(`Male not survived: ${notSurvivedMen}`);
  console.log(`Female not survived: ${notSurvivedWomen}`);
  console.log(`Children not survived: ${notSurvivedChildren}`);
});


function getPassenger (passenger) {
  return {
    name: passenger[3],
    sex: passenger[4],
    age: passenger[5],
    fare: parseFloat(passenger[9]) || 0,
    class: passenger[2],
    survived: passenger[1]
  };
}

function getAvgFareByClasses (passenger) {
  switch (passenger.class) {
    case '1':
      firstClass.push(passenger);
      fareOfFirstClass += passenger.fare;
      break;
    case '2':
      secondClass.push(passenger);
      fareOfSecondClass += passenger.fare;
      break;
    case '3':
      thirdClass.push(passenger);
      fareOfThirdClass += passenger.fare;
      break;
    default:
      break;
  }

  return {
    fareOfFirstClass,
    fareOfSecondClass,
    fareOfThirdClass,
    firstClass,
    secondClass,
    thirdClass
  };
}


