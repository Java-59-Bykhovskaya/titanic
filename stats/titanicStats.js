import fs from 'fs';

fs.readFile('../train.csv', 'utf8', (err, data) => {
  if (err) console.log(err);
  else {
    const passengers = data.split('\n');
    const totalFares = (getTotalFares(passengers));
    const firstClassFaresAvg = (getAvgByClasses(passengers)).firstTotal;
    const secondClassFaresAvg = (getAvgByClasses(passengers)).secondTotal;
    const thirdClassFaresAvg = (getAvgByClasses(passengers)).thirdTotal;
    const survived = getSurvivedAndNotSurvived(passengers).survived.length;
    const notSurvived = getSurvivedAndNotSurvived(passengers).notSurvived.length;
    const survivedMen = getAmountByGender(passengers).menSurvived;
    const surviveWomen = getAmountByGender(passengers).womenSurvived;
    const survivedChildren = getAmountByGender(passengers).childrenSurvived;
    const notSurvivedMen = getAmountByGender(passengers).menNotSurvived;
    const notSurviveWomen = getAmountByGender(passengers).womenNotSurvived;
    const notSurvivedChildren = getAmountByGender(passengers).childrenNotSurvived;


    console.log(`Total fares: ${getTotalFares(passengers)}\nFist class average fares:${firstClassFaresAvg}\nSecond class average fares:${secondClassFaresAvg}\nThird class average fares:${thirdClassFaresAvg}\nSurvived: ${survived}\nNot survived: ${notSurvived}\nSurvived men: ${survivedMen}\nSurvived women: ${surviveWomen}\nSurvived children: ${survivedChildren}\nNot survived men: ${notSurvivedMen}\nNot survived women: ${notSurviveWomen}\nNot survived children: ${notSurvivedChildren}\n `);

  }
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
    if (pass.sex === 'male' && (pass.age >= 18 || pass.age === '')) {
      menSurvived++;
    } else if (pass.sex === 'female' && (pass.age >= 18 || pass.age === '')) {
      womenSurvived++;
    } else {
      childrenSurvived++;
    }
  });
  obj.notSurvived.forEach((pass) => {
    if (pass.sex === 'male' && (pass.age >= 18 || pass.age === '')) {
      menNotSurvived++;
    } else if (pass.sex === 'female' && (pass.age >= 18 || pass.age === '')) {
      womenNotSurvived++;
    } else {
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