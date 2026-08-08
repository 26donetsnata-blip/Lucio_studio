// Данные приложения: профиль пользователя и план питания.
// Отредактируйте PROFILE, чтобы изменить вес/возраст/цель без правки остального кода.

const PROFILE = {
  gender: "female",
  age: 48,
  heightCm: 157,
  weightKg: 74,
  goalWeightDeltaKg: -5,
  mealsPerDay: 4,
  sleep: { bedtime: "23:00", wake: "06:30" },
  activity: {
    strengthTrainingDaysOfWeek: [3], // 1=Пн ... 7=Вс. По умолчанию — среда.
    dailyLymphaticDrainage: true
  },
  allergies: [],
  weeklyBudgetRub: 10000,
  planStartDate: "2026-07-29",
  cycleLengthDays: 10,
  totalPlanDays: 30
};

// Общие альтернативы для замены блюда в рамках одного приёма пищи.
const ALTERNATIVES = {
  breakfast: [
    {
      id: "alt-breakfast-1",
      name: "Йогурт натуральный с мюсли и ягодами",
      ingredients: [
        { name: "йогурт натуральный", amount: 150, unit: "г", shoppingCategory: "молочное" },
        { name: "мюсли без сахара", amount: 40, unit: "г", shoppingCategory: "бакалея" },
        { name: "ягоды замороженные", amount: 60, unit: "г", shoppingCategory: "овощи/фрукты" }
      ],
      steps: ["Смешать йогурт с мюсли.", "Добавить размороженные ягоды."],
      prepTimeMin: 5,
      kcal: 330,
      macros: { proteinG: 15, fatG: 8, carbG: 50 }
    },
    {
      id: "alt-breakfast-2",
      name: "Яйца варёные с хлебцем и овощами",
      ingredients: [
        { name: "яйцо куриное", amount: 2, unit: "шт", shoppingCategory: "яйца" },
        { name: "хлебцы цельнозерновые", amount: 2, unit: "шт", shoppingCategory: "бакалея" },
        { name: "огурец", amount: 100, unit: "г", shoppingCategory: "овощи/фрукты" }
      ],
      steps: ["Сварить яйца вкрутую.", "Подать с хлебцами и нарезанным огурцом."],
      prepTimeMin: 10,
      kcal: 300,
      macros: { proteinG: 18, fatG: 14, carbG: 22 }
    },
    {
      id: "alt-breakfast-3",
      name: "Творог с мёдом и орехами",
      ingredients: [
        { name: "творог 5%", amount: 150, unit: "г", shoppingCategory: "молочное" },
        { name: "мёд", amount: 10, unit: "г", shoppingCategory: "бакалея" },
        { name: "грецкий орех", amount: 15, unit: "г", shoppingCategory: "бакалея" }
      ],
      steps: ["Смешать творог с мёдом.", "Посыпать рублеными орехами."],
      prepTimeMin: 5,
      kcal: 320,
      macros: { proteinG: 24, fatG: 14, carbG: 22 }
    },
    {
      id: "alt-breakfast-4",
      name: "Гречневая каша на воде с бананом",
      ingredients: [
        { name: "гречка", amount: 50, unit: "г", shoppingCategory: "крупы" },
        { name: "банан", amount: 100, unit: "г", shoppingCategory: "овощи/фрукты" }
      ],
      steps: ["Отварить гречку на воде.", "Подать с нарезанным бананом."],
      prepTimeMin: 20,
      kcal: 300,
      macros: { proteinG: 8, fatG: 3, carbG: 60 }
    }
  ],
  lunch: [
    {
      id: "alt-lunch-1",
      name: "Куриные котлеты на пару с гречкой и овощами",
      ingredients: [
        { name: "фарш куриный", amount: 150, unit: "г", shoppingCategory: "мясо/птица" },
        { name: "гречка", amount: 60, unit: "г", shoppingCategory: "крупы" },
        { name: "капуста", amount: 100, unit: "г", shoppingCategory: "овощи/фрукты" }
      ],
      steps: ["Сформировать котлеты, готовить на пару 20 мин.", "Отварить гречку.", "Подать с салатом из капусты."],
      prepTimeMin: 30,
      kcal: 430,
      macros: { proteinG: 32, fatG: 12, carbG: 45 }
    },
    {
      id: "alt-lunch-2",
      name: "Рыба тушёная с рисом и салатом",
      ingredients: [
        { name: "минтай/хек", amount: 180, unit: "г", shoppingCategory: "рыба" },
        { name: "рис", amount: 60, unit: "г", shoppingCategory: "крупы" },
        { name: "помидор", amount: 100, unit: "г", shoppingCategory: "овощи/фрукты" }
      ],
      steps: ["Потушить рыбу с луком и морковью 15 мин.", "Отварить рис.", "Подать с салатом из помидоров."],
      prepTimeMin: 25,
      kcal: 420,
      macros: { proteinG: 30, fatG: 10, carbG: 48 }
    },
    {
      id: "alt-lunch-3",
      name: "Индейка с булгуром и тушёными овощами",
      ingredients: [
        { name: "филе индейки", amount: 150, unit: "г", shoppingCategory: "мясо/птица" },
        { name: "булгур", amount: 60, unit: "г", shoppingCategory: "крупы" },
        { name: "кабачок", amount: 100, unit: "г", shoppingCategory: "овощи/фрукты" }
      ],
      steps: ["Обжарить индейку на сухой сковороде до готовности.", "Отварить булгур.", "Потушить кабачок."],
      prepTimeMin: 30,
      kcal: 440,
      macros: { proteinG: 34, fatG: 10, carbG: 46 }
    },
    {
      id: "alt-lunch-4",
      name: "Чечевица с овощами и куриной грудкой",
      ingredients: [
        { name: "чечевица", amount: 60, unit: "г", shoppingCategory: "крупы" },
        { name: "куриная грудка", amount: 120, unit: "г", shoppingCategory: "мясо/птица" },
        { name: "морковь", amount: 60, unit: "г", shoppingCategory: "овощи/фрукты" }
      ],
      steps: ["Отварить чечевицу с морковью.", "Отдельно отварить/запечь куриную грудку, нарезать."],
      prepTimeMin: 30,
      kcal: 410,
      macros: { proteinG: 33, fatG: 8, carbG: 45 }
    }
  ],
  snack: [
    {
      id: "alt-snack-1",
      name: "Яблоко",
      ingredients: [{ name: "яблоко", amount: 150, unit: "г", shoppingCategory: "овощи/фрукты" }],
      steps: ["Съесть свежим."],
      prepTimeMin: 1,
      kcal: 80,
      macros: { proteinG: 0, fatG: 0, carbG: 20 }
    },
    {
      id: "alt-snack-2",
      name: "Кефир 1%",
      ingredients: [{ name: "кефир 1%", amount: 200, unit: "мл", shoppingCategory: "молочное" }],
      steps: ["Выпить охлаждённым."],
      prepTimeMin: 1,
      kcal: 100,
      macros: { proteinG: 6, fatG: 2, carbG: 8 }
    },
    {
      id: "alt-snack-3",
      name: "Творог с ягодами",
      ingredients: [
        { name: "творог 2%", amount: 100, unit: "г", shoppingCategory: "молочное" },
        { name: "ягоды замороженные", amount: 50, unit: "г", shoppingCategory: "овощи/фрукты" }
      ],
      steps: ["Смешать творог с ягодами."],
      prepTimeMin: 3,
      kcal: 130,
      macros: { proteinG: 16, fatG: 2, carbG: 10 }
    },
    {
      id: "alt-snack-4",
      name: "Горсть орехов и яблоко",
      ingredients: [
        { name: "грецкий орех", amount: 20, unit: "г", shoppingCategory: "бакалея" },
        { name: "яблоко", amount: 100, unit: "г", shoppingCategory: "овощи/фрукты" }
      ],
      steps: ["Съесть вместе."],
      prepTimeMin: 1,
      kcal: 190,
      macros: { proteinG: 4, fatG: 13, carbG: 15 }
    }
  ],
  dinner: [
    {
      id: "alt-dinner-1",
      name: "Омлет с овощами",
      ingredients: [
        { name: "яйцо куриное", amount: 2, unit: "шт", shoppingCategory: "яйца" },
        { name: "помидор", amount: 80, unit: "г", shoppingCategory: "овощи/фрукты" },
        { name: "капуста", amount: 80, unit: "г", shoppingCategory: "овощи/фрукты" }
      ],
      steps: ["Взбить яйца.", "Обжарить овощи 3 мин, залить яйцами, довести до готовности под крышкой."],
      prepTimeMin: 15,
      kcal: 260,
      macros: { proteinG: 16, fatG: 16, carbG: 10 }
    },
    {
      id: "alt-dinner-2",
      name: "Куриная грудка с салатом",
      ingredients: [
        { name: "куриная грудка", amount: 150, unit: "г", shoppingCategory: "мясо/птица" },
        { name: "огурец", amount: 100, unit: "г", shoppingCategory: "овощи/фрукты" },
        { name: "капуста", amount: 100, unit: "г", shoppingCategory: "овощи/фрукты" }
      ],
      steps: ["Запечь или отварить куриную грудку.", "Нарезать овощи в салат."],
      prepTimeMin: 25,
      kcal: 300,
      macros: { proteinG: 35, fatG: 8, carbG: 10 }
    },
    {
      id: "alt-dinner-3",
      name: "Рыба запечённая с овощами",
      ingredients: [
        { name: "минтай/хек", amount: 180, unit: "г", shoppingCategory: "рыба" },
        { name: "кабачок", amount: 100, unit: "г", shoppingCategory: "овощи/фрукты" },
        { name: "морковь", amount: 60, unit: "г", shoppingCategory: "овощи/фрукты" }
      ],
      steps: ["Выложить рыбу и овощи на противень.", "Запекать 20-25 мин при 200°C."],
      prepTimeMin: 25,
      kcal: 290,
      macros: { proteinG: 28, fatG: 8, carbG: 12 }
    },
    {
      id: "alt-dinner-4",
      name: "Тушёные овощи с яйцом",
      ingredients: [
        { name: "кабачок", amount: 100, unit: "г", shoppingCategory: "овощи/фрукты" },
        { name: "баклажан", amount: 100, unit: "г", shoppingCategory: "овощи/фрукты" },
        { name: "яйцо куриное", amount: 1, unit: "шт", shoppingCategory: "яйца" }
      ],
      steps: ["Потушить овощи 15 мин.", "Вбить яйцо, перемешать, довести до готовности."],
      prepTimeMin: 20,
      kcal: 230,
      macros: { proteinG: 10, fatG: 12, carbG: 18 }
    }
  ]
};

// 10-дневный цикл, повторяется 3 раза, чтобы покрыть 30 дней.
const MEAL_PLAN = {
  cycleLengthDays: 10,
  mealSlots: ["breakfast", "lunch", "snack", "dinner"],
  workoutBonus: {
    id: "workout-boost",
    name: "Перекус после силовой тренировки",
    note: "Добавляется в день силовой тренировки для восстановления после нагрузки.",
    ingredients: [
      { name: "кефир 1%", amount: 200, unit: "мл", shoppingCategory: "молочное" },
      { name: "банан", amount: 100, unit: "г", shoppingCategory: "овощи/фрукты" }
    ],
    steps: ["Выпить кефир и съесть банан в течение часа после тренировки."],
    kcal: 200,
    macros: { proteinG: 7, fatG: 2, carbG: 35 }
  },
  days: [
    {
      cycleDay: 1,
      meals: {
        breakfast: {
          id: "d1-breakfast", name: "Овсянка на воде с яблоком и корицей + творог",
          ingredients: [
            { name: "овсяные хлопья", amount: 50, unit: "г", shoppingCategory: "крупы" },
            { name: "яблоко", amount: 100, unit: "г", shoppingCategory: "овощи/фрукты" },
            { name: "творог 5%", amount: 100, unit: "г", shoppingCategory: "молочное" }
          ],
          steps: ["Сварить овсянку на воде.", "Добавить нарезанное яблоко и корицу.", "Подать с творогом отдельно."],
          prepTimeMin: 15, kcal: 350, macros: { proteinG: 20, fatG: 8, carbG: 52 }
        },
        lunch: {
          id: "d1-lunch", name: "Куриная грудка отварная с гречкой и овощным салатом",
          ingredients: [
            { name: "куриная грудка", amount: 150, unit: "г", shoppingCategory: "мясо/птица" },
            { name: "гречка", amount: 60, unit: "г", shoppingCategory: "крупы" },
            { name: "капуста", amount: 80, unit: "г", shoppingCategory: "овощи/фрукты" },
            { name: "морковь", amount: 50, unit: "г", shoppingCategory: "овощи/фрукты" },
            { name: "огурец", amount: 80, unit: "г", shoppingCategory: "овощи/фрукты" }
          ],
          steps: ["Отварить куриную грудку.", "Отварить гречку.", "Нашинковать овощи в салат, заправить маслом."],
          prepTimeMin: 30, kcal: 450, macros: { proteinG: 36, fatG: 10, carbG: 48 }
        },
        snack: {
          id: "d1-snack", name: "Кефир с горстью орехов",
          ingredients: [
            { name: "кефир 1%", amount: 200, unit: "мл", shoppingCategory: "молочное" },
            { name: "грецкий орех", amount: 15, unit: "г", shoppingCategory: "бакалея" }
          ],
          steps: ["Выпить кефир, закусить орехами."],
          prepTimeMin: 2, kcal: 190, macros: { proteinG: 7, fatG: 11, carbG: 10 }
        },
        dinner: {
          id: "d1-dinner", name: "Запечённая рыба с тушёными овощами",
          ingredients: [
            { name: "минтай/хек", amount: 180, unit: "г", shoppingCategory: "рыба" },
            { name: "кабачок", amount: 100, unit: "г", shoppingCategory: "овощи/фрукты" },
            { name: "морковь", amount: 60, unit: "г", shoppingCategory: "овощи/фрукты" },
            { name: "лук", amount: 40, unit: "г", shoppingCategory: "овощи/фрукты" }
          ],
          steps: ["Запечь рыбу при 200°C 20 мин.", "Потушить овощи с луком."],
          prepTimeMin: 25, kcal: 320, macros: { proteinG: 28, fatG: 8, carbG: 20 }
        }
      }
    },
    {
      cycleDay: 2,
      meals: {
        breakfast: {
          id: "d2-breakfast", name: "Творог с бананом и льняным семенем",
          ingredients: [
            { name: "творог 5%", amount: 150, unit: "г", shoppingCategory: "молочное" },
            { name: "банан", amount: 100, unit: "г", shoppingCategory: "овощи/фрукты" },
            { name: "семена льна", amount: 10, unit: "г", shoppingCategory: "бакалея" }
          ],
          steps: ["Размять банан вилкой, смешать с творогом.", "Посыпать семенами льна."],
          prepTimeMin: 5, kcal: 330, macros: { proteinG: 24, fatG: 9, carbG: 40 }
        },
        lunch: {
          id: "d2-lunch", name: "Индейка тушёная с рисом и салатом из свежих овощей",
          ingredients: [
            { name: "филе индейки", amount: 150, unit: "г", shoppingCategory: "мясо/птица" },
            { name: "рис", amount: 60, unit: "г", shoppingCategory: "крупы" },
            { name: "помидор", amount: 100, unit: "г", shoppingCategory: "овощи/фрукты" },
            { name: "огурец", amount: 80, unit: "г", shoppingCategory: "овощи/фрукты" }
          ],
          steps: ["Потушить индейку с луком 20 мин.", "Отварить рис.", "Нарезать салат из помидора и огурца."],
          prepTimeMin: 30, kcal: 460, macros: { proteinG: 35, fatG: 10, carbG: 50 }
        },
        snack: {
          id: "d2-snack", name: "Яблоко и 2 хлебца с сыром",
          ingredients: [
            { name: "яблоко", amount: 100, unit: "г", shoppingCategory: "овощи/фрукты" },
            { name: "хлебцы цельнозерновые", amount: 2, unit: "шт", shoppingCategory: "бакалея" },
            { name: "сыр нежирный", amount: 30, unit: "г", shoppingCategory: "молочное" }
          ],
          steps: ["Подать хлебцы с сыром вместе с яблоком."],
          prepTimeMin: 3, kcal: 200, macros: { proteinG: 9, fatG: 7, carbG: 25 }
        },
        dinner: {
          id: "d2-dinner", name: "Омлет из 2 яиц с овощами",
          ingredients: [
            { name: "яйцо куриное", amount: 2, unit: "шт", shoppingCategory: "яйца" },
            { name: "помидор", amount: 80, unit: "г", shoppingCategory: "овощи/фрукты" },
            { name: "капуста", amount: 80, unit: "г", shoppingCategory: "овощи/фрукты" }
          ],
          steps: ["Взбить яйца.", "Обжарить овощи, залить яйцами, готовить под крышкой 5 мин."],
          prepTimeMin: 15, kcal: 260, macros: { proteinG: 16, fatG: 16, carbG: 10 }
        }
      }
    },
    {
      cycleDay: 3,
      meals: {
        breakfast: {
          id: "d3-breakfast", name: "Гречневая каша с молоком и варёным яйцом",
          ingredients: [
            { name: "гречка", amount: 50, unit: "г", shoppingCategory: "крупы" },
            { name: "молоко 1.5%", amount: 100, unit: "мл", shoppingCategory: "молочное" },
            { name: "яйцо куриное", amount: 1, unit: "шт", shoppingCategory: "яйца" }
          ],
          steps: ["Отварить гречку.", "Подать с тёплым молоком и варёным яйцом."],
          prepTimeMin: 20, kcal: 340, macros: { proteinG: 16, fatG: 9, carbG: 50 }
        },
        lunch: {
          id: "d3-lunch", name: "Куриная грудка на сковороде с булгуром и овощами",
          ingredients: [
            { name: "куриная грудка", amount: 150, unit: "г", shoppingCategory: "мясо/птица" },
            { name: "булгур", amount: 60, unit: "г", shoppingCategory: "крупы" },
            { name: "кабачок", amount: 100, unit: "г", shoppingCategory: "овощи/фрукты" }
          ],
          steps: ["Обжарить грудку на сухой сковороде до готовности.", "Отварить булгур.", "Потушить кабачок."],
          prepTimeMin: 30, kcal: 440, macros: { proteinG: 36, fatG: 9, carbG: 46 }
        },
        snack: {
          id: "d3-snack", name: "Творог с замороженными ягодами",
          ingredients: [
            { name: "творог 2%", amount: 120, unit: "г", shoppingCategory: "молочное" },
            { name: "ягоды замороженные", amount: 60, unit: "г", shoppingCategory: "овощи/фрукты" }
          ],
          steps: ["Смешать творог с ягодами."],
          prepTimeMin: 3, kcal: 150, macros: { proteinG: 18, fatG: 3, carbG: 12 }
        },
        dinner: {
          id: "d3-dinner", name: "Тушёная чечевица с овощами и зеленью",
          ingredients: [
            { name: "чечевица", amount: 60, unit: "г", shoppingCategory: "крупы" },
            { name: "морковь", amount: 60, unit: "г", shoppingCategory: "овощи/фрукты" },
            { name: "лук", amount: 40, unit: "г", shoppingCategory: "овощи/фрукты" }
          ],
          steps: ["Отварить чечевицу с луком и морковью 25 мин.", "Посыпать зеленью."],
          prepTimeMin: 30, kcal: 290, macros: { proteinG: 16, fatG: 4, carbG: 45 }
        }
      }
    },
    {
      cycleDay: 4,
      meals: {
        breakfast: {
          id: "d4-breakfast", name: "Овсянка с творогом и ягодами",
          ingredients: [
            { name: "овсяные хлопья", amount: 50, unit: "г", shoppingCategory: "крупы" },
            { name: "творог 5%", amount: 100, unit: "г", shoppingCategory: "молочное" },
            { name: "ягоды замороженные", amount: 60, unit: "г", shoppingCategory: "овощи/фрукты" }
          ],
          steps: ["Сварить овсянку на воде.", "Добавить творог и ягоды."],
          prepTimeMin: 15, kcal: 340, macros: { proteinG: 22, fatG: 8, carbG: 45 }
        },
        lunch: {
          id: "d4-lunch", name: "Рыба запечённая с картофелем и салатом",
          ingredients: [
            { name: "минтай/хек", amount: 180, unit: "г", shoppingCategory: "рыба" },
            { name: "картофель", amount: 150, unit: "г", shoppingCategory: "овощи/фрукты" },
            { name: "капуста", amount: 100, unit: "г", shoppingCategory: "овощи/фрукты" }
          ],
          steps: ["Запечь рыбу и картофель в духовке 25 мин.", "Подать с салатом из капусты."],
          prepTimeMin: 30, kcal: 430, macros: { proteinG: 30, fatG: 8, carbG: 55 }
        },
        snack: {
          id: "d4-snack", name: "Яйцо варёное и огурец",
          ingredients: [
            { name: "яйцо куриное", amount: 1, unit: "шт", shoppingCategory: "яйца" },
            { name: "огурец", amount: 100, unit: "г", shoppingCategory: "овощи/фрукты" }
          ],
          steps: ["Сварить яйцо вкрутую, подать с огурцом."],
          prepTimeMin: 10, kcal: 110, macros: { proteinG: 7, fatG: 6, carbG: 4 }
        },
        dinner: {
          id: "d4-dinner", name: "Куриная грудка с тушёной капустой",
          ingredients: [
            { name: "куриная грудка", amount: 150, unit: "г", shoppingCategory: "мясо/птица" },
            { name: "капуста", amount: 150, unit: "г", shoppingCategory: "овощи/фрукты" },
            { name: "морковь", amount: 50, unit: "г", shoppingCategory: "овощи/фрукты" }
          ],
          steps: ["Отварить или запечь грудку.", "Потушить капусту с морковью 15 мин."],
          prepTimeMin: 25, kcal: 300, macros: { proteinG: 35, fatG: 6, carbG: 15 }
        }
      }
    },
    {
      cycleDay: 5,
      meals: {
        breakfast: {
          id: "d5-breakfast", name: "Сырники из творога (духовка) с йогуртом",
          ingredients: [
            { name: "творог 5%", amount: 150, unit: "г", shoppingCategory: "молочное" },
            { name: "яйцо куриное", amount: 1, unit: "шт", shoppingCategory: "яйца" },
            { name: "мука цельнозерновая", amount: 20, unit: "г", shoppingCategory: "бакалея" },
            { name: "йогурт натуральный", amount: 80, unit: "г", shoppingCategory: "молочное" }
          ],
          steps: ["Смешать творог, яйцо и муку.", "Сформировать сырники, запечь 15-20 мин при 180°C.", "Подать с йогуртом."],
          prepTimeMin: 25, kcal: 350, macros: { proteinG: 26, fatG: 10, carbG: 35 }
        },
        lunch: {
          id: "d5-lunch", name: "Индейка с гречкой и свежими овощами",
          ingredients: [
            { name: "филе индейки", amount: 150, unit: "г", shoppingCategory: "мясо/птица" },
            { name: "гречка", amount: 60, unit: "г", shoppingCategory: "крупы" },
            { name: "помидор", amount: 100, unit: "г", shoppingCategory: "овощи/фрукты" }
          ],
          steps: ["Обжарить индейку на сухой сковороде.", "Отварить гречку.", "Нарезать помидор."],
          prepTimeMin: 30, kcal: 440, macros: { proteinG: 35, fatG: 9, carbG: 45 }
        },
        snack: {
          id: "d5-snack", name: "Кефир с яблоком",
          ingredients: [
            { name: "кефир 1%", amount: 200, unit: "мл", shoppingCategory: "молочное" },
            { name: "яблоко", amount: 100, unit: "г", shoppingCategory: "овощи/фрукты" }
          ],
          steps: ["Выпить кефир, съесть яблоко."],
          prepTimeMin: 2, kcal: 170, macros: { proteinG: 6, fatG: 2, carbG: 28 }
        },
        dinner: {
          id: "d5-dinner", name: "Овощное рагу с куриной грудкой",
          ingredients: [
            { name: "кабачок", amount: 100, unit: "г", shoppingCategory: "овощи/фрукты" },
            { name: "баклажан", amount: 100, unit: "г", shoppingCategory: "овощи/фрукты" },
            { name: "морковь", amount: 50, unit: "г", shoppingCategory: "овощи/фрукты" },
            { name: "куриная грудка", amount: 120, unit: "г", shoppingCategory: "мясо/птица" }
          ],
          steps: ["Потушить овощи 15 мин.", "Отдельно отварить или запечь грудку, нарезать, смешать."],
          prepTimeMin: 30, kcal: 310, macros: { proteinG: 28, fatG: 8, carbG: 20 }
        }
      }
    },
    {
      cycleDay: 6,
      meals: {
        breakfast: {
          id: "d6-breakfast", name: "Омлет с овощами и хлебцем",
          ingredients: [
            { name: "яйцо куриное", amount: 2, unit: "шт", shoppingCategory: "яйца" },
            { name: "помидор", amount: 80, unit: "г", shoppingCategory: "овощи/фрукты" },
            { name: "хлебцы цельнозерновые", amount: 1, unit: "шт", shoppingCategory: "бакалея" }
          ],
          steps: ["Взбить яйца с нарезанным помидором.", "Обжарить на сковороде под крышкой.", "Подать с хлебцем."],
          prepTimeMin: 15, kcal: 280, macros: { proteinG: 17, fatG: 15, carbG: 15 }
        },
        lunch: {
          id: "d6-lunch", name: "Куриный суп с овощами и рисом",
          ingredients: [
            { name: "куриная грудка", amount: 120, unit: "г", shoppingCategory: "мясо/птица" },
            { name: "рис", amount: 40, unit: "г", shoppingCategory: "крупы" },
            { name: "морковь", amount: 50, unit: "г", shoppingCategory: "овощи/фрукты" },
            { name: "картофель", amount: 100, unit: "г", shoppingCategory: "овощи/фрукты" }
          ],
          steps: ["Отварить бульон с курицей.", "Добавить рис, картофель и морковь, варить до готовности."],
          prepTimeMin: 35, kcal: 400, macros: { proteinG: 30, fatG: 6, carbG: 50 }
        },
        snack: {
          id: "d6-snack", name: "Творог с бананом",
          ingredients: [
            { name: "творог 2%", amount: 120, unit: "г", shoppingCategory: "молочное" },
            { name: "банан", amount: 80, unit: "г", shoppingCategory: "овощи/фрукты" }
          ],
          steps: ["Размять банан, смешать с творогом."],
          prepTimeMin: 3, kcal: 180, macros: { proteinG: 16, fatG: 2, carbG: 25 }
        },
        dinner: {
          id: "d6-dinner", name: "Запечённая рыба с овощным салатом",
          ingredients: [
            { name: "минтай/хек", amount: 180, unit: "г", shoppingCategory: "рыба" },
            { name: "огурец", amount: 100, unit: "г", shoppingCategory: "овощи/фрукты" },
            { name: "капуста", amount: 100, unit: "г", shoppingCategory: "овощи/фрукты" }
          ],
          steps: ["Запечь рыбу при 200°C 20 мин.", "Подать с салатом из огурца и капусты."],
          prepTimeMin: 25, kcal: 290, macros: { proteinG: 28, fatG: 8, carbG: 12 }
        }
      }
    },
    {
      cycleDay: 7,
      meals: {
        breakfast: {
          id: "d7-breakfast", name: "Овсянка с яблоком и орехами",
          ingredients: [
            { name: "овсяные хлопья", amount: 50, unit: "г", shoppingCategory: "крупы" },
            { name: "яблоко", amount: 100, unit: "г", shoppingCategory: "овощи/фрукты" },
            { name: "грецкий орех", amount: 10, unit: "г", shoppingCategory: "бакалея" }
          ],
          steps: ["Сварить овсянку на воде.", "Добавить нарезанное яблоко и орехи."],
          prepTimeMin: 15, kcal: 330, macros: { proteinG: 9, fatG: 10, carbG: 52 }
        },
        lunch: {
          id: "d7-lunch", name: "Индейка тушёная с булгуром и салатом",
          ingredients: [
            { name: "филе индейки", amount: 150, unit: "г", shoppingCategory: "мясо/птица" },
            { name: "булгур", amount: 60, unit: "г", shoppingCategory: "крупы" },
            { name: "огурец", amount: 100, unit: "г", shoppingCategory: "овощи/фрукты" }
          ],
          steps: ["Потушить индейку с луком 20 мин.", "Отварить булгур.", "Нарезать салат из огурца."],
          prepTimeMin: 30, kcal: 440, macros: { proteinG: 34, fatG: 9, carbG: 46 }
        },
        snack: {
          id: "d7-snack", name: "Йогурт натуральный с ягодами",
          ingredients: [
            { name: "йогурт натуральный", amount: 150, unit: "г", shoppingCategory: "молочное" },
            { name: "ягоды замороженные", amount: 50, unit: "г", shoppingCategory: "овощи/фрукты" }
          ],
          steps: ["Смешать йогурт с ягодами."],
          prepTimeMin: 3, kcal: 150, macros: { proteinG: 8, fatG: 5, carbG: 18 }
        },
        dinner: {
          id: "d7-dinner", name: "Омлет с грибами и зеленью",
          ingredients: [
            { name: "яйцо куриное", amount: 2, unit: "шт", shoppingCategory: "яйца" },
            { name: "шампиньоны", amount: 100, unit: "г", shoppingCategory: "овощи/фрукты" },
            { name: "лук", amount: 30, unit: "г", shoppingCategory: "овощи/фрукты" }
          ],
          steps: ["Обжарить грибы с луком.", "Залить взбитыми яйцами, готовить под крышкой."],
          prepTimeMin: 15, kcal: 250, macros: { proteinG: 17, fatG: 15, carbG: 8 }
        }
      }
    },
    {
      cycleDay: 8,
      meals: {
        breakfast: {
          id: "d8-breakfast", name: "Творожная запеканка с йогуртом",
          ingredients: [
            { name: "творог 5%", amount: 150, unit: "г", shoppingCategory: "молочное" },
            { name: "яйцо куриное", amount: 1, unit: "шт", shoppingCategory: "яйца" },
            { name: "манная крупа", amount: 15, unit: "г", shoppingCategory: "бакалея" },
            { name: "йогурт натуральный", amount: 80, unit: "г", shoppingCategory: "молочное" }
          ],
          steps: ["Смешать творог, яйцо и манку.", "Запечь 25 мин при 180°C.", "Подать с йогуртом."],
          prepTimeMin: 35, kcal: 350, macros: { proteinG: 25, fatG: 10, carbG: 34 }
        },
        lunch: {
          id: "d8-lunch", name: "Курица с рисом и овощами гриль",
          ingredients: [
            { name: "куриная грудка", amount: 150, unit: "г", shoppingCategory: "мясо/птица" },
            { name: "рис", amount: 60, unit: "г", shoppingCategory: "крупы" },
            { name: "кабачок", amount: 100, unit: "г", shoppingCategory: "овощи/фрукты" }
          ],
          steps: ["Обжарить грудку на сухой сковороде.", "Отварить рис.", "Обжарить кабачок на гриле-сковороде."],
          prepTimeMin: 30, kcal: 450, macros: { proteinG: 36, fatG: 9, carbG: 48 }
        },
        snack: {
          id: "d8-snack", name: "Кефир с хлебцем",
          ingredients: [
            { name: "кефир 1%", amount: 200, unit: "мл", shoppingCategory: "молочное" },
            { name: "хлебцы цельнозерновые", amount: 1, unit: "шт", shoppingCategory: "бакалея" }
          ],
          steps: ["Выпить кефир с хлебцем."],
          prepTimeMin: 2, kcal: 140, macros: { proteinG: 6, fatG: 2, carbG: 20 }
        },
        dinner: {
          id: "d8-dinner", name: "Чечевичный суп с овощами",
          ingredients: [
            { name: "чечевица", amount: 60, unit: "г", shoppingCategory: "крупы" },
            { name: "морковь", amount: 50, unit: "г", shoppingCategory: "овощи/фрукты" },
            { name: "лук", amount: 40, unit: "г", shoppingCategory: "овощи/фрукты" },
            { name: "картофель", amount: 80, unit: "г", shoppingCategory: "овощи/фрукты" }
          ],
          steps: ["Отварить чечевицу с овощами до готовности 25-30 мин."],
          prepTimeMin: 35, kcal: 280, macros: { proteinG: 15, fatG: 3, carbG: 48 }
        }
      }
    },
    {
      cycleDay: 9,
      meals: {
        breakfast: {
          id: "d9-breakfast", name: "Гречка с творогом",
          ingredients: [
            { name: "гречка", amount: 50, unit: "г", shoppingCategory: "крупы" },
            { name: "творог 5%", amount: 100, unit: "г", shoppingCategory: "молочное" }
          ],
          steps: ["Отварить гречку на воде.", "Подать с творогом."],
          prepTimeMin: 20, kcal: 320, macros: { proteinG: 20, fatG: 8, carbG: 42 }
        },
        lunch: {
          id: "d9-lunch", name: "Рыба с картофелем и капустным салатом",
          ingredients: [
            { name: "минтай/хек", amount: 180, unit: "г", shoppingCategory: "рыба" },
            { name: "картофель", amount: 150, unit: "г", shoppingCategory: "овощи/фрукты" },
            { name: "капуста", amount: 100, unit: "г", shoppingCategory: "овощи/фрукты" }
          ],
          steps: ["Отварить или запечь рыбу.", "Отварить картофель.", "Сделать салат из капусты."],
          prepTimeMin: 30, kcal: 420, macros: { proteinG: 29, fatG: 7, carbG: 55 }
        },
        snack: {
          id: "d9-snack", name: "Яблоко с горстью орехов",
          ingredients: [
            { name: "яблоко", amount: 100, unit: "г", shoppingCategory: "овощи/фрукты" },
            { name: "грецкий орех", amount: 15, unit: "г", shoppingCategory: "бакалея" }
          ],
          steps: ["Съесть вместе."],
          prepTimeMin: 1, kcal: 170, macros: { proteinG: 3, fatG: 11, carbG: 15 }
        },
        dinner: {
          id: "d9-dinner", name: "Куриная грудка с тушёными овощами",
          ingredients: [
            { name: "куриная грудка", amount: 150, unit: "г", shoppingCategory: "мясо/птица" },
            { name: "кабачок", amount: 100, unit: "г", shoppingCategory: "овощи/фрукты" },
            { name: "морковь", amount: 50, unit: "г", shoppingCategory: "овощи/фрукты" }
          ],
          steps: ["Отварить или запечь грудку.", "Потушить овощи 15 мин."],
          prepTimeMin: 25, kcal: 300, macros: { proteinG: 35, fatG: 6, carbG: 15 }
        }
      }
    },
    {
      cycleDay: 10,
      meals: {
        breakfast: {
          id: "d10-breakfast", name: "Овсянка с бананом и корицей",
          ingredients: [
            { name: "овсяные хлопья", amount: 50, unit: "г", shoppingCategory: "крупы" },
            { name: "банан", amount: 100, unit: "г", shoppingCategory: "овощи/фрукты" }
          ],
          steps: ["Сварить овсянку на воде.", "Добавить нарезанный банан и корицу."],
          prepTimeMin: 15, kcal: 330, macros: { proteinG: 8, fatG: 4, carbG: 62 }
        },
        lunch: {
          id: "d10-lunch", name: "Индейка с рисом и овощным салатом",
          ingredients: [
            { name: "филе индейки", amount: 150, unit: "г", shoppingCategory: "мясо/птица" },
            { name: "рис", amount: 60, unit: "г", shoppingCategory: "крупы" },
            { name: "помидор", amount: 100, unit: "г", shoppingCategory: "овощи/фрукты" }
          ],
          steps: ["Обжарить индейку на сухой сковороде.", "Отварить рис.", "Нарезать салат из помидора."],
          prepTimeMin: 30, kcal: 440, macros: { proteinG: 34, fatG: 9, carbG: 48 }
        },
        snack: {
          id: "d10-snack", name: "Творог с ягодами",
          ingredients: [
            { name: "творог 2%", amount: 120, unit: "г", shoppingCategory: "молочное" },
            { name: "ягоды замороженные", amount: 60, unit: "г", shoppingCategory: "овощи/фрукты" }
          ],
          steps: ["Смешать творог с ягодами."],
          prepTimeMin: 3, kcal: 150, macros: { proteinG: 18, fatG: 3, carbG: 12 }
        },
        dinner: {
          id: "d10-dinner", name: "Овощное рагу с яйцом",
          ingredients: [
            { name: "кабачок", amount: 100, unit: "г", shoppingCategory: "овощи/фрукты" },
            { name: "баклажан", amount: 100, unit: "г", shoppingCategory: "овощи/фрукты" },
            { name: "яйцо куриное", amount: 1, unit: "шт", shoppingCategory: "яйца" }
          ],
          steps: ["Потушить овощи 15 мин.", "Вбить яйцо, перемешать и довести до готовности."],
          prepTimeMin: 20, kcal: 230, macros: { proteinG: 10, fatG: 12, carbG: 18 }
        }
      }
    }
  ],
  alternatives: ALTERNATIVES
};
