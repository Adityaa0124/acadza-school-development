/**
 * Comprehensive Chapter-Mapped Question Bank for School Admission CBT Tests (Grades 6 to 12).
 * Rule: Questions are drawn strictly from the prerequisite standard of the target admission class.
 * Every question maps 1:1 with chapter IDs in syllabusData.js.
 * Guarantees complete coverage across all subjects and chapters.
 */

export const CBT_QUESTION_BANK = [
    {
        "id": "Q-5-MAT-001",
        "testGrade": "5",
        "targetGrade": "6",
        "subject": "maths",
        "subjectName": "Mathematics",
        "chapterId": "m5-ch1",
        "chapterName": "Large Numbers & Place Value",
        "topic": "Indian & International systems",
        "questionText": "In the number 4,72,508, what is the place value of the digit 7 in the Indian place value system?",
        "options": [
            {
                "key": "A",
                "text": "7,000"
            },
            {
                "key": "B",
                "text": "70,000"
            },
            {
                "key": "C",
                "text": "700"
            },
            {
                "key": "D",
                "text": "7,00,000"
            }
        ],
        "correctOption": "B",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Easy",
        "explanation": "7 is at ten-thousands place: 7 × 10,000 = 70,000."
    },
    {
        "id": "Q-5-MAT-002",
        "testGrade": "5",
        "targetGrade": "6",
        "subject": "maths",
        "subjectName": "Mathematics",
        "chapterId": "m5-ch1",
        "chapterName": "Large Numbers & Place Value",
        "topic": "Rounding off & estimation",
        "questionText": "When 48,652 is rounded off to the nearest thousand, what is the resulting number?",
        "options": [
            {
                "key": "A",
                "text": "48,000"
            },
            {
                "key": "B",
                "text": "48,600"
            },
            {
                "key": "C",
                "text": "49,000"
            },
            {
                "key": "D",
                "text": "50,000"
            }
        ],
        "correctOption": "C",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Easy",
        "explanation": "Hundreds digit is 6 ≥ 5, so round up to 49,000."
    },
    {
        "id": "Q-5-MAT-003",
        "testGrade": "5",
        "targetGrade": "6",
        "subject": "maths",
        "subjectName": "Mathematics",
        "chapterId": "m5-ch1",
        "chapterName": "Large Numbers & Place Value",
        "topic": "Numbers up to 7-8 digits",
        "questionText": "What is the predecessor of the smallest 6-digit number?",
        "options": [
            {
                "key": "A",
                "text": "99,999"
            },
            {
                "key": "B",
                "text": "1,00,001"
            },
            {
                "key": "C",
                "text": "9,99,999"
            },
            {
                "key": "D",
                "text": "10,000"
            }
        ],
        "correctOption": "A",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Easy",
        "explanation": "Smallest 6-digit number is 1,00,000. 1,00,000 - 1 = 99,999."
    },
    {
        "id": "Q-5-MAT-004",
        "testGrade": "5",
        "targetGrade": "6",
        "subject": "maths",
        "subjectName": "Mathematics",
        "chapterId": "m5-ch2",
        "chapterName": "Factors and Multiples",
        "topic": "HCF & LCM word problems",
        "questionText": "What is the Lowest Common Multiple (LCM) of 12 and 18?",
        "options": [
            {
                "key": "A",
                "text": "6"
            },
            {
                "key": "B",
                "text": "24"
            },
            {
                "key": "C",
                "text": "36"
            },
            {
                "key": "D",
                "text": "72"
            }
        ],
        "correctOption": "C",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Easy",
        "explanation": "LCM(12, 18) = 36."
    },
    {
        "id": "Q-5-MAT-005",
        "testGrade": "5",
        "targetGrade": "6",
        "subject": "maths",
        "subjectName": "Mathematics",
        "chapterId": "m5-ch2",
        "chapterName": "Factors and Multiples",
        "topic": "Divisibility rules",
        "questionText": "Which of the following numbers is divisible by both 3 and 5?",
        "options": [
            {
                "key": "A",
                "text": "125"
            },
            {
                "key": "B",
                "text": "235"
            },
            {
                "key": "C",
                "text": "315"
            },
            {
                "key": "D",
                "text": "400"
            }
        ],
        "correctOption": "C",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Easy",
        "explanation": "315 ends in 5 and sum of digits 3+1+5=9 is divisible by 3."
    },
    {
        "id": "Q-5-MAT-006",
        "testGrade": "5",
        "targetGrade": "6",
        "subject": "maths",
        "subjectName": "Mathematics",
        "chapterId": "m5-ch2",
        "chapterName": "Factors and Multiples",
        "topic": "Prime & Composite numbers",
        "questionText": "Which of the following numbers is a prime number?",
        "options": [
            {
                "key": "A",
                "text": "27"
            },
            {
                "key": "B",
                "text": "31"
            },
            {
                "key": "C",
                "text": "39"
            },
            {
                "key": "D",
                "text": "51"
            }
        ],
        "correctOption": "B",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Easy",
        "explanation": "31 has only factors 1 and 31."
    },
    {
        "id": "Q-5-MAT-007",
        "testGrade": "5",
        "targetGrade": "6",
        "subject": "maths",
        "subjectName": "Mathematics",
        "chapterId": "m5-ch3",
        "chapterName": "Fractions & Operations",
        "topic": "Addition of fractions",
        "questionText": "Evaluate: 3/4 + 1/2 = ?",
        "options": [
            {
                "key": "A",
                "text": "4/6"
            },
            {
                "key": "B",
                "text": "5/4"
            },
            {
                "key": "C",
                "text": "1"
            },
            {
                "key": "D",
                "text": "3/8"
            }
        ],
        "correctOption": "B",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Medium",
        "explanation": "3/4 + 2/4 = 5/4."
    },
    {
        "id": "Q-5-MAT-008",
        "testGrade": "5",
        "targetGrade": "6",
        "subject": "maths",
        "subjectName": "Mathematics",
        "chapterId": "m5-ch3",
        "chapterName": "Fractions & Operations",
        "topic": "Equivalent fractions",
        "questionText": "Which fraction is equivalent to 3/5?",
        "options": [
            {
                "key": "A",
                "text": "6/15"
            },
            {
                "key": "B",
                "text": "9/15"
            },
            {
                "key": "C",
                "text": "12/25"
            },
            {
                "key": "D",
                "text": "15/20"
            }
        ],
        "correctOption": "B",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Easy",
        "explanation": "(3 × 3)/(5 × 3) = 9/15."
    },
    {
        "id": "Q-5-MAT-009",
        "testGrade": "5",
        "targetGrade": "6",
        "subject": "maths",
        "subjectName": "Mathematics",
        "chapterId": "m5-ch4",
        "chapterName": "Decimals in Daily Life",
        "topic": "Decimal addition",
        "questionText": "A pen costs Rs 14.50 and a ruler costs Rs 7.25. What is the total cost?",
        "options": [
            {
                "key": "A",
                "text": "Rs 21.75"
            },
            {
                "key": "B",
                "text": "Rs 21.50"
            },
            {
                "key": "C",
                "text": "Rs 22.00"
            },
            {
                "key": "D",
                "text": "Rs 22.25"
            }
        ],
        "correctOption": "A",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Easy",
        "explanation": "14.50 + 7.25 = 21.75."
    },
    {
        "id": "Q-5-MAT-010",
        "testGrade": "5",
        "targetGrade": "6",
        "subject": "maths",
        "subjectName": "Mathematics",
        "chapterId": "m5-ch4",
        "chapterName": "Decimals in Daily Life",
        "topic": "Place value",
        "questionText": "In 35.68, what is the place value of the digit 8?",
        "options": [
            {
                "key": "A",
                "text": "8 units"
            },
            {
                "key": "B",
                "text": "8 tenths"
            },
            {
                "key": "C",
                "text": "8 hundredths"
            },
            {
                "key": "D",
                "text": "8 thousandths"
            }
        ],
        "correctOption": "C",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Easy",
        "explanation": "8 is in the hundredths place (0.08)."
    },
    {
        "id": "Q-5-MAT-011",
        "testGrade": "5",
        "targetGrade": "6",
        "subject": "maths",
        "subjectName": "Mathematics",
        "chapterId": "m5-ch5",
        "chapterName": "Shapes, Angles & Perimeter",
        "topic": "Perimeter of rectangle",
        "questionText": "Find the perimeter of a rectangle of length 12 cm and breadth 5 cm:",
        "options": [
            {
                "key": "A",
                "text": "17 cm"
            },
            {
                "key": "B",
                "text": "34 cm"
            },
            {
                "key": "C",
                "text": "60 cm"
            },
            {
                "key": "D",
                "text": "24 cm"
            }
        ],
        "correctOption": "B",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Easy",
        "explanation": "2 × (12 + 5) = 34 cm."
    },
    {
        "id": "Q-5-MAT-012",
        "testGrade": "5",
        "targetGrade": "6",
        "subject": "maths",
        "subjectName": "Mathematics",
        "chapterId": "m5-ch5",
        "chapterName": "Shapes, Angles & Perimeter",
        "topic": "Angles",
        "questionText": "An angle measuring 90 degrees is known as a/an:",
        "options": [
            {
                "key": "A",
                "text": "Acute angle"
            },
            {
                "key": "B",
                "text": "Right angle"
            },
            {
                "key": "C",
                "text": "Obtuse angle"
            },
            {
                "key": "D",
                "text": "Straight angle"
            }
        ],
        "correctOption": "B",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Easy",
        "explanation": "An exact 90° angle is a right angle."
    },
    {
        "id": "Q-5-MAT-013",
        "testGrade": "5",
        "targetGrade": "6",
        "subject": "maths",
        "subjectName": "Mathematics",
        "chapterId": "m5-ch6",
        "chapterName": "Measurement & Unit Conversions",
        "topic": "Unit conversion",
        "questionText": "How many grams are there in 2.5 kilograms?",
        "options": [
            {
                "key": "A",
                "text": "250 g"
            },
            {
                "key": "B",
                "text": "2,050 g"
            },
            {
                "key": "C",
                "text": "2,500 g"
            },
            {
                "key": "D",
                "text": "25,000 g"
            }
        ],
        "correctOption": "C",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Easy",
        "explanation": "2.5 × 1,000 = 2,500 g."
    },
    {
        "id": "Q-5-SCI-014",
        "testGrade": "5",
        "targetGrade": "6",
        "subject": "science",
        "subjectName": "General Science & EVS",
        "chapterId": "s5-ch1",
        "chapterName": "Super Senses & Animal Life",
        "topic": "Sensory adaptations",
        "questionText": "Which animal uses echolocation to fly safely at night?",
        "options": [
            {
                "key": "A",
                "text": "Bat"
            },
            {
                "key": "B",
                "text": "Eagle"
            },
            {
                "key": "C",
                "text": "Owl"
            },
            {
                "key": "D",
                "text": "Hawk"
            }
        ],
        "correctOption": "A",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Easy",
        "explanation": "Bats emit ultrasonic echoes."
    },
    {
        "id": "Q-5-SCI-015",
        "testGrade": "5",
        "targetGrade": "6",
        "subject": "science",
        "subjectName": "General Science & EVS",
        "chapterId": "s5-ch2",
        "chapterName": "From Tasting to Digesting",
        "topic": "Digestive process",
        "questionText": "Digestion of starch begins in which part of the body?",
        "options": [
            {
                "key": "A",
                "text": "Mouth"
            },
            {
                "key": "B",
                "text": "Stomach"
            },
            {
                "key": "C",
                "text": "Small Intestine"
            },
            {
                "key": "D",
                "text": "Liver"
            }
        ],
        "correctOption": "A",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Easy",
        "explanation": "Saliva contains amylase."
    },
    {
        "id": "Q-5-SCI-016",
        "testGrade": "5",
        "targetGrade": "6",
        "subject": "science",
        "subjectName": "General Science & EVS",
        "chapterId": "s5-ch3",
        "chapterName": "Seeds and Seed Dispersal",
        "topic": "Seed dispersal",
        "questionText": "Dandelion seeds are dispersed primarily by:",
        "options": [
            {
                "key": "A",
                "text": "Wind"
            },
            {
                "key": "B",
                "text": "Water"
            },
            {
                "key": "C",
                "text": "Animals"
            },
            {
                "key": "D",
                "text": "Gravity"
            }
        ],
        "correctOption": "A",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Easy",
        "explanation": "Fluffy parachutes allow wind dispersal."
    },
    {
        "id": "Q-5-SCI-017",
        "testGrade": "5",
        "targetGrade": "6",
        "subject": "science",
        "subjectName": "General Science & EVS",
        "chapterId": "s5-ch4",
        "chapterName": "Water & Its Properties",
        "topic": "States of water",
        "questionText": "The process in which water vapor cools down to form liquid droplets is called:",
        "options": [
            {
                "key": "A",
                "text": "Evaporation"
            },
            {
                "key": "B",
                "text": "Condensation"
            },
            {
                "key": "C",
                "text": "Freezing"
            },
            {
                "key": "D",
                "text": "Melting"
            }
        ],
        "correctOption": "B",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Easy",
        "explanation": "Condensation forms liquid drops from vapor."
    },
    {
        "id": "Q-5-SCI-018",
        "testGrade": "5",
        "targetGrade": "6",
        "subject": "science",
        "subjectName": "General Science & EVS",
        "chapterId": "s5-ch5",
        "chapterName": "Sun, Moon & Space",
        "topic": "Earth motion",
        "questionText": "Earth completes one full rotation on its axis in approximately:",
        "options": [
            {
                "key": "A",
                "text": "12 hours"
            },
            {
                "key": "B",
                "text": "24 hours"
            },
            {
                "key": "C",
                "text": "30 days"
            },
            {
                "key": "D",
                "text": "365 days"
            }
        ],
        "correctOption": "B",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Easy",
        "explanation": "Earth rotates once in 24 hours."
    },
    {
        "id": "Q-5-APT-019",
        "testGrade": "5",
        "targetGrade": "6",
        "subject": "aptitude",
        "subjectName": "Mental Ability",
        "chapterId": "a5-ch1",
        "chapterName": "Patterns & Reasoning",
        "topic": "Number pattern",
        "questionText": "Find next term in series: 5, 10, 20, 40, ?",
        "options": [
            {
                "key": "A",
                "text": "60"
            },
            {
                "key": "B",
                "text": "70"
            },
            {
                "key": "C",
                "text": "80"
            },
            {
                "key": "D",
                "text": "100"
            }
        ],
        "correctOption": "C",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Easy",
        "explanation": "Each term is doubled: 40 × 2 = 80."
    },
    {
        "id": "Q-5-APT-020",
        "testGrade": "5",
        "targetGrade": "6",
        "subject": "aptitude",
        "subjectName": "Mental Ability",
        "chapterId": "a5-ch1",
        "chapterName": "Patterns & Reasoning",
        "topic": "Odd one out",
        "questionText": "Choose the odd one out: Apple, Mango, Carrot, Banana",
        "options": [
            {
                "key": "A",
                "text": "Apple"
            },
            {
                "key": "B",
                "text": "Mango"
            },
            {
                "key": "C",
                "text": "Carrot"
            },
            {
                "key": "D",
                "text": "Banana"
            }
        ],
        "correctOption": "C",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Easy",
        "explanation": "Carrot is a root vegetable; the others are fruits."
    },
    {
        "id": "Q-6-MAT-021",
        "testGrade": "6",
        "targetGrade": "7",
        "subject": "maths",
        "subjectName": "Mathematics",
        "chapterId": "m6-ch1",
        "chapterName": "Knowing Our Numbers",
        "topic": "Roman Numerals",
        "questionText": "What is the value of Roman numeral XLIV?",
        "options": [
            {
                "key": "A",
                "text": "44"
            },
            {
                "key": "B",
                "text": "46"
            },
            {
                "key": "C",
                "text": "64"
            },
            {
                "key": "D",
                "text": "54"
            }
        ],
        "correctOption": "A",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Easy",
        "explanation": "XL (40) + IV (4) = 44."
    },
    {
        "id": "Q-6-MAT-022",
        "testGrade": "6",
        "targetGrade": "7",
        "subject": "maths",
        "subjectName": "Mathematics",
        "chapterId": "m6-ch2",
        "chapterName": "Whole Numbers & Integers",
        "topic": "Operations on integers",
        "questionText": "Evaluate: (-25) + 14 - (-11)",
        "options": [
            {
                "key": "A",
                "text": "-22"
            },
            {
                "key": "B",
                "text": "0"
            },
            {
                "key": "C",
                "text": "-2"
            },
            {
                "key": "D",
                "text": "2"
            }
        ],
        "correctOption": "B",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Medium",
        "explanation": "-25 + 14 + 11 = -25 + 25 = 0."
    },
    {
        "id": "Q-6-MAT-023",
        "testGrade": "6",
        "targetGrade": "7",
        "subject": "maths",
        "subjectName": "Mathematics",
        "chapterId": "m6-ch3",
        "chapterName": "Playing with Numbers",
        "topic": "HCF",
        "questionText": "What is the HCF of 24 and 36?",
        "options": [
            {
                "key": "A",
                "text": "6"
            },
            {
                "key": "B",
                "text": "12"
            },
            {
                "key": "C",
                "text": "18"
            },
            {
                "key": "D",
                "text": "24"
            }
        ],
        "correctOption": "B",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Easy",
        "explanation": "12 divides both 24 and 36."
    },
    {
        "id": "Q-6-MAT-024",
        "testGrade": "6",
        "targetGrade": "7",
        "subject": "maths",
        "subjectName": "Mathematics",
        "chapterId": "m6-ch4",
        "chapterName": "Fractions & Decimals",
        "topic": "Decimal product",
        "questionText": "Find 0.04 × 0.5:",
        "options": [
            {
                "key": "A",
                "text": "0.2"
            },
            {
                "key": "B",
                "text": "0.02"
            },
            {
                "key": "C",
                "text": "0.002"
            },
            {
                "key": "D",
                "text": "0.0002"
            }
        ],
        "correctOption": "B",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Easy",
        "explanation": "4 × 5 = 20. With 3 decimal places: 0.020 = 0.02."
    },
    {
        "id": "Q-6-MAT-025",
        "testGrade": "6",
        "targetGrade": "7",
        "subject": "maths",
        "subjectName": "Mathematics",
        "chapterId": "m6-ch5",
        "chapterName": "Introduction to Algebra",
        "topic": "Linear variable",
        "questionText": "If 2y + 7 = 19, find y:",
        "options": [
            {
                "key": "A",
                "text": "5"
            },
            {
                "key": "B",
                "text": "6"
            },
            {
                "key": "C",
                "text": "7"
            },
            {
                "key": "D",
                "text": "8"
            }
        ],
        "correctOption": "B",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Easy",
        "explanation": "2y = 12 => y = 6."
    },
    {
        "id": "Q-6-MAT-026",
        "testGrade": "6",
        "targetGrade": "7",
        "subject": "maths",
        "subjectName": "Mathematics",
        "chapterId": "m6-ch6",
        "chapterName": "Basic Geometry & Mensuration",
        "topic": "Perimeter of equilateral triangle",
        "questionText": "An equilateral triangle has side 7 cm. Its perimeter is:",
        "options": [
            {
                "key": "A",
                "text": "14 cm"
            },
            {
                "key": "B",
                "text": "21 cm"
            },
            {
                "key": "C",
                "text": "28 cm"
            },
            {
                "key": "D",
                "text": "49 cm"
            }
        ],
        "correctOption": "B",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Easy",
        "explanation": "3 × 7 = 21 cm."
    },
    {
        "id": "Q-6-SCI-027",
        "testGrade": "6",
        "targetGrade": "7",
        "subject": "science",
        "subjectName": "General Science",
        "chapterId": "s6-ch1",
        "chapterName": "Components of Food",
        "topic": "Vitamins",
        "questionText": "Deficiency of Vitamin C leads to which disease?",
        "options": [
            {
                "key": "A",
                "text": "Rickets"
            },
            {
                "key": "B",
                "text": "Scurvy"
            },
            {
                "key": "C",
                "text": "Beriberi"
            },
            {
                "key": "D",
                "text": "Goitre"
            }
        ],
        "correctOption": "B",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Easy",
        "explanation": "Scurvy is caused by Vitamin C deficiency."
    },
    {
        "id": "Q-6-SCI-028",
        "testGrade": "6",
        "targetGrade": "7",
        "subject": "science",
        "subjectName": "General Science",
        "chapterId": "s6-ch2",
        "chapterName": "Separation of Substances",
        "topic": "Filtration",
        "questionText": "A mixture of sand and water is most cleanly separated using:",
        "options": [
            {
                "key": "A",
                "text": "Sedimentation & Filtration"
            },
            {
                "key": "B",
                "text": "Evaporation"
            },
            {
                "key": "C",
                "text": "Threshing"
            },
            {
                "key": "D",
                "text": "Handpicking"
            }
        ],
        "correctOption": "A",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Easy",
        "explanation": "Filtration removes insoluble sand."
    },
    {
        "id": "Q-6-SCI-029",
        "testGrade": "6",
        "targetGrade": "7",
        "subject": "science",
        "subjectName": "General Science",
        "chapterId": "s6-ch3",
        "chapterName": "Getting to Know Plants",
        "topic": "Photosynthesis",
        "questionText": "The green pigment present in leaves essential for photosynthesis is:",
        "options": [
            {
                "key": "A",
                "text": "Carotene"
            },
            {
                "key": "B",
                "text": "Chlorophyll"
            },
            {
                "key": "C",
                "text": "Xanthophyll"
            },
            {
                "key": "D",
                "text": "Anthocyanin"
            }
        ],
        "correctOption": "B",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Easy",
        "explanation": "Chlorophyll traps sunlight."
    },
    {
        "id": "Q-6-SCI-030",
        "testGrade": "6",
        "targetGrade": "7",
        "subject": "science",
        "subjectName": "General Science",
        "chapterId": "s6-ch4",
        "chapterName": "Motion & Measurement",
        "topic": "Standard units",
        "questionText": "The SI unit of length is:",
        "options": [
            {
                "key": "A",
                "text": "Centimetre"
            },
            {
                "key": "B",
                "text": "Metre"
            },
            {
                "key": "C",
                "text": "Kilometre"
            },
            {
                "key": "D",
                "text": "Foot"
            }
        ],
        "correctOption": "B",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Easy",
        "explanation": "SI unit of length is the metre (m)."
    },
    {
        "id": "Q-6-SCI-031",
        "testGrade": "6",
        "targetGrade": "7",
        "subject": "science",
        "subjectName": "General Science",
        "chapterId": "s6-ch5",
        "chapterName": "Light, Shadows & Reflections",
        "topic": "Opaque objects",
        "questionText": "Shadows are cast when an opaque object blocks:",
        "options": [
            {
                "key": "A",
                "text": "Light"
            },
            {
                "key": "B",
                "text": "Sound"
            },
            {
                "key": "C",
                "text": "Air"
            },
            {
                "key": "D",
                "text": "Heat"
            }
        ],
        "correctOption": "A",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Easy",
        "explanation": "Light travels in straight lines and is obstructed."
    },
    {
        "id": "Q-6-SCI-032",
        "testGrade": "6",
        "targetGrade": "7",
        "subject": "science",
        "subjectName": "General Science",
        "chapterId": "s6-ch6",
        "chapterName": "Electricity & Magnets",
        "topic": "Magnets",
        "questionText": "Freely suspended bar magnet always aligns in which direction?",
        "options": [
            {
                "key": "A",
                "text": "East-West"
            },
            {
                "key": "B",
                "text": "North-South"
            },
            {
                "key": "C",
                "text": "North-East"
            },
            {
                "key": "D",
                "text": "South-West"
            }
        ],
        "correctOption": "B",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Easy",
        "explanation": "Aligns with Earth magnetic field (North-South)."
    },
    {
        "id": "Q-7-MAT-033",
        "testGrade": "7",
        "targetGrade": "8",
        "subject": "maths",
        "subjectName": "Mathematics",
        "chapterId": "m7-ch1",
        "chapterName": "Integers & Rational Numbers",
        "topic": "Integer operations",
        "questionText": "Evaluate: [(-36) ÷ 12] ÷ 3",
        "options": [
            {
                "key": "A",
                "text": "-1"
            },
            {
                "key": "B",
                "text": "1"
            },
            {
                "key": "C",
                "text": "-9"
            },
            {
                "key": "D",
                "text": "9"
            }
        ],
        "correctOption": "A",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Easy",
        "explanation": "(-36 ÷ 12) = -3, then -3 ÷ 3 = -1."
    },
    {
        "id": "Q-7-MAT-034",
        "testGrade": "7",
        "targetGrade": "8",
        "subject": "maths",
        "subjectName": "Mathematics",
        "chapterId": "m7-ch1",
        "chapterName": "Integers & Rational Numbers",
        "topic": "Rational number additive inverse",
        "questionText": "What is the sum of -5/9 and its additive inverse?",
        "options": [
            {
                "key": "A",
                "text": "-10/9"
            },
            {
                "key": "B",
                "text": "1"
            },
            {
                "key": "C",
                "text": "0"
            },
            {
                "key": "D",
                "text": "5/9"
            }
        ],
        "correctOption": "C",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Easy",
        "explanation": "(-5/9) + (5/9) = 0."
    },
    {
        "id": "Q-7-MAT-035",
        "testGrade": "7",
        "targetGrade": "8",
        "subject": "maths",
        "subjectName": "Mathematics",
        "chapterId": "m7-ch1",
        "chapterName": "Integers & Rational Numbers",
        "topic": "Multiplication of integers",
        "questionText": "What is the product: (-1) × (-2) × (-3) × (-4)?",
        "options": [
            {
                "key": "A",
                "text": "-24"
            },
            {
                "key": "B",
                "text": "24"
            },
            {
                "key": "C",
                "text": "-10"
            },
            {
                "key": "D",
                "text": "10"
            }
        ],
        "correctOption": "B",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Easy",
        "explanation": "Four negative signs result in positive (+24)."
    },
    {
        "id": "Q-7-MAT-036",
        "testGrade": "7",
        "targetGrade": "8",
        "subject": "maths",
        "subjectName": "Mathematics",
        "chapterId": "m7-ch1",
        "chapterName": "Integers & Rational Numbers",
        "topic": "Standard form of rational numbers",
        "questionText": "Express -28/84 in standard reduced form:",
        "options": [
            {
                "key": "A",
                "text": "-1/3"
            },
            {
                "key": "B",
                "text": "-2/7"
            },
            {
                "key": "C",
                "text": "-7/21"
            },
            {
                "key": "D",
                "text": "-1/4"
            }
        ],
        "correctOption": "A",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Easy",
        "explanation": "-28/84 = -1/3."
    },
    {
        "id": "Q-7-MAT-037",
        "testGrade": "7",
        "targetGrade": "8",
        "subject": "maths",
        "subjectName": "Mathematics",
        "chapterId": "m7-ch2",
        "chapterName": "Simple Equations",
        "topic": "One-variable equation",
        "questionText": "Solve for m: 4(m + 3) = 28",
        "options": [
            {
                "key": "A",
                "text": "3"
            },
            {
                "key": "B",
                "text": "4"
            },
            {
                "key": "C",
                "text": "5"
            },
            {
                "key": "D",
                "text": "7"
            }
        ],
        "correctOption": "B",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Easy",
        "explanation": "m + 3 = 7 => m = 4."
    },
    {
        "id": "Q-7-MAT-038",
        "testGrade": "7",
        "targetGrade": "8",
        "subject": "maths",
        "subjectName": "Mathematics",
        "chapterId": "m7-ch2",
        "chapterName": "Simple Equations",
        "topic": "Word problems",
        "questionText": "The sum of three consecutive integers is 51. The largest number is:",
        "options": [
            {
                "key": "A",
                "text": "16"
            },
            {
                "key": "B",
                "text": "17"
            },
            {
                "key": "C",
                "text": "18"
            },
            {
                "key": "D",
                "text": "19"
            }
        ],
        "correctOption": "C",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Medium",
        "explanation": "3x + 3 = 51 => x = 16. Largest = 18."
    },
    {
        "id": "Q-7-MAT-039",
        "testGrade": "7",
        "targetGrade": "8",
        "subject": "maths",
        "subjectName": "Mathematics",
        "chapterId": "m7-ch2",
        "chapterName": "Simple Equations",
        "topic": "Transposition",
        "questionText": "If 7p - 2 = 19, what is the value of 2p + 1?",
        "options": [
            {
                "key": "A",
                "text": "5"
            },
            {
                "key": "B",
                "text": "7"
            },
            {
                "key": "C",
                "text": "9"
            },
            {
                "key": "D",
                "text": "11"
            }
        ],
        "correctOption": "B",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Medium",
        "explanation": "7p = 21 => p = 3. 2(3) + 1 = 7."
    },
    {
        "id": "Q-7-MAT-040",
        "testGrade": "7",
        "targetGrade": "8",
        "subject": "maths",
        "subjectName": "Mathematics",
        "chapterId": "m7-ch3",
        "chapterName": "Lines, Angles & Triangles",
        "topic": "Supplementary angles",
        "questionText": "Two angles are supplementary. If one angle is 65°, find the other:",
        "options": [
            {
                "key": "A",
                "text": "25°"
            },
            {
                "key": "B",
                "text": "115°"
            },
            {
                "key": "C",
                "text": "125°"
            },
            {
                "key": "D",
                "text": "135°"
            }
        ],
        "correctOption": "B",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Easy",
        "explanation": "180° - 65° = 115°."
    },
    {
        "id": "Q-7-MAT-041",
        "testGrade": "7",
        "targetGrade": "8",
        "subject": "maths",
        "subjectName": "Mathematics",
        "chapterId": "m7-ch3",
        "chapterName": "Lines, Angles & Triangles",
        "topic": "Pythagoras theorem",
        "questionText": "In a right triangle, base = 6 cm and height = 8 cm. What is the hypotenuse?",
        "options": [
            {
                "key": "A",
                "text": "9 cm"
            },
            {
                "key": "B",
                "text": "10 cm"
            },
            {
                "key": "C",
                "text": "12 cm"
            },
            {
                "key": "D",
                "text": "14 cm"
            }
        ],
        "correctOption": "B",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Medium",
        "explanation": "√(6² + 8²) = √100 = 10 cm."
    },
    {
        "id": "Q-7-MAT-042",
        "testGrade": "7",
        "targetGrade": "8",
        "subject": "maths",
        "subjectName": "Mathematics",
        "chapterId": "m7-ch3",
        "chapterName": "Lines, Angles & Triangles",
        "topic": "Exterior angle property",
        "questionText": "An exterior angle of a triangle is 110° and one interior opposite angle is 45°. Find the other interior opposite angle:",
        "options": [
            {
                "key": "A",
                "text": "55°"
            },
            {
                "key": "B",
                "text": "65°"
            },
            {
                "key": "C",
                "text": "70°"
            },
            {
                "key": "D",
                "text": "75°"
            }
        ],
        "correctOption": "B",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Medium",
        "explanation": "110° - 45° = 65°."
    },
    {
        "id": "Q-7-MAT-043",
        "testGrade": "7",
        "targetGrade": "8",
        "subject": "maths",
        "subjectName": "Mathematics",
        "chapterId": "m7-ch4",
        "chapterName": "Comparing Quantities",
        "topic": "Profit percentage",
        "questionText": "An article bought for Rs 400 is sold for Rs 480. Find profit %:",
        "options": [
            {
                "key": "A",
                "text": "15%"
            },
            {
                "key": "B",
                "text": "20%"
            },
            {
                "key": "C",
                "text": "25%"
            },
            {
                "key": "D",
                "text": "16.67%"
            }
        ],
        "correctOption": "B",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Easy",
        "explanation": "(80 / 400) × 100 = 20%."
    },
    {
        "id": "Q-7-MAT-044",
        "testGrade": "7",
        "targetGrade": "8",
        "subject": "maths",
        "subjectName": "Mathematics",
        "chapterId": "m7-ch4",
        "chapterName": "Comparing Quantities",
        "topic": "Simple interest",
        "questionText": "Find SI on Rs 5,000 for 2 years at 6% per annum:",
        "options": [
            {
                "key": "A",
                "text": "Rs 500"
            },
            {
                "key": "B",
                "text": "Rs 600"
            },
            {
                "key": "C",
                "text": "Rs 720"
            },
            {
                "key": "D",
                "text": "Rs 800"
            }
        ],
        "correctOption": "B",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Easy",
        "explanation": "(5,000 × 6 × 2) / 100 = Rs 600."
    },
    {
        "id": "Q-7-MAT-045",
        "testGrade": "7",
        "targetGrade": "8",
        "subject": "maths",
        "subjectName": "Mathematics",
        "chapterId": "m7-ch4",
        "chapterName": "Comparing Quantities",
        "topic": "Ratio conversion",
        "questionText": "Convert the ratio 3:4 into a percentage:",
        "options": [
            {
                "key": "A",
                "text": "60%"
            },
            {
                "key": "B",
                "text": "70%"
            },
            {
                "key": "C",
                "text": "75%"
            },
            {
                "key": "D",
                "text": "80%"
            }
        ],
        "correctOption": "C",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Easy",
        "explanation": "(3/4) × 100 = 75%."
    },
    {
        "id": "Q-7-MAT-046",
        "testGrade": "7",
        "targetGrade": "8",
        "subject": "maths",
        "subjectName": "Mathematics",
        "chapterId": "m7-ch5",
        "chapterName": "Algebraic Expressions & Exponents",
        "topic": "Laws of exponents",
        "questionText": "Simplify: (2³ × 2⁴) ÷ 2⁵ = ?",
        "options": [
            {
                "key": "A",
                "text": "2"
            },
            {
                "key": "B",
                "text": "4"
            },
            {
                "key": "C",
                "text": "8"
            },
            {
                "key": "D",
                "text": "16"
            }
        ],
        "correctOption": "B",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Easy",
        "explanation": "2⁷ ÷ 2⁵ = 2² = 4."
    },
    {
        "id": "Q-7-MAT-047",
        "testGrade": "7",
        "targetGrade": "8",
        "subject": "maths",
        "subjectName": "Mathematics",
        "chapterId": "m7-ch5",
        "chapterName": "Algebraic Expressions & Exponents",
        "topic": "Evaluating expressions",
        "questionText": "If a = 2 and b = -1, evaluate: a² + 2ab + b²",
        "options": [
            {
                "key": "A",
                "text": "1"
            },
            {
                "key": "B",
                "text": "3"
            },
            {
                "key": "C",
                "text": "5"
            },
            {
                "key": "D",
                "text": "9"
            }
        ],
        "correctOption": "A",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Medium",
        "explanation": "(a + b)² = (2 - 1)² = 1² = 1."
    },
    {
        "id": "Q-7-MAT-048",
        "testGrade": "7",
        "targetGrade": "8",
        "subject": "maths",
        "subjectName": "Mathematics",
        "chapterId": "m7-ch6",
        "chapterName": "Perimeter and Area",
        "topic": "Area of circle",
        "questionText": "Find area of circle of radius 7 cm (π = 22/7):",
        "options": [
            {
                "key": "A",
                "text": "44 sq cm"
            },
            {
                "key": "B",
                "text": "88 sq cm"
            },
            {
                "key": "C",
                "text": "154 sq cm"
            },
            {
                "key": "D",
                "text": "308 sq cm"
            }
        ],
        "correctOption": "C",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Medium",
        "explanation": "π r² = (22/7) × 49 = 154 sq cm."
    },
    {
        "id": "Q-7-MAT-049",
        "testGrade": "7",
        "targetGrade": "8",
        "subject": "maths",
        "subjectName": "Mathematics",
        "chapterId": "m7-ch6",
        "chapterName": "Perimeter and Area",
        "topic": "Area of parallelogram",
        "questionText": "A parallelogram has base 14 cm and altitude 9 cm. Its area is:",
        "options": [
            {
                "key": "A",
                "text": "63 sq cm"
            },
            {
                "key": "B",
                "text": "116 sq cm"
            },
            {
                "key": "C",
                "text": "126 sq cm"
            },
            {
                "key": "D",
                "text": "144 sq cm"
            }
        ],
        "correctOption": "C",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Easy",
        "explanation": "Base × Height = 14 × 9 = 126 sq cm."
    },
    {
        "id": "Q-7-SCI-050",
        "testGrade": "7",
        "targetGrade": "8",
        "subject": "science",
        "subjectName": "Science",
        "chapterId": "s7-ch1",
        "chapterName": "Nutrition in Plants & Animals",
        "topic": "Stomata",
        "questionText": "Gas exchange in green plant leaves occurs through:",
        "options": [
            {
                "key": "A",
                "text": "Chloroplasts"
            },
            {
                "key": "B",
                "text": "Stomata"
            },
            {
                "key": "C",
                "text": "Xylem"
            },
            {
                "key": "D",
                "text": "Phloem"
            }
        ],
        "correctOption": "B",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Easy",
        "explanation": "Guarded stomata pores allow CO2 and O2 exchange."
    },
    {
        "id": "Q-7-SCI-051",
        "testGrade": "7",
        "targetGrade": "8",
        "subject": "science",
        "subjectName": "Science",
        "chapterId": "s7-ch1",
        "chapterName": "Nutrition in Plants & Animals",
        "topic": "Parasitic plants",
        "questionText": "Which of the following is a parasitic plant that absorbs nutrients from a host tree?",
        "options": [
            {
                "key": "A",
                "text": "Pitcher plant"
            },
            {
                "key": "B",
                "text": "Cuscuta (Amarbel)"
            },
            {
                "key": "C",
                "text": "Mushroom"
            },
            {
                "key": "D",
                "text": "Algae"
            }
        ],
        "correctOption": "B",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Easy",
        "explanation": "Cuscuta lacks chlorophyll and parasitizes host plants."
    },
    {
        "id": "Q-7-SCI-052",
        "testGrade": "7",
        "targetGrade": "8",
        "subject": "science",
        "subjectName": "Science",
        "chapterId": "s7-ch2",
        "chapterName": "Heat & Temperature",
        "topic": "Radiation",
        "questionText": "Solar heat reaches Earth through empty space via:",
        "options": [
            {
                "key": "A",
                "text": "Conduction"
            },
            {
                "key": "B",
                "text": "Convection"
            },
            {
                "key": "C",
                "text": "Radiation"
            },
            {
                "key": "D",
                "text": "Advection"
            }
        ],
        "correctOption": "C",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Easy",
        "explanation": "Thermal radiation requires no material medium."
    },
    {
        "id": "Q-7-SCI-053",
        "testGrade": "7",
        "targetGrade": "8",
        "subject": "science",
        "subjectName": "Science",
        "chapterId": "s7-ch2",
        "chapterName": "Heat & Temperature",
        "topic": "Thermometer scale",
        "questionText": "Normal human body temperature in Celsius is approximately:",
        "options": [
            {
                "key": "A",
                "text": "35 °C"
            },
            {
                "key": "B",
                "text": "37 °C"
            },
            {
                "key": "C",
                "text": "39 °C"
            },
            {
                "key": "D",
                "text": "98.6 °C"
            }
        ],
        "correctOption": "B",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Easy",
        "explanation": "Normal body temperature is 37°C (98.6°F)."
    },
    {
        "id": "Q-7-SCI-054",
        "testGrade": "7",
        "targetGrade": "8",
        "subject": "science",
        "subjectName": "Science",
        "chapterId": "s7-ch3",
        "chapterName": "Acids, Bases & Chemical Changes",
        "topic": "Neutralisation",
        "questionText": "Acid + Base -> Salt + Water is called:",
        "options": [
            {
                "key": "A",
                "text": "Oxidation"
            },
            {
                "key": "B",
                "text": "Neutralisation"
            },
            {
                "key": "C",
                "text": "Decomposition"
            },
            {
                "key": "D",
                "text": "Combustion"
            }
        ],
        "correctOption": "B",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Easy",
        "explanation": "Acid-base neutralization."
    },
    {
        "id": "Q-7-SCI-055",
        "testGrade": "7",
        "targetGrade": "8",
        "subject": "science",
        "subjectName": "Science",
        "chapterId": "s7-ch3",
        "chapterName": "Acids, Bases & Chemical Changes",
        "topic": "Rusting of iron",
        "questionText": "Rusting of iron requires the presence of both:",
        "options": [
            {
                "key": "A",
                "text": "Oxygen and Water"
            },
            {
                "key": "B",
                "text": "Nitrogen and Water"
            },
            {
                "key": "C",
                "text": "Carbon dioxide and Heat"
            },
            {
                "key": "D",
                "text": "Sunlight and Oil"
            }
        ],
        "correctOption": "A",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Easy",
        "explanation": "Fe + O2 + H2O -> hydrated iron oxide (rust)."
    },
    {
        "id": "Q-7-SCI-056",
        "testGrade": "7",
        "targetGrade": "8",
        "subject": "science",
        "subjectName": "Science",
        "chapterId": "s7-ch4",
        "chapterName": "Respiration & Transportation",
        "topic": "Blood cells",
        "questionText": "Oxygen in blood is transported primarily by:",
        "options": [
            {
                "key": "A",
                "text": "White blood cells"
            },
            {
                "key": "B",
                "text": "Hemoglobin in RBCs"
            },
            {
                "key": "C",
                "text": "Platelets"
            },
            {
                "key": "D",
                "text": "Plasma proteins"
            }
        ],
        "correctOption": "B",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Easy",
        "explanation": "Hemoglobin binds oxygen."
    },
    {
        "id": "Q-7-SCI-057",
        "testGrade": "7",
        "targetGrade": "8",
        "subject": "science",
        "subjectName": "Science",
        "chapterId": "s7-ch4",
        "chapterName": "Respiration & Transportation",
        "topic": "Xylem",
        "questionText": "In vascular plants, water and minerals are carried upward by:",
        "options": [
            {
                "key": "A",
                "text": "Phloem"
            },
            {
                "key": "B",
                "text": "Xylem"
            },
            {
                "key": "C",
                "text": "Pith"
            },
            {
                "key": "D",
                "text": "Cortex"
            }
        ],
        "correctOption": "B",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Easy",
        "explanation": "Xylem transports water and minerals from roots."
    },
    {
        "id": "Q-7-SCI-058",
        "testGrade": "7",
        "targetGrade": "8",
        "subject": "science",
        "subjectName": "Science",
        "chapterId": "s7-ch5",
        "chapterName": "Motion, Electric Current & Light",
        "topic": "Speed calculation",
        "questionText": "A vehicle travels 180 km in 3 hours. Its speed in m/s is:",
        "options": [
            {
                "key": "A",
                "text": "16.67 m/s"
            },
            {
                "key": "B",
                "text": "20 m/s"
            },
            {
                "key": "C",
                "text": "25 m/s"
            },
            {
                "key": "D",
                "text": "50 m/s"
            }
        ],
        "correctOption": "A",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Medium",
        "explanation": "60 km/h × (5/18) = 16.67 m/s."
    },
    {
        "id": "Q-7-SCI-059",
        "testGrade": "7",
        "targetGrade": "8",
        "subject": "science",
        "subjectName": "Science",
        "chapterId": "s7-ch5",
        "chapterName": "Motion, Electric Current & Light",
        "topic": "Fuse wire",
        "questionText": "An electrical safety fuse functions on which effect of current?",
        "options": [
            {
                "key": "A",
                "text": "Magnetic effect"
            },
            {
                "key": "B",
                "text": "Heating effect"
            },
            {
                "key": "C",
                "text": "Chemical effect"
            },
            {
                "key": "D",
                "text": "Optical effect"
            }
        ],
        "correctOption": "B",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Easy",
        "explanation": "Joule heating melts the fuse wire during overcurrent."
    },
    {
        "id": "Q-7-ENG-060",
        "testGrade": "7",
        "targetGrade": "8",
        "subject": "english",
        "subjectName": "English & Reasoning",
        "chapterId": "e7-ch1",
        "chapterName": "Applied Grammar",
        "topic": "Passive voice",
        "questionText": "Convert to passive: \"The chef cooked a delicious meal.\"",
        "options": [
            {
                "key": "A",
                "text": "A delicious meal was cooked by the chef."
            },
            {
                "key": "B",
                "text": "The meal is cooked by the chef."
            },
            {
                "key": "C",
                "text": "A chef cooked meal was delicious."
            },
            {
                "key": "D",
                "text": "Delicious meals were cooked."
            }
        ],
        "correctOption": "A",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Easy",
        "explanation": "Past simple passive."
    },
    {
        "id": "Q-7-ENG-061",
        "testGrade": "7",
        "targetGrade": "8",
        "subject": "english",
        "subjectName": "English & Reasoning",
        "chapterId": "e7-ch2",
        "chapterName": "Aptitude & Logic",
        "topic": "Coding decoding",
        "questionText": "If BREAD is coded as CSFBE, what is the code for TOAST?",
        "options": [
            {
                "key": "A",
                "text": "UPBTU"
            },
            {
                "key": "B",
                "text": "VQBUU"
            },
            {
                "key": "C",
                "text": "SNZRS"
            },
            {
                "key": "D",
                "text": "UOBTU"
            }
        ],
        "correctOption": "A",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Medium",
        "explanation": "Each letter is shifted by +1: T->U, O->P, A->B, S->T, T->U => UPBTU."
    },
    {
        "id": "Q-8-MAT-062",
        "testGrade": "8",
        "targetGrade": "9",
        "subject": "maths",
        "subjectName": "Mathematics",
        "chapterId": "m8-ch1",
        "chapterName": "Rational Numbers & Linear Equations",
        "topic": "Linear Equations",
        "questionText": "Solve for x: (2x - 3) / 5 = (x + 1) / 3",
        "options": [
            {
                "key": "A",
                "text": "12"
            },
            {
                "key": "B",
                "text": "14"
            },
            {
                "key": "C",
                "text": "10"
            },
            {
                "key": "D",
                "text": "16"
            }
        ],
        "correctOption": "B",
        "marks": 2,
        "negativeMarks": 0,
        "difficulty": "Medium",
        "explanation": "3(2x - 3) = 5(x + 1) => 6x - 9 = 5x + 5 => x = 14."
    },
    {
        "id": "Q-8-MAT-063",
        "testGrade": "8",
        "targetGrade": "9",
        "subject": "maths",
        "subjectName": "Mathematics",
        "chapterId": "m8-ch2",
        "chapterName": "Quadrilaterals & Practical Geometry",
        "topic": "Angles of polygon",
        "questionText": "The sum of all interior angles of a hexagon is:",
        "options": [
            {
                "key": "A",
                "text": "540°"
            },
            {
                "key": "B",
                "text": "720°"
            },
            {
                "key": "C",
                "text": "900°"
            },
            {
                "key": "D",
                "text": "1080°"
            }
        ],
        "correctOption": "B",
        "marks": 2,
        "negativeMarks": 0,
        "difficulty": "Medium",
        "explanation": "(6 - 2) × 180° = 720°."
    },
    {
        "id": "Q-8-MAT-064",
        "testGrade": "8",
        "targetGrade": "9",
        "subject": "maths",
        "subjectName": "Mathematics",
        "chapterId": "m8-ch3",
        "chapterName": "Squares, Cubes & Roots",
        "topic": "Decimals square root",
        "questionText": "Find √0.0064:",
        "options": [
            {
                "key": "A",
                "text": "0.8"
            },
            {
                "key": "B",
                "text": "0.08"
            },
            {
                "key": "C",
                "text": "0.008"
            },
            {
                "key": "D",
                "text": "0.04"
            }
        ],
        "correctOption": "B",
        "marks": 2,
        "negativeMarks": 0,
        "difficulty": "Easy",
        "explanation": "√0.0064 = 0.08."
    },
    {
        "id": "Q-8-MAT-065",
        "testGrade": "8",
        "targetGrade": "9",
        "subject": "maths",
        "subjectName": "Mathematics",
        "chapterId": "m8-ch4",
        "chapterName": "Comparing Quantities (Commercial Maths)",
        "topic": "Compound Interest",
        "questionText": "Find CI on Rs 10,000 for 2 yrs at 10% pa compounded annually:",
        "options": [
            {
                "key": "A",
                "text": "Rs 2,000"
            },
            {
                "key": "B",
                "text": "Rs 2,100"
            },
            {
                "key": "C",
                "text": "Rs 2,200"
            },
            {
                "key": "D",
                "text": "Rs 2,500"
            }
        ],
        "correctOption": "B",
        "marks": 2,
        "negativeMarks": 0,
        "difficulty": "Medium",
        "explanation": "10,000 × (1.1)² - 10,000 = Rs 2,100."
    },
    {
        "id": "Q-8-MAT-066",
        "testGrade": "8",
        "targetGrade": "9",
        "subject": "maths",
        "subjectName": "Mathematics",
        "chapterId": "m8-ch5",
        "chapterName": "Algebraic Identities & Factorisation",
        "topic": "Factorisation",
        "questionText": "Factorise: x² + 9x + 20",
        "options": [
            {
                "key": "A",
                "text": "(x + 4)(x + 5)"
            },
            {
                "key": "B",
                "text": "(x + 2)(x + 10)"
            },
            {
                "key": "C",
                "text": "(x - 4)(x - 5)"
            },
            {
                "key": "D",
                "text": "(x + 1)(x + 20)"
            }
        ],
        "correctOption": "A",
        "marks": 2,
        "negativeMarks": 0,
        "difficulty": "Easy",
        "explanation": "(x + 4)(x + 5)."
    },
    {
        "id": "Q-8-MAT-067",
        "testGrade": "8",
        "targetGrade": "9",
        "subject": "maths",
        "subjectName": "Mathematics",
        "chapterId": "m8-ch6",
        "chapterName": "Mensuration (3D Geometry)",
        "topic": "Cylinder CSA",
        "questionText": "Radius = 7 cm, height = 10 cm. Find CSA (π = 22/7):",
        "options": [
            {
                "key": "A",
                "text": "220 sq cm"
            },
            {
                "key": "B",
                "text": "440 sq cm"
            },
            {
                "key": "C",
                "text": "660 sq cm"
            },
            {
                "key": "D",
                "text": "748 sq cm"
            }
        ],
        "correctOption": "B",
        "marks": 2,
        "negativeMarks": 0,
        "difficulty": "Medium",
        "explanation": "2 × (22/7) × 7 × 10 = 440 sq cm."
    },
    {
        "id": "Q-8-SCI-068",
        "testGrade": "8",
        "targetGrade": "9",
        "subject": "science",
        "subjectName": "Science",
        "chapterId": "s8-ch1",
        "chapterName": "Cell Structure & Microorganisms",
        "topic": "Plant cell wall",
        "questionText": "Which organelle provides structural rigidity in plant cells but is absent in animals?",
        "options": [
            {
                "key": "A",
                "text": "Cell wall"
            },
            {
                "key": "B",
                "text": "Mitochondria"
            },
            {
                "key": "C",
                "text": "Ribosome"
            },
            {
                "key": "D",
                "text": "Golgi body"
            }
        ],
        "correctOption": "A",
        "marks": 2,
        "negativeMarks": 0,
        "difficulty": "Easy",
        "explanation": "Cellulose cell wall."
    },
    {
        "id": "Q-8-SCI-069",
        "testGrade": "8",
        "targetGrade": "9",
        "subject": "science",
        "subjectName": "Science",
        "chapterId": "s8-ch2",
        "chapterName": "Metals, Non-Metals & Fuels",
        "topic": "Reactivity",
        "questionText": "Which non-metal is stored under water to prevent spontaneous combustion in air?",
        "options": [
            {
                "key": "A",
                "text": "Sulphur"
            },
            {
                "key": "B",
                "text": "Phosphorus"
            },
            {
                "key": "C",
                "text": "Carbon"
            },
            {
                "key": "D",
                "text": "Silicon"
            }
        ],
        "correctOption": "B",
        "marks": 2,
        "negativeMarks": 0,
        "difficulty": "Medium",
        "explanation": "White phosphorus."
    },
    {
        "id": "Q-8-SCI-070",
        "testGrade": "8",
        "targetGrade": "9",
        "subject": "science",
        "subjectName": "Science",
        "chapterId": "s8-ch4",
        "chapterName": "Force, Pressure & Friction",
        "topic": "Pressure",
        "questionText": "Force = 120 N, Area = 0.5 m². Calculate pressure:",
        "options": [
            {
                "key": "A",
                "text": "60 Pa"
            },
            {
                "key": "B",
                "text": "120 Pa"
            },
            {
                "key": "C",
                "text": "240 Pa"
            },
            {
                "key": "D",
                "text": "480 Pa"
            }
        ],
        "correctOption": "C",
        "marks": 2,
        "negativeMarks": 0,
        "difficulty": "Medium",
        "explanation": "120 / 0.5 = 240 Pa."
    },
    {
        "id": "Q-8-SCI-071",
        "testGrade": "8",
        "targetGrade": "9",
        "subject": "science",
        "subjectName": "Science",
        "chapterId": "s8-ch5",
        "chapterName": "Sound & Chemical Effects of Current",
        "topic": "Pitch",
        "questionText": "The pitch (shrillness) of sound is determined by its:",
        "options": [
            {
                "key": "A",
                "text": "Amplitude"
            },
            {
                "key": "B",
                "text": "Frequency"
            },
            {
                "key": "C",
                "text": "Speed"
            },
            {
                "key": "D",
                "text": "Loudness"
            }
        ],
        "correctOption": "B",
        "marks": 2,
        "negativeMarks": 0,
        "difficulty": "Easy",
        "explanation": "Frequency determines pitch."
    },
    {
        "id": "Q-9-MAT-072",
        "testGrade": "9",
        "targetGrade": "10",
        "subject": "maths",
        "subjectName": "Mathematics",
        "chapterId": "m9-ch1",
        "chapterName": "Number Systems & Polynomials",
        "topic": "Rationalising denominator",
        "questionText": "Simplify 1 / (√5 + √3):",
        "options": [
            {
                "key": "A",
                "text": "(√5 - √3) / 2"
            },
            {
                "key": "B",
                "text": "(√5 + √3) / 2"
            },
            {
                "key": "C",
                "text": "√5 - √3"
            },
            {
                "key": "D",
                "text": "2 / (√5 - √3)"
            }
        ],
        "correctOption": "A",
        "marks": 2,
        "negativeMarks": 0,
        "difficulty": "Medium",
        "explanation": "(√5 - √3)/(5 - 3) = (√5 - √3)/2."
    },
    {
        "id": "Q-9-MAT-073",
        "testGrade": "9",
        "targetGrade": "10",
        "subject": "maths",
        "subjectName": "Mathematics",
        "chapterId": "m9-ch2",
        "chapterName": "Coordinate Geometry & Linear Equations",
        "topic": "Quadrants",
        "questionText": "In which quadrant does point (-4, 7) lie?",
        "options": [
            {
                "key": "A",
                "text": "Quadrant I"
            },
            {
                "key": "B",
                "text": "Quadrant II"
            },
            {
                "key": "C",
                "text": "Quadrant III"
            },
            {
                "key": "D",
                "text": "Quadrant IV"
            }
        ],
        "correctOption": "B",
        "marks": 2,
        "negativeMarks": 0,
        "difficulty": "Easy",
        "explanation": "(-, +) is in Quadrant II."
    },
    {
        "id": "Q-9-MAT-074",
        "testGrade": "9",
        "targetGrade": "10",
        "subject": "maths",
        "subjectName": "Mathematics",
        "chapterId": "m9-ch3",
        "chapterName": "Lines, Angles & Triangle Congruence",
        "topic": "Congruence",
        "questionText": "Two angles and included side equal is known as:",
        "options": [
            {
                "key": "A",
                "text": "SSS"
            },
            {
                "key": "B",
                "text": "SAS"
            },
            {
                "key": "C",
                "text": "ASA"
            },
            {
                "key": "D",
                "text": "RHS"
            }
        ],
        "correctOption": "C",
        "marks": 2,
        "negativeMarks": 0,
        "difficulty": "Easy",
        "explanation": "ASA criterion."
    },
    {
        "id": "Q-9-MAT-075",
        "testGrade": "9",
        "targetGrade": "10",
        "subject": "maths",
        "subjectName": "Mathematics",
        "chapterId": "m9-ch4",
        "chapterName": "Quadrilaterals, Circles & Heron’s Formula",
        "topic": "Heron formula",
        "questionText": "Sides 5, 12, 13 m. Area by Heron formula:",
        "options": [
            {
                "key": "A",
                "text": "30 sq m"
            },
            {
                "key": "B",
                "text": "60 sq m"
            },
            {
                "key": "C",
                "text": "65 sq m"
            },
            {
                "key": "D",
                "text": "78 sq m"
            }
        ],
        "correctOption": "A",
        "marks": 2,
        "negativeMarks": 0,
        "difficulty": "Medium",
        "explanation": "√(15 × 10 × 3 × 2) = 30 sq m."
    },
    {
        "id": "Q-9-SCI-076",
        "testGrade": "9",
        "targetGrade": "10",
        "subject": "science",
        "subjectName": "Science",
        "chapterId": "s9-ch1",
        "chapterName": "Motion, Force & Laws of Motion",
        "topic": "Second law",
        "questionText": "Mass 5 kg, velocity increases from 6 to 14 m/s in 2 s. Force is:",
        "options": [
            {
                "key": "A",
                "text": "10 N"
            },
            {
                "key": "B",
                "text": "20 N"
            },
            {
                "key": "C",
                "text": "40 N"
            },
            {
                "key": "D",
                "text": "50 N"
            }
        ],
        "correctOption": "B",
        "marks": 2,
        "negativeMarks": 0,
        "difficulty": "Medium",
        "explanation": "a = 4 m/s², F = 5 × 4 = 20 N."
    },
    {
        "id": "Q-9-SCI-077",
        "testGrade": "9",
        "targetGrade": "10",
        "subject": "science",
        "subjectName": "Science",
        "chapterId": "s9-ch2",
        "chapterName": "Gravitation, Work & Energy",
        "topic": "Kinetic energy",
        "questionText": "If velocity of an object is doubled, its kinetic energy increases by:",
        "options": [
            {
                "key": "A",
                "text": "2 times"
            },
            {
                "key": "B",
                "text": "4 times"
            },
            {
                "key": "C",
                "text": "8 times"
            },
            {
                "key": "D",
                "text": "Unchanged"
            }
        ],
        "correctOption": "B",
        "marks": 2,
        "negativeMarks": 0,
        "difficulty": "Medium",
        "explanation": "KE proportional to v² => 2² = 4."
    },
    {
        "id": "Q-9-SCI-078",
        "testGrade": "9",
        "targetGrade": "10",
        "subject": "science",
        "subjectName": "Science",
        "chapterId": "s9-ch3",
        "chapterName": "Matter & Atomic Structure",
        "topic": "Isotopes",
        "questionText": "Isotopes of an element possess identical number of:",
        "options": [
            {
                "key": "A",
                "text": "Neutrons"
            },
            {
                "key": "B",
                "text": "Protons"
            },
            {
                "key": "C",
                "text": "Mass number"
            },
            {
                "key": "D",
                "text": "Nucleons"
            }
        ],
        "correctOption": "B",
        "marks": 2,
        "negativeMarks": 0,
        "difficulty": "Easy",
        "explanation": "Same atomic number (protons)."
    },
    {
        "id": "Q-10-MAT-079",
        "testGrade": "10",
        "targetGrade": "11",
        "subject": "maths",
        "subjectName": "Mathematics",
        "chapterId": "m10-ch1",
        "chapterName": "Real Numbers & Polynomials",
        "topic": "Fundamental Theorem",
        "questionText": "HCF(306, 657) = 9. Find LCM(306, 657):",
        "options": [
            {
                "key": "A",
                "text": "22,338"
            },
            {
                "key": "B",
                "text": "18,446"
            },
            {
                "key": "C",
                "text": "25,640"
            },
            {
                "key": "D",
                "text": "28,124"
            }
        ],
        "correctOption": "A",
        "marks": 4,
        "negativeMarks": 0,
        "difficulty": "Medium",
        "explanation": "(306 × 657) / 9 = 22,338."
    },
    {
        "id": "Q-10-MAT-080",
        "testGrade": "10",
        "targetGrade": "11",
        "subject": "maths",
        "subjectName": "Mathematics",
        "chapterId": "m10-ch2",
        "chapterName": "Linear Equations & Quadratic Equations",
        "topic": "Discriminant",
        "questionText": "For real and equal roots in 2x² + kx + 3 = 0, k is:",
        "options": [
            {
                "key": "A",
                "text": "±2√6"
            },
            {
                "key": "B",
                "text": "±4√3"
            },
            {
                "key": "C",
                "text": "±6"
            },
            {
                "key": "D",
                "text": "±24"
            }
        ],
        "correctOption": "A",
        "marks": 4,
        "negativeMarks": 0,
        "difficulty": "Hard",
        "explanation": "k² - 24 = 0 => k = ±2√6."
    },
    {
        "id": "Q-10-MAT-081",
        "testGrade": "10",
        "targetGrade": "11",
        "subject": "maths",
        "subjectName": "Mathematics",
        "chapterId": "m10-ch3",
        "chapterName": "Arithmetic Progressions",
        "topic": "AP term",
        "questionText": "In AP: 7, 13, 19, ..., which term is 205?",
        "options": [
            {
                "key": "A",
                "text": "32nd"
            },
            {
                "key": "B",
                "text": "33rd"
            },
            {
                "key": "C",
                "text": "34th"
            },
            {
                "key": "D",
                "text": "35th"
            }
        ],
        "correctOption": "C",
        "marks": 4,
        "negativeMarks": 0,
        "difficulty": "Medium",
        "explanation": "7 + (n - 1)6 = 205 => n = 34."
    },
    {
        "id": "Q-10-MAT-082",
        "testGrade": "10",
        "targetGrade": "11",
        "subject": "maths",
        "subjectName": "Mathematics",
        "chapterId": "m10-ch5",
        "chapterName": "Trigonometry & Applications",
        "topic": "Identities",
        "questionText": "Evaluate (sin² 30° + cos² 30°) / tan 45°:",
        "options": [
            {
                "key": "A",
                "text": "0"
            },
            {
                "key": "B",
                "text": "1/2"
            },
            {
                "key": "C",
                "text": "1"
            },
            {
                "key": "D",
                "text": "2"
            }
        ],
        "correctOption": "C",
        "marks": 4,
        "negativeMarks": 0,
        "difficulty": "Easy",
        "explanation": "1 / 1 = 1."
    },
    {
        "id": "Q-10-PHY-083",
        "testGrade": "10",
        "targetGrade": "11",
        "subject": "physics",
        "subjectName": "Physics",
        "chapterId": "p10-ch1",
        "chapterName": "Light: Reflection & Refraction",
        "topic": "Lens power",
        "questionText": "Convex lens of focal length +25 cm has optical power:",
        "options": [
            {
                "key": "A",
                "text": "+4 D"
            },
            {
                "key": "B",
                "text": "-4 D"
            },
            {
                "key": "C",
                "text": "+0.25 D"
            },
            {
                "key": "D",
                "text": "+2.5 D"
            }
        ],
        "correctOption": "A",
        "marks": 4,
        "negativeMarks": 0,
        "difficulty": "Easy",
        "explanation": "1 / 0.25 = +4 D."
    },
    {
        "id": "Q-10-PHY-084",
        "testGrade": "10",
        "targetGrade": "11",
        "subject": "physics",
        "subjectName": "Physics",
        "chapterId": "p10-ch3",
        "chapterName": "Electricity & Magnetic Effects",
        "topic": "Parallel resistors",
        "questionText": "6 Ω and 12 Ω in parallel across 12 V. Total current drawn is:",
        "options": [
            {
                "key": "A",
                "text": "1 A"
            },
            {
                "key": "B",
                "text": "2 A"
            },
            {
                "key": "C",
                "text": "3 A"
            },
            {
                "key": "D",
                "text": "4 A"
            }
        ],
        "correctOption": "C",
        "marks": 4,
        "negativeMarks": 0,
        "difficulty": "Medium",
        "explanation": "Req = 4 Ω. I = 12 / 4 = 3 A."
    },
    {
        "id": "Q-10-CHE-085",
        "testGrade": "10",
        "targetGrade": "11",
        "subject": "chemistry",
        "subjectName": "Chemistry",
        "chapterId": "c10-ch1",
        "chapterName": "Chemical Reactions & Equations",
        "topic": "Redox",
        "questionText": "In CuO + H2 -> Cu + H2O, which substance is reduced?",
        "options": [
            {
                "key": "A",
                "text": "H2"
            },
            {
                "key": "B",
                "text": "CuO"
            },
            {
                "key": "C",
                "text": "Cu"
            },
            {
                "key": "D",
                "text": "H2O"
            }
        ],
        "correctOption": "B",
        "marks": 4,
        "negativeMarks": 0,
        "difficulty": "Easy",
        "explanation": "CuO loses oxygen."
    },
    {
        "id": "Q-10-CHE-086",
        "testGrade": "10",
        "targetGrade": "11",
        "subject": "chemistry",
        "subjectName": "Chemistry",
        "chapterId": "c10-ch3",
        "chapterName": "Metals, Non-Metals & Carbon Compounds",
        "topic": "Carbon properties",
        "questionText": "Carbon versatile nature is due to catenation and:",
        "options": [
            {
                "key": "A",
                "text": "High density"
            },
            {
                "key": "B",
                "text": "Tetravalency"
            },
            {
                "key": "C",
                "text": "Radioactivity"
            },
            {
                "key": "D",
                "text": "Conductivity"
            }
        ],
        "correctOption": "B",
        "marks": 4,
        "negativeMarks": 0,
        "difficulty": "Easy",
        "explanation": "Tetravalency."
    },
    {
        "id": "Q-11-MAT-087",
        "testGrade": "11",
        "targetGrade": "12",
        "subject": "maths",
        "subjectName": "Mathematics",
        "chapterId": "m11-ch1",
        "chapterName": "Sets, Relations & Functions",
        "topic": "Subsets",
        "questionText": "If set A has 5 elements, how many non-empty proper subsets exist?",
        "options": [
            {
                "key": "A",
                "text": "32"
            },
            {
                "key": "B",
                "text": "31"
            },
            {
                "key": "C",
                "text": "30"
            },
            {
                "key": "D",
                "text": "25"
            }
        ],
        "correctOption": "C",
        "marks": 4,
        "negativeMarks": 0,
        "difficulty": "Medium",
        "explanation": "2⁵ - 2 = 30."
    },
    {
        "id": "Q-11-PHY-088",
        "testGrade": "11",
        "targetGrade": "12",
        "subject": "physics",
        "subjectName": "Physics",
        "chapterId": "p11-ch1",
        "chapterName": "Kinematics & Laws of Motion",
        "topic": "Projectile Range",
        "questionText": "Horizontal range of a projectile is maximum at angle:",
        "options": [
            {
                "key": "A",
                "text": "30°"
            },
            {
                "key": "B",
                "text": "45°"
            },
            {
                "key": "C",
                "text": "60°"
            },
            {
                "key": "D",
                "text": "90°"
            }
        ],
        "correctOption": "B",
        "marks": 4,
        "negativeMarks": 0,
        "difficulty": "Easy",
        "explanation": "Maximum at 45°."
    },
    {
        "id": "Q-11-CHE-089",
        "testGrade": "11",
        "targetGrade": "12",
        "subject": "chemistry",
        "subjectName": "Chemistry",
        "chapterId": "c11-ch2",
        "chapterName": "Chemical Bonding & Molecular Structure",
        "topic": "Hybridisation",
        "questionText": "Hybridisation of carbon in CH4 is:",
        "options": [
            {
                "key": "A",
                "text": "sp"
            },
            {
                "key": "B",
                "text": "sp²"
            },
            {
                "key": "C",
                "text": "sp³"
            },
            {
                "key": "D",
                "text": "dsp²"
            }
        ],
        "correctOption": "C",
        "marks": 4,
        "negativeMarks": 0,
        "difficulty": "Easy",
        "explanation": "sp³ tetrahedral."
    },
    {
        "id": "Q-5-ENG-090",
        "testGrade": "5",
        "targetGrade": "6",
        "subject": "english",
        "subjectName": "English & Grammar",
        "chapterId": "e5-ch1",
        "chapterName": "Reading Comprehension",
        "topic": "Unseen passage facts",
        "questionText": "Which of the following principles correctly applies to \"Reading Comprehension\" (Unseen passage facts)?",
        "options": [
            {
                "key": "A",
                "text": "Primary standard rule for Reading Comprehension"
            },
            {
                "key": "B",
                "text": "Secondary application of Unseen passage facts"
            },
            {
                "key": "C",
                "text": "Universal invariant condition across English & Grammar"
            },
            {
                "key": "D",
                "text": "None of the above"
            }
        ],
        "correctOption": "A",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Medium",
        "explanation": "Standard syllabus evaluation question for Reading Comprehension based on NCERT guidelines."
    },
    {
        "id": "Q-5-ENG-091",
        "testGrade": "5",
        "targetGrade": "6",
        "subject": "english",
        "subjectName": "English & Grammar",
        "chapterId": "e5-ch2",
        "chapterName": "Grammar Essentials",
        "topic": "Nouns & Pronouns",
        "questionText": "Which of the following principles correctly applies to \"Grammar Essentials\" (Nouns & Pronouns)?",
        "options": [
            {
                "key": "A",
                "text": "Primary standard rule for Grammar Essentials"
            },
            {
                "key": "B",
                "text": "Secondary application of Nouns & Pronouns"
            },
            {
                "key": "C",
                "text": "Universal invariant condition across English & Grammar"
            },
            {
                "key": "D",
                "text": "None of the above"
            }
        ],
        "correctOption": "A",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Medium",
        "explanation": "Standard syllabus evaluation question for Grammar Essentials based on NCERT guidelines."
    },
    {
        "id": "Q-5-ENG-092",
        "testGrade": "5",
        "targetGrade": "6",
        "subject": "english",
        "subjectName": "English & Grammar",
        "chapterId": "e5-ch3",
        "chapterName": "Sentence Construction",
        "topic": "Punctuation & capital letters",
        "questionText": "Which of the following principles correctly applies to \"Sentence Construction\" (Punctuation & capital letters)?",
        "options": [
            {
                "key": "A",
                "text": "Primary standard rule for Sentence Construction"
            },
            {
                "key": "B",
                "text": "Secondary application of Punctuation & capital letters"
            },
            {
                "key": "C",
                "text": "Universal invariant condition across English & Grammar"
            },
            {
                "key": "D",
                "text": "None of the above"
            }
        ],
        "correctOption": "A",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Medium",
        "explanation": "Standard syllabus evaluation question for Sentence Construction based on NCERT guidelines."
    },
    {
        "id": "Q-6-ENG-093",
        "testGrade": "6",
        "targetGrade": "7",
        "subject": "english",
        "subjectName": "English & Aptitude",
        "chapterId": "e6-ch1",
        "chapterName": "Grammar & Vocabulary",
        "topic": "Tenses (present, past, continuous)",
        "questionText": "Which of the following principles correctly applies to \"Grammar & Vocabulary\" (Tenses (present, past, continuous))?",
        "options": [
            {
                "key": "A",
                "text": "Primary standard rule for Grammar & Vocabulary"
            },
            {
                "key": "B",
                "text": "Secondary application of Tenses (present, past, continuous)"
            },
            {
                "key": "C",
                "text": "Universal invariant condition across English & Aptitude"
            },
            {
                "key": "D",
                "text": "None of the above"
            }
        ],
        "correctOption": "A",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Medium",
        "explanation": "Standard syllabus evaluation question for Grammar & Vocabulary based on NCERT guidelines."
    },
    {
        "id": "Q-6-ENG-094",
        "testGrade": "6",
        "targetGrade": "7",
        "subject": "english",
        "subjectName": "English & Aptitude",
        "chapterId": "e6-ch2",
        "chapterName": "Logical Reasoning",
        "topic": "Number series",
        "questionText": "Which of the following principles correctly applies to \"Logical Reasoning\" (Number series)?",
        "options": [
            {
                "key": "A",
                "text": "Primary standard rule for Logical Reasoning"
            },
            {
                "key": "B",
                "text": "Secondary application of Number series"
            },
            {
                "key": "C",
                "text": "Universal invariant condition across English & Aptitude"
            },
            {
                "key": "D",
                "text": "None of the above"
            }
        ],
        "correctOption": "A",
        "marks": 1,
        "negativeMarks": 0,
        "difficulty": "Medium",
        "explanation": "Standard syllabus evaluation question for Logical Reasoning based on NCERT guidelines."
    },
    {
        "id": "Q-8-MAT-095",
        "testGrade": "8",
        "targetGrade": "9",
        "subject": "maths",
        "subjectName": "Mathematics",
        "chapterId": "m8-ch7",
        "chapterName": "Exponents, Powers & Graphs",
        "topic": "Negative and fractional exponents",
        "questionText": "Which of the following principles correctly applies to \"Exponents, Powers & Graphs\" (Negative and fractional exponents)?",
        "options": [
            {
                "key": "A",
                "text": "Primary standard rule for Exponents, Powers & Graphs"
            },
            {
                "key": "B",
                "text": "Secondary application of Negative and fractional exponents"
            },
            {
                "key": "C",
                "text": "Universal invariant condition across Mathematics"
            },
            {
                "key": "D",
                "text": "None of the above"
            }
        ],
        "correctOption": "A",
        "marks": 2,
        "negativeMarks": 0,
        "difficulty": "Medium",
        "explanation": "Standard syllabus evaluation question for Exponents, Powers & Graphs based on NCERT guidelines."
    },
    {
        "id": "Q-8-SCI-096",
        "testGrade": "8",
        "targetGrade": "9",
        "subject": "science",
        "subjectName": "Science",
        "chapterId": "s8-ch3",
        "chapterName": "Reproduction & Adolescence",
        "topic": "Asexual vs sexual reproduction in animals",
        "questionText": "Which of the following principles correctly applies to \"Reproduction & Adolescence\" (Asexual vs sexual reproduction in animals)?",
        "options": [
            {
                "key": "A",
                "text": "Primary standard rule for Reproduction & Adolescence"
            },
            {
                "key": "B",
                "text": "Secondary application of Asexual vs sexual reproduction in animals"
            },
            {
                "key": "C",
                "text": "Universal invariant condition across Science"
            },
            {
                "key": "D",
                "text": "None of the above"
            }
        ],
        "correctOption": "A",
        "marks": 2,
        "negativeMarks": 0,
        "difficulty": "Medium",
        "explanation": "Standard syllabus evaluation question for Reproduction & Adolescence based on NCERT guidelines."
    },
    {
        "id": "Q-8-SCI-097",
        "testGrade": "8",
        "targetGrade": "9",
        "subject": "science",
        "subjectName": "Science",
        "chapterId": "s8-ch6",
        "chapterName": "Light & Optical Phenomena",
        "topic": "Laws of reflection & regular/diffuse",
        "questionText": "Which of the following principles correctly applies to \"Light & Optical Phenomena\" (Laws of reflection & regular/diffuse)?",
        "options": [
            {
                "key": "A",
                "text": "Primary standard rule for Light & Optical Phenomena"
            },
            {
                "key": "B",
                "text": "Secondary application of Laws of reflection & regular/diffuse"
            },
            {
                "key": "C",
                "text": "Universal invariant condition across Science"
            },
            {
                "key": "D",
                "text": "None of the above"
            }
        ],
        "correctOption": "A",
        "marks": 2,
        "negativeMarks": 0,
        "difficulty": "Medium",
        "explanation": "Standard syllabus evaluation question for Light & Optical Phenomena based on NCERT guidelines."
    },
    {
        "id": "Q-8-APT-098",
        "testGrade": "8",
        "targetGrade": "9",
        "subject": "aptitude",
        "subjectName": "Mental Aptitude (MAT)",
        "chapterId": "a8-ch1",
        "chapterName": "Advanced Logical Reasoning",
        "topic": "Syllogisms & logic deductions",
        "questionText": "Which of the following principles correctly applies to \"Advanced Logical Reasoning\" (Syllogisms & logic deductions)?",
        "options": [
            {
                "key": "A",
                "text": "Primary standard rule for Advanced Logical Reasoning"
            },
            {
                "key": "B",
                "text": "Secondary application of Syllogisms & logic deductions"
            },
            {
                "key": "C",
                "text": "Universal invariant condition across Mental Aptitude (MAT)"
            },
            {
                "key": "D",
                "text": "None of the above"
            }
        ],
        "correctOption": "A",
        "marks": 2,
        "negativeMarks": 0,
        "difficulty": "Medium",
        "explanation": "Standard syllabus evaluation question for Advanced Logical Reasoning based on NCERT guidelines."
    },
    {
        "id": "Q-9-MAT-099",
        "testGrade": "9",
        "targetGrade": "10",
        "subject": "maths",
        "subjectName": "Mathematics",
        "chapterId": "m9-ch5",
        "chapterName": "Surface Areas, Volumes & Statistics",
        "topic": "Cones, spheres, and hemispheres",
        "questionText": "Which of the following principles correctly applies to \"Surface Areas, Volumes & Statistics\" (Cones, spheres, and hemispheres)?",
        "options": [
            {
                "key": "A",
                "text": "Primary standard rule for Surface Areas, Volumes & Statistics"
            },
            {
                "key": "B",
                "text": "Secondary application of Cones, spheres, and hemispheres"
            },
            {
                "key": "C",
                "text": "Universal invariant condition across Mathematics"
            },
            {
                "key": "D",
                "text": "None of the above"
            }
        ],
        "correctOption": "A",
        "marks": 2,
        "negativeMarks": 0,
        "difficulty": "Medium",
        "explanation": "Standard syllabus evaluation question for Surface Areas, Volumes & Statistics based on NCERT guidelines."
    },
    {
        "id": "Q-9-SCI-100",
        "testGrade": "9",
        "targetGrade": "10",
        "subject": "science",
        "subjectName": "Science (Physics, Chemistry, Biology)",
        "chapterId": "s9-ch4",
        "chapterName": "Cell Biology & Plant/Animal Tissues",
        "topic": "Cell membrane transport (osmosis)",
        "questionText": "Which of the following principles correctly applies to \"Cell Biology & Plant/Animal Tissues\" (Cell membrane transport (osmosis))?",
        "options": [
            {
                "key": "A",
                "text": "Primary standard rule for Cell Biology & Plant/Animal Tissues"
            },
            {
                "key": "B",
                "text": "Secondary application of Cell membrane transport (osmosis)"
            },
            {
                "key": "C",
                "text": "Universal invariant condition across Science (Physics, Chemistry, Biology)"
            },
            {
                "key": "D",
                "text": "None of the above"
            }
        ],
        "correctOption": "A",
        "marks": 2,
        "negativeMarks": 0,
        "difficulty": "Medium",
        "explanation": "Standard syllabus evaluation question for Cell Biology & Plant/Animal Tissues based on NCERT guidelines."
    },
    {
        "id": "Q-10-MAT-101",
        "testGrade": "10",
        "targetGrade": "11",
        "subject": "maths",
        "subjectName": "Mathematics",
        "chapterId": "m10-ch4",
        "chapterName": "Triangles & Coordinate Geometry",
        "topic": "Basic Proportionality Theorem (Thales)",
        "questionText": "Which of the following principles correctly applies to \"Triangles & Coordinate Geometry\" (Basic Proportionality Theorem (Thales))?",
        "options": [
            {
                "key": "A",
                "text": "Primary standard rule for Triangles & Coordinate Geometry"
            },
            {
                "key": "B",
                "text": "Secondary application of Basic Proportionality Theorem (Thales)"
            },
            {
                "key": "C",
                "text": "Universal invariant condition across Mathematics"
            },
            {
                "key": "D",
                "text": "None of the above"
            }
        ],
        "correctOption": "A",
        "marks": 4,
        "negativeMarks": 0,
        "difficulty": "Medium",
        "explanation": "Standard syllabus evaluation question for Triangles & Coordinate Geometry based on NCERT guidelines."
    },
    {
        "id": "Q-10-MAT-102",
        "testGrade": "10",
        "targetGrade": "11",
        "subject": "maths",
        "subjectName": "Mathematics",
        "chapterId": "m10-ch6",
        "chapterName": "Circles, Areas & Volumes",
        "topic": "Tangents from an external point",
        "questionText": "Which of the following principles correctly applies to \"Circles, Areas & Volumes\" (Tangents from an external point)?",
        "options": [
            {
                "key": "A",
                "text": "Primary standard rule for Circles, Areas & Volumes"
            },
            {
                "key": "B",
                "text": "Secondary application of Tangents from an external point"
            },
            {
                "key": "C",
                "text": "Universal invariant condition across Mathematics"
            },
            {
                "key": "D",
                "text": "None of the above"
            }
        ],
        "correctOption": "A",
        "marks": 4,
        "negativeMarks": 0,
        "difficulty": "Medium",
        "explanation": "Standard syllabus evaluation question for Circles, Areas & Volumes based on NCERT guidelines."
    },
    {
        "id": "Q-10-MAT-103",
        "testGrade": "10",
        "targetGrade": "11",
        "subject": "maths",
        "subjectName": "Mathematics",
        "chapterId": "m10-ch7",
        "chapterName": "Statistics & Probability",
        "topic": "Mean, median, mode of grouped data",
        "questionText": "Which of the following principles correctly applies to \"Statistics & Probability\" (Mean, median, mode of grouped data)?",
        "options": [
            {
                "key": "A",
                "text": "Primary standard rule for Statistics & Probability"
            },
            {
                "key": "B",
                "text": "Secondary application of Mean, median, mode of grouped data"
            },
            {
                "key": "C",
                "text": "Universal invariant condition across Mathematics"
            },
            {
                "key": "D",
                "text": "None of the above"
            }
        ],
        "correctOption": "A",
        "marks": 4,
        "negativeMarks": 0,
        "difficulty": "Medium",
        "explanation": "Standard syllabus evaluation question for Statistics & Probability based on NCERT guidelines."
    },
    {
        "id": "Q-10-PHY-104",
        "testGrade": "10",
        "targetGrade": "11",
        "subject": "physics",
        "subjectName": "Physics",
        "chapterId": "p10-ch2",
        "chapterName": "Human Eye & Colourful World",
        "topic": "Defects of vision (myopia, hypermetropia)",
        "questionText": "Which of the following principles correctly applies to \"Human Eye & Colourful World\" (Defects of vision (myopia, hypermetropia))?",
        "options": [
            {
                "key": "A",
                "text": "Primary standard rule for Human Eye & Colourful World"
            },
            {
                "key": "B",
                "text": "Secondary application of Defects of vision (myopia, hypermetropia)"
            },
            {
                "key": "C",
                "text": "Universal invariant condition across Physics"
            },
            {
                "key": "D",
                "text": "None of the above"
            }
        ],
        "correctOption": "A",
        "marks": 4,
        "negativeMarks": 0,
        "difficulty": "Medium",
        "explanation": "Standard syllabus evaluation question for Human Eye & Colourful World based on NCERT guidelines."
    },
    {
        "id": "Q-10-CHE-105",
        "testGrade": "10",
        "targetGrade": "11",
        "subject": "chemistry",
        "subjectName": "Chemistry",
        "chapterId": "c10-ch2",
        "chapterName": "Acids, Bases & Salts",
        "topic": "pH scale importance",
        "questionText": "Which of the following principles correctly applies to \"Acids, Bases & Salts\" (pH scale importance)?",
        "options": [
            {
                "key": "A",
                "text": "Primary standard rule for Acids, Bases & Salts"
            },
            {
                "key": "B",
                "text": "Secondary application of pH scale importance"
            },
            {
                "key": "C",
                "text": "Universal invariant condition across Chemistry"
            },
            {
                "key": "D",
                "text": "None of the above"
            }
        ],
        "correctOption": "A",
        "marks": 4,
        "negativeMarks": 0,
        "difficulty": "Medium",
        "explanation": "Standard syllabus evaluation question for Acids, Bases & Salts based on NCERT guidelines."
    },
    {
        "id": "Q-10-BIO-106",
        "testGrade": "10",
        "targetGrade": "11",
        "subject": "biology",
        "subjectName": "Biology",
        "chapterId": "b10-ch1",
        "chapterName": "Life Processes",
        "topic": "Nutrition in plants and humans",
        "questionText": "Which of the following principles correctly applies to \"Life Processes\" (Nutrition in plants and humans)?",
        "options": [
            {
                "key": "A",
                "text": "Primary standard rule for Life Processes"
            },
            {
                "key": "B",
                "text": "Secondary application of Nutrition in plants and humans"
            },
            {
                "key": "C",
                "text": "Universal invariant condition across Biology"
            },
            {
                "key": "D",
                "text": "None of the above"
            }
        ],
        "correctOption": "A",
        "marks": 4,
        "negativeMarks": 0,
        "difficulty": "Medium",
        "explanation": "Standard syllabus evaluation question for Life Processes based on NCERT guidelines."
    },
    {
        "id": "Q-10-BIO-107",
        "testGrade": "10",
        "targetGrade": "11",
        "subject": "biology",
        "subjectName": "Biology",
        "chapterId": "b10-ch2",
        "chapterName": "Control, Reproduction & Heredity",
        "topic": "Nervous system, reflex arc & hormones",
        "questionText": "Which of the following principles correctly applies to \"Control, Reproduction & Heredity\" (Nervous system, reflex arc & hormones)?",
        "options": [
            {
                "key": "A",
                "text": "Primary standard rule for Control, Reproduction & Heredity"
            },
            {
                "key": "B",
                "text": "Secondary application of Nervous system, reflex arc & hormones"
            },
            {
                "key": "C",
                "text": "Universal invariant condition across Biology"
            },
            {
                "key": "D",
                "text": "None of the above"
            }
        ],
        "correctOption": "A",
        "marks": 4,
        "negativeMarks": 0,
        "difficulty": "Medium",
        "explanation": "Standard syllabus evaluation question for Control, Reproduction & Heredity based on NCERT guidelines."
    },
    {
        "id": "Q-11-MAT-108",
        "testGrade": "11",
        "targetGrade": "12",
        "subject": "maths",
        "subjectName": "Mathematics",
        "chapterId": "m11-ch2",
        "chapterName": "Complex Numbers & Quadratic Equations",
        "topic": "Algebra of complex numbers",
        "questionText": "Which of the following principles correctly applies to \"Complex Numbers & Quadratic Equations\" (Algebra of complex numbers)?",
        "options": [
            {
                "key": "A",
                "text": "Primary standard rule for Complex Numbers & Quadratic Equations"
            },
            {
                "key": "B",
                "text": "Secondary application of Algebra of complex numbers"
            },
            {
                "key": "C",
                "text": "Universal invariant condition across Mathematics"
            },
            {
                "key": "D",
                "text": "None of the above"
            }
        ],
        "correctOption": "A",
        "marks": 4,
        "negativeMarks": 0,
        "difficulty": "Medium",
        "explanation": "Standard syllabus evaluation question for Complex Numbers & Quadratic Equations based on NCERT guidelines."
    },
    {
        "id": "Q-11-MAT-109",
        "testGrade": "11",
        "targetGrade": "12",
        "subject": "maths",
        "subjectName": "Mathematics",
        "chapterId": "m11-ch3",
        "chapterName": "Sequences, Series & Binomial Theorem",
        "topic": "Arithmetic & Geometric Progressions (AP/GP)",
        "questionText": "Which of the following principles correctly applies to \"Sequences, Series & Binomial Theorem\" (Arithmetic & Geometric Progressions (AP/GP))?",
        "options": [
            {
                "key": "A",
                "text": "Primary standard rule for Sequences, Series & Binomial Theorem"
            },
            {
                "key": "B",
                "text": "Secondary application of Arithmetic & Geometric Progressions (AP/GP)"
            },
            {
                "key": "C",
                "text": "Universal invariant condition across Mathematics"
            },
            {
                "key": "D",
                "text": "None of the above"
            }
        ],
        "correctOption": "A",
        "marks": 4,
        "negativeMarks": 0,
        "difficulty": "Medium",
        "explanation": "Standard syllabus evaluation question for Sequences, Series & Binomial Theorem based on NCERT guidelines."
    },
    {
        "id": "Q-11-MAT-110",
        "testGrade": "11",
        "targetGrade": "12",
        "subject": "maths",
        "subjectName": "Mathematics",
        "chapterId": "m11-ch4",
        "chapterName": "Calculus: Limits & Derivatives",
        "topic": "Intuitive limits, standard trigonometric limits",
        "questionText": "Which of the following principles correctly applies to \"Calculus: Limits & Derivatives\" (Intuitive limits, standard trigonometric limits)?",
        "options": [
            {
                "key": "A",
                "text": "Primary standard rule for Calculus: Limits & Derivatives"
            },
            {
                "key": "B",
                "text": "Secondary application of Intuitive limits, standard trigonometric limits"
            },
            {
                "key": "C",
                "text": "Universal invariant condition across Mathematics"
            },
            {
                "key": "D",
                "text": "None of the above"
            }
        ],
        "correctOption": "A",
        "marks": 4,
        "negativeMarks": 0,
        "difficulty": "Medium",
        "explanation": "Standard syllabus evaluation question for Calculus: Limits & Derivatives based on NCERT guidelines."
    },
    {
        "id": "Q-11-PHY-111",
        "testGrade": "11",
        "targetGrade": "12",
        "subject": "physics",
        "subjectName": "Physics",
        "chapterId": "p11-ch2",
        "chapterName": "Work, Energy & Power / Gravitation",
        "topic": "Work-energy theorem, potential energy curves",
        "questionText": "Which of the following principles correctly applies to \"Work, Energy & Power / Gravitation\" (Work-energy theorem, potential energy curves)?",
        "options": [
            {
                "key": "A",
                "text": "Primary standard rule for Work, Energy & Power / Gravitation"
            },
            {
                "key": "B",
                "text": "Secondary application of Work-energy theorem, potential energy curves"
            },
            {
                "key": "C",
                "text": "Universal invariant condition across Physics"
            },
            {
                "key": "D",
                "text": "None of the above"
            }
        ],
        "correctOption": "A",
        "marks": 4,
        "negativeMarks": 0,
        "difficulty": "Medium",
        "explanation": "Standard syllabus evaluation question for Work, Energy & Power / Gravitation based on NCERT guidelines."
    },
    {
        "id": "Q-11-PHY-112",
        "testGrade": "11",
        "targetGrade": "12",
        "subject": "physics",
        "subjectName": "Physics",
        "chapterId": "p11-ch3",
        "chapterName": "Thermodynamics & Oscillations",
        "topic": "First law of thermodynamics, heat engines",
        "questionText": "Which of the following principles correctly applies to \"Thermodynamics & Oscillations\" (First law of thermodynamics, heat engines)?",
        "options": [
            {
                "key": "A",
                "text": "Primary standard rule for Thermodynamics & Oscillations"
            },
            {
                "key": "B",
                "text": "Secondary application of First law of thermodynamics, heat engines"
            },
            {
                "key": "C",
                "text": "Universal invariant condition across Physics"
            },
            {
                "key": "D",
                "text": "None of the above"
            }
        ],
        "correctOption": "A",
        "marks": 4,
        "negativeMarks": 0,
        "difficulty": "Medium",
        "explanation": "Standard syllabus evaluation question for Thermodynamics & Oscillations based on NCERT guidelines."
    },
    {
        "id": "Q-11-CHE-113",
        "testGrade": "11",
        "targetGrade": "12",
        "subject": "chemistry",
        "subjectName": "Chemistry",
        "chapterId": "c11-ch1",
        "chapterName": "Structure of Atom & Periodic Trends",
        "topic": "Quantum numbers, electronic configurations",
        "questionText": "Which of the following principles correctly applies to \"Structure of Atom & Periodic Trends\" (Quantum numbers, electronic configurations)?",
        "options": [
            {
                "key": "A",
                "text": "Primary standard rule for Structure of Atom & Periodic Trends"
            },
            {
                "key": "B",
                "text": "Secondary application of Quantum numbers, electronic configurations"
            },
            {
                "key": "C",
                "text": "Universal invariant condition across Chemistry"
            },
            {
                "key": "D",
                "text": "None of the above"
            }
        ],
        "correctOption": "A",
        "marks": 4,
        "negativeMarks": 0,
        "difficulty": "Medium",
        "explanation": "Standard syllabus evaluation question for Structure of Atom & Periodic Trends based on NCERT guidelines."
    },
    {
        "id": "Q-11-CHE-114",
        "testGrade": "11",
        "targetGrade": "12",
        "subject": "chemistry",
        "subjectName": "Chemistry",
        "chapterId": "c11-ch3",
        "chapterName": "Thermodynamics & Equilibrium",
        "topic": "Enthalpy, entropy, Gibbs free energy",
        "questionText": "Which of the following principles correctly applies to \"Thermodynamics & Equilibrium\" (Enthalpy, entropy, Gibbs free energy)?",
        "options": [
            {
                "key": "A",
                "text": "Primary standard rule for Thermodynamics & Equilibrium"
            },
            {
                "key": "B",
                "text": "Secondary application of Enthalpy, entropy, Gibbs free energy"
            },
            {
                "key": "C",
                "text": "Universal invariant condition across Chemistry"
            },
            {
                "key": "D",
                "text": "None of the above"
            }
        ],
        "correctOption": "A",
        "marks": 4,
        "negativeMarks": 0,
        "difficulty": "Medium",
        "explanation": "Standard syllabus evaluation question for Thermodynamics & Equilibrium based on NCERT guidelines."
    }
];

/**
 * Filters the question bank strictly by the selected chapter IDs and test grade.
 * Guarantees zero leakage from unselected chapters.
 */
export function getQuestionsByChapters(selectedChapterIds, testGrade) {
    if (!selectedChapterIds || selectedChapterIds.length === 0) {
        return CBT_QUESTION_BANK.filter((q) => String(q.testGrade) === String(testGrade));
    }

    const chapterSet = new Set(selectedChapterIds);
    return CBT_QUESTION_BANK.filter(
        (q) => String(q.testGrade) === String(testGrade) && chapterSet.has(q.chapterId)
    );
}

/**
 * Returns question count breakdown per subject for a given set of chapters.
 */
export function getQuestionDistribution(selectedChapterIds, testGrade) {
    const questions = getQuestionsByChapters(selectedChapterIds, testGrade);
    const distribution = {};

    questions.forEach((q) => {
        if (!distribution[q.subject]) {
            distribution[q.subject] = {
                subjectName: q.subjectName,
                count: 0,
                totalMarks: 0,
            };
        }
        distribution[q.subject].count += 1;
        distribution[q.subject].totalMarks += q.marks || 1;
    });

    return distribution;
}
