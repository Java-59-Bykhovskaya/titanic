import fs from 'fs';
import readline from 'readline';

const titanicStream = fs.createReadStream('../train.csv', 'utf8');
const reader = readline.createInterface({
  input: titanicStream,
  crlfDelay: Infinity
});

let passengers = [], totalFares, firstClassFaresAvg, secondClassFaresAvg,
  thirdClassFaresAvg,
  survived, notSurvived, survivedMen, survivedWomen, survivedChildren,
  notSurvivedMen, notSurvivedWomen, notSurvivedChildren, isFirstLine = true;


reader.on('line', (line) => {
  if (isFirstLine) {
    isFirstLine = false;
    return;
  }
  passengers.push(line);
  const avgByClasses = getAvgByClasses(passengers);
  const amountByGender = getAmountByGender(passengers);

  totalFares = (getTotalFares(passengers));
  firstClassFaresAvg = avgByClasses.firstTotal;
  secondClassFaresAvg = avgByClasses.secondTotal;
  thirdClassFaresAvg = avgByClasses.thirdTotal;
  survived = getSurvivedAndNotSurvived(passengers).survived.length;
  notSurvived = getSurvivedAndNotSurvived(passengers).notSurvived.length;
  survivedMen = amountByGender.menSurvived;
  survivedWomen = amountByGender.womenSurvived;
  survivedChildren = amountByGender.childrenSurvived;
  notSurvivedMen = amountByGender.menNotSurvived;
  notSurvivedWomen = amountByGender.womenNotSurvived;
  notSurvivedChildren = amountByGender.childrenNotSurvived;
});

reader.on('close', () => {
  console.log(`Total fares: ${totalFares}`);
  console.log(`Fist class average fares:${firstClassFaresAvg}`);
  console.log(`Second class average fares:${secondClassFaresAvg}`);
  console.log(`Third class average fares:${thirdClassFaresAvg}`);
  console.log(`Survived: ${survived}`);
  console.log(`Not survived: ${notSurvived}`);
  console.log(`Survived men: ${survivedMen}`);
  console.log(`Survived women: ${survivedWomen}`);
  console.log(`Survived children: ${survivedChildren}`);
  console.log(`Not survived men: ${notSurvivedMen}`);
  console.log(`Not survived women: ${notSurvivedWomen}`);
  console.log(`Not survived children: ${notSurvivedChildren}`);
});


function getTotalFares (arr) {
  let total = 0;
  arr.forEach((passenger) => {
    const objPass = getPassenger(passenger);
    total += objPass.fare;
  });
  return total.toFixed(2);
}

function getPassenger (passengers) {
  const arrPassenger = passengers.split(/(?<!\s),(?!\s)/);
  return {
    name: arrPassenger[3],
    sex: arrPassenger[4],
    age: arrPassenger[5],
    fare: parseFloat(arrPassenger[9]) || 0,
    class: arrPassenger[2],
    survived: arrPassenger[1]
  };
}

function getAvgByClasses (passengers) {
  const firstClass = [];
  const secondClass = [];
  const thirdClass = [];
  let fareOfFirstClass = 0, fareOfSecondClass = 0, fareOfThirdClass = 0;
  for (const pass of passengers) {
    const objPass = getPassenger(pass);
    switch (objPass.class) {
      case '1':
        firstClass.push(objPass);
        fareOfFirstClass += objPass.fare;
        break;
      case '2':
        secondClass.push(objPass);
        fareOfSecondClass += objPass.fare;
        break;
      case '3':
        thirdClass.push(objPass);
        fareOfThirdClass += objPass.fare;
        break;
      default:
        break;
    }
  }
  return {
    firstTotal: (fareOfFirstClass / firstClass.length).toFixed(2),
    secondTotal: (fareOfSecondClass / secondClass.length).toFixed(2),
    thirdTotal: (fareOfThirdClass / thirdClass.length).toFixed(2)
  };

}


function getSurvivedAndNotSurvived (passengers) {
  let survived = [], notSurvived = [];
  passengers.forEach((passenger) => {
    const objPass = getPassenger(passenger);
    switch (objPass.survived) {
      case '1':
        survived.push(objPass);
        break;
      case '0':
        notSurvived.push(objPass);
        break;
      default:
        break;
    }
  });
  return { survived, notSurvived };
}

function getAmountByGender (passengers) {
  const obj = getSurvivedAndNotSurvived(passengers);
  let menSurvived = 0, menNotSurvived = 0, womenSurvived = 0,
    womenNotSurvived = 0,
    childrenSurvived = 0, childrenNotSurvived = 0;

  obj.survived.forEach((pass) => {
    if (pass.sex === 'male') {
      menSurvived++;
    }
    if (pass.sex === 'female') {
      womenSurvived++;
    }
    if (pass.age < 18 && pass.age !== '') {
      childrenSurvived++;
    }
  });
  obj.notSurvived.forEach((pass) => {
    if (pass.sex === 'male') {
      menNotSurvived++;
    }
    if (pass.sex === 'female') {
      womenNotSurvived++;
    }
    if (pass.age < 18 && pass.age !== '') {
      childrenNotSurvived++;
    }
  });
  return {
    menSurvived,
    menNotSurvived,
    womenSurvived,
    womenNotSurvived,
    childrenSurvived,
    childrenNotSurvived
  };
}
