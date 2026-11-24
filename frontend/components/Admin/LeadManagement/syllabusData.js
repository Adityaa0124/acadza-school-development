/**
 * Standard CBSE / NCERT Entrance Test Curriculum Database.
 * Core School Admission Principle:
 * An applicant seeking admission to Target Grade N is tested on the
 * prerequisite mastery of Grade (N - 1).
 *
 * e.g.:
 * - Admitted to Grade 6  => Tested on Grade 5 Syllabus
 * - Admitted to Grade 7  => Tested on Grade 6 Syllabus
 * - Admitted to Grade 8  => Tested on Grade 7 Syllabus
 * - Admitted to Grade 9  => Tested on Grade 8 Syllabus
 * - Admitted to Grade 10 => Tested on Grade 9 Syllabus
 * - Admitted to Grade 11 => Tested on Grade 10 Syllabus
 * - Admitted to Grade 12 => Tested on Grade 11 Syllabus
 */

export const SYLLABUS_BY_TARGET_GRADE = {
    // -------------------------------------------------------------
    // Target Grade 6 (Evaluates Grade 5 Prerequisite Knowledge)
    // -------------------------------------------------------------
    '6': {
        targetGrade: '6',
        testGrade: '5',
        label: 'Grade 5 Curriculum (for Grade 6 Admission)',
        description: 'Standard foundation test covering primary arithmetic, general environmental science, and basic language skills.',
        subjects: [
            {
                id: 'maths',
                name: 'Mathematics',
                isCore: true,
                chapters: [
                    {
                        id: 'm5-ch1',
                        name: 'Large Numbers & Place Value',
                        topics: ['Numbers up to 7-8 digits', 'Indian & International systems', 'Rounding off & estimation'],
                    },
                    {
                        id: 'm5-ch2',
                        name: 'Factors and Multiples',
                        topics: ['Prime & Composite numbers', 'Divisibility rules (2, 3, 5, 9, 10)', 'HCF & LCM word problems'],
                    },
                    {
                        id: 'm5-ch3',
                        name: 'Fractions & Operations',
                        topics: ['Proper, improper & mixed fractions', 'Equivalent fractions', 'Addition & subtraction of fractions'],
                    },
                    {
                        id: 'm5-ch4',
                        name: 'Decimals in Daily Life',
                        topics: ['Place value of tenths & hundredths', 'Fractions to decimals conversion', 'Decimal addition & subtraction'],
                    },
                    {
                        id: 'm5-ch5',
                        name: 'Shapes, Angles & Perimeter',
                        topics: ['Right, acute, and obtuse angles', 'Perimeter of rectangles and squares', 'Basic area concept'],
                    },
                    {
                        id: 'm5-ch6',
                        name: 'Measurement & Unit Conversions',
                        topics: ['Length (km, m, cm, mm)', 'Weight (kg, g)', 'Capacity (L, mL) word problems'],
                    },
                ],
            },
            {
                id: 'science',
                name: 'General Science & EVS',
                isCore: true,
                chapters: [
                    {
                        id: 's5-ch1',
                        name: 'Super Senses & Animal Life',
                        topics: ['Animal sensory organs', 'Nocturnal adaptations', 'Endangered species & protection'],
                    },
                    {
                        id: 's5-ch2',
                        name: 'From Tasting to Digesting',
                        topics: ['Tongue taste receptors', 'Human digestive path', 'Balanced diet & malnutrition'],
                    },
                    {
                        id: 's5-ch3',
                        name: 'Seeds and Seed Dispersal',
                        topics: ['Seed germination requirements', 'Dispersal by wind, water & animals', 'Parts of a seedling'],
                    },
                    {
                        id: 's5-ch4',
                        name: 'Water & Its Properties',
                        topics: ['Solubility, floating and sinking', 'Evaporation & condensation', 'Water cycle & conservation'],
                    },
                    {
                        id: 's5-ch5',
                        name: 'Sun, Moon & Space',
                        topics: ['Gravity basics', 'Phases of the moon', 'Day and night phenomenon'],
                    },
                ],
            },
            {
                id: 'english',
                name: 'English & Grammar',
                isCore: false,
                chapters: [
                    {
                        id: 'e5-ch1',
                        name: 'Reading Comprehension',
                        topics: ['Unseen passage facts', 'Vocabulary from context', 'Finding main themes'],
                    },
                    {
                        id: 'e5-ch2',
                        name: 'Grammar Essentials',
                        topics: ['Nouns & Pronouns', 'Action verbs & basic tenses', 'Adjectives & comparison degrees'],
                    },
                    {
                        id: 'e5-ch3',
                        name: 'Sentence Construction',
                        topics: ['Punctuation & capital letters', 'Conjunctions (and, but, because)', 'Prepositions of place'],
                    },
                ],
            },
            {
                id: 'aptitude',
                name: 'Mental Ability',
                isCore: false,
                chapters: [
                    {
                        id: 'a5-ch1',
                        name: 'Patterns & Reasoning',
                        topics: ['Number & letter sequences', 'Odd one out', 'Shape rotations and symmetry'],
                    },
                ],
            },
        ],
    },

    // -------------------------------------------------------------
    // Target Grade 7 (Evaluates Grade 6 Prerequisite Knowledge)
    // -------------------------------------------------------------
    '7': {
        targetGrade: '7',
        testGrade: '6',
        label: 'Grade 6 Curriculum (for Grade 7 Admission)',
        description: 'Middle school entrance test covering integers, basic algebra, science concepts, and analytical reasoning.',
        subjects: [
            {
                id: 'maths',
                name: 'Mathematics',
                isCore: true,
                chapters: [
                    {
                        id: 'm6-ch1',
                        name: 'Knowing Our Numbers',
                        topics: ['Large numbers & place value', 'Estimation & brackets', 'Roman numerals'],
                    },
                    {
                        id: 'm6-ch2',
                        name: 'Whole Numbers & Integers',
                        topics: ['Properties of whole numbers', 'Negative numbers concept', 'Integer arithmetic on number lines'],
                    },
                    {
                        id: 'm6-ch3',
                        name: 'Playing with Numbers',
                        topics: ['Prime & composite numbers', 'Divisibility rules', 'HCF & LCM methods'],
                    },
                    {
                        id: 'm6-ch4',
                        name: 'Fractions & Decimals',
                        topics: ['Types of fractions', 'Decimal operations', 'Word applications'],
                    },
                    {
                        id: 'm6-ch5',
                        name: 'Introduction to Algebra',
                        topics: ['Algebraic variables', 'Writing expressions', 'Simple linear equations'],
                    },
                    {
                        id: 'm6-ch6',
                        name: 'Basic Geometry & Mensuration',
                        topics: ['Points, lines, rays, angles', 'Triangles & quadrilaterals', 'Perimeter & area of rectangles'],
                    },
                ],
            },
            {
                id: 'science',
                name: 'General Science',
                isCore: true,
                chapters: [
                    {
                        id: 's6-ch1',
                        name: 'Components of Food',
                        topics: ['Nutrients (carbs, proteins, fats)', 'Deficiency diseases', 'Balanced nutrition'],
                    },
                    {
                        id: 's6-ch2',
                        name: 'Separation of Substances',
                        topics: ['Threshing, winnowing, sieving', 'Sedimentation & decantation', 'Evaporation & condensation'],
                    },
                    {
                        id: 's6-ch3',
                        name: 'Getting to Know Plants',
                        topics: ['Herbs, shrubs, trees', 'Parts of a leaf & venation', 'Flower structure (stamen, pistil)'],
                    },
                    {
                        id: 's6-ch4',
                        name: 'Motion & Measurement',
                        topics: ['SI standard units', 'Types of motion (rectilinear, circular, periodic)'],
                    },
                    {
                        id: 's6-ch5',
                        name: 'Light, Shadows & Reflections',
                        topics: ['Transparent, opaque, translucent', 'Shadow formation', 'Pinhole cameras & plane mirrors'],
                    },
                    {
                        id: 's6-ch6',
                        name: 'Electricity & Magnets',
                        topics: ['Electric cell & circuit diagrams', 'Switches & conductors', 'Magnetic poles & attraction rules'],
                    },
                ],
            },
            {
                id: 'english',
                name: 'English & Aptitude',
                isCore: false,
                chapters: [
                    {
                        id: 'e6-ch1',
                        name: 'Grammar & Vocabulary',
                        topics: ['Tenses (present, past, continuous)', 'Prepositions & conjunctions', 'Synonyms and antonyms'],
                    },
                    {
                        id: 'e6-ch2',
                        name: 'Logical Reasoning',
                        topics: ['Number series', 'Analogies & classification', 'Direction sense'],
                    },
                ],
            },
        ],
    },

    // -------------------------------------------------------------
    // Target Grade 8 (Evaluates Grade 7 Prerequisite Knowledge)
    // -------------------------------------------------------------
    '8': {
        targetGrade: '8',
        testGrade: '7',
        label: 'Grade 7 Curriculum (for Grade 8 Admission)',
        description: 'Covers rational numbers, linear equations, nutrition, physical/chemical changes, and heat transfer.',
        subjects: [
            {
                id: 'maths',
                name: 'Mathematics',
                isCore: true,
                chapters: [
                    {
                        id: 'm7-ch1',
                        name: 'Integers & Rational Numbers',
                        topics: ['Multiplication & division of integers', 'Properties of rational numbers', 'Representation on number lines'],
                    },
                    {
                        id: 'm7-ch2',
                        name: 'Simple Equations',
                        topics: ['Forming equations from statements', 'Transposition method', 'Word problem modeling'],
                    },
                    {
                        id: 'm7-ch3',
                        name: 'Lines, Angles & Triangles',
                        topics: ['Complementary & supplementary angles', 'Transversal angle pairs', 'Pythagoras property'],
                    },
                    {
                        id: 'm7-ch4',
                        name: 'Comparing Quantities',
                        topics: ['Ratios and percentages', 'Profit and loss percentages', 'Simple interest formula'],
                    },
                    {
                        id: 'm7-ch5',
                        name: 'Algebraic Expressions & Exponents',
                        topics: ['Terms, factors & coefficients', 'Addition & subtraction of expressions', 'Laws of exponents'],
                    },
                    {
                        id: 'm7-ch6',
                        name: 'Perimeter and Area',
                        topics: ['Area of parallelograms and triangles', 'Circumference & area of circles'],
                    },
                ],
            },
            {
                id: 'science',
                name: 'Science',
                isCore: true,
                chapters: [
                    {
                        id: 's7-ch1',
                        name: 'Nutrition in Plants & Animals',
                        topics: ['Photosynthesis mechanism', 'Human digestive system', 'Ruminants digestion'],
                    },
                    {
                        id: 's7-ch2',
                        name: 'Heat & Temperature',
                        topics: ['Conduction, convection, radiation', 'Clinical & laboratory thermometers', 'Sea breeze & land breeze'],
                    },
                    {
                        id: 's7-ch3',
                        name: 'Acids, Bases & Chemical Changes',
                        topics: ['Indicators (litmus, phenolphthalein)', 'Neutralization reactions', 'Rusting & crystallization'],
                    },
                    {
                        id: 's7-ch4',
                        name: 'Respiration & Transportation',
                        topics: ['Aerobic vs anaerobic breathing', 'Human circulatory system & heart', 'Xylem and phloem transport'],
                    },
                    {
                        id: 's7-ch5',
                        name: 'Motion, Electric Current & Light',
                        topics: ['Speed calculation & distance-time graphs', 'Heating effect & electric fuses', 'Spherical mirrors & lenses'],
                    },
                ],
            },
            {
                id: 'english',
                name: 'English & Reasoning',
                isCore: false,
                chapters: [
                    {
                        id: 'e7-ch1',
                        name: 'Applied Grammar',
                        topics: ['Active and passive voice', 'Direct & indirect speech basics', 'Subject-verb concord'],
                    },
                    {
                        id: 'e7-ch2',
                        name: 'Aptitude & Logic',
                        topics: ['Coding-decoding', 'Blood relations', 'Venn diagram deduction'],
                    },
                ],
            },
        ],
    },

    // -------------------------------------------------------------
    // Target Grade 9 (Evaluates Grade 8 Prerequisite Knowledge)
    // -------------------------------------------------------------
    '9': {
        targetGrade: '9',
        testGrade: '8',
        label: 'Grade 8 Curriculum (for Grade 9 Admission)',
        description: 'Crucial high school foundation test covering algebra, mensuration, cell biology, force, sound, and chemistry.',
        subjects: [
            {
                id: 'maths',
                name: 'Mathematics',
                isCore: true,
                chapters: [
                    {
                        id: 'm8-ch1',
                        name: 'Rational Numbers & Linear Equations',
                        topics: ['Properties of rational numbers', 'Linear equations with variables on both sides', 'Applied word problems'],
                    },
                    {
                        id: 'm8-ch2',
                        name: 'Quadrilaterals & Practical Geometry',
                        topics: ['Types and properties of quadrilaterals', 'Angle sum property of polygons', 'Special parallelograms'],
                    },
                    {
                        id: 'm8-ch3',
                        name: 'Squares, Cubes & Roots',
                        topics: ['Square roots by prime factor & division', 'Cube roots by estimation'],
                    },
                    {
                        id: 'm8-ch4',
                        name: 'Comparing Quantities (Commercial Maths)',
                        topics: ['Discounts & GST calculation', 'Compound interest formula'],
                    },
                    {
                        id: 'm8-ch5',
                        name: 'Algebraic Identities & Factorisation',
                        topics: ['Standard identities (a+b)², (a-b)², a²-b²', 'Factorisation by grouping & identities', 'Division of polynomials'],
                    },
                    {
                        id: 'm8-ch6',
                        name: 'Mensuration (3D Geometry)',
                        topics: ['Surface area of cube, cuboid, cylinder', 'Volume and capacity conversions'],
                    },
                    {
                        id: 'm8-ch7',
                        name: 'Exponents, Powers & Graphs',
                        topics: ['Negative and fractional exponents', 'Cartesian coordinates & linear graphs'],
                    },
                ],
            },
            {
                id: 'science',
                name: 'Science',
                isCore: true,
                chapters: [
                    {
                        id: 's8-ch1',
                        name: 'Cell Structure & Microorganisms',
                        topics: ['Plant vs animal cell organelles', 'Prokaryotic vs eukaryotic cells', 'Bacteria, fungi, viruses & immunity'],
                    },
                    {
                        id: 's8-ch2',
                        name: 'Metals, Non-Metals & Fuels',
                        topics: ['Physical & chemical properties of metals', 'Reactivity with acids & oxygen', 'Fossil fuels & combustion types'],
                    },
                    {
                        id: 's8-ch3',
                        name: 'Reproduction & Adolescence',
                        topics: ['Asexual vs sexual reproduction in animals', 'Endocrine glands & hormones', 'Secondary sexual characteristics'],
                    },
                    {
                        id: 's8-ch4',
                        name: 'Force, Pressure & Friction',
                        topics: ['Contact & non-contact forces', 'Atmospheric & liquid pressure', 'Factors affecting friction & reduction'],
                    },
                    {
                        id: 's8-ch5',
                        name: 'Sound & Chemical Effects of Current',
                        topics: ['Vibrations, amplitude, frequency & pitch', 'Human ear anatomy', 'Electrolysis & electroplating'],
                    },
                    {
                        id: 's8-ch6',
                        name: 'Light & Optical Phenomena',
                        topics: ['Laws of reflection & regular/diffuse', 'Multiple reflections & kaleidoscope', 'Human eye defects & care'],
                    },
                ],
            },
            {
                id: 'aptitude',
                name: 'Mental Aptitude (MAT)',
                isCore: false,
                chapters: [
                    {
                        id: 'a8-ch1',
                        name: 'Advanced Logical Reasoning',
                        topics: ['Syllogisms & logic deductions', 'Seating arrangement puzzles', 'Data sufficiency'],
                    },
                ],
            },
        ],
    },

    // -------------------------------------------------------------
    // Target Grade 10 (Evaluates Grade 9 Prerequisite Knowledge)
    // -------------------------------------------------------------
    '10': {
        targetGrade: '10',
        testGrade: '9',
        label: 'Grade 9 Curriculum (for Grade 10 Admission)',
        description: 'Secondary stage evaluation covering coordinate geometry, polynomials, mechanics, matter, and cellular tissues.',
        subjects: [
            {
                id: 'maths',
                name: 'Mathematics',
                isCore: true,
                chapters: [
                    {
                        id: 'm9-ch1',
                        name: 'Number Systems & Polynomials',
                        topics: ['Real numbers & irrationality proofs', 'Remainder and Factor theorems', 'Algebraic identities of degree 3'],
                    },
                    {
                        id: 'm9-ch2',
                        name: 'Coordinate Geometry & Linear Equations',
                        topics: ['Cartesian plane graphing', 'Equations in two variables (ax + by + c = 0)'],
                    },
                    {
                        id: 'm9-ch3',
                        name: 'Lines, Angles & Triangle Congruence',
                        topics: ['Axioms & theorems on parallel lines', 'Congruence criteria (SAS, ASA, SSS, RHS)', 'Inequalities in a triangle'],
                    },
                    {
                        id: 'm9-ch4',
                        name: 'Quadrilaterals, Circles & Heron’s Formula',
                        topics: ['Mid-point theorem', 'Chords and angles subtended by arcs', 'Area of triangles by Heron’s formula'],
                    },
                    {
                        id: 'm9-ch5',
                        name: 'Surface Areas, Volumes & Statistics',
                        topics: ['Cones, spheres, and hemispheres', 'Histograms & frequency polygons'],
                    },
                ],
            },
            {
                id: 'science',
                name: 'Science (Physics, Chemistry, Biology)',
                isCore: true,
                chapters: [
                    {
                        id: 's9-ch1',
                        name: 'Motion, Force & Laws of Motion',
                        topics: ['Equations of motion (v=u+at, s=ut+½at²)', 'Newton’s three laws of motion', 'Conservation of momentum'],
                    },
                    {
                        id: 's9-ch2',
                        name: 'Gravitation, Work & Energy',
                        topics: ['Universal law of gravitation', 'Mass vs weight, Archimedes principle', 'Kinetic & potential energy, power'],
                    },
                    {
                        id: 's9-ch3',
                        name: 'Matter & Atomic Structure',
                        topics: ['States of matter & latent heat', 'Solutions, colloids & suspensions', 'Mole concept & Bohr model of atom'],
                    },
                    {
                        id: 's9-ch4',
                        name: 'Cell Biology & Plant/Animal Tissues',
                        topics: ['Cell membrane transport (osmosis)', 'Meristematic & permanent plant tissues', 'Connective, muscular & nervous tissues'],
                    },
                ],
            },
        ],
    },

    // -------------------------------------------------------------
    // Target Grade 11 (Evaluates Grade 10 Prerequisite Knowledge)
    // -------------------------------------------------------------
    '11': {
        targetGrade: '11',
        testGrade: '10',
        label: 'Grade 10 Curriculum (for Grade 11 Stream Admission)',
        description: 'Comprehensive 10th Board evaluation for Science (JEE/NEET foundation), Commerce, and Arts admission.',
        subjects: [
            {
                id: 'maths',
                name: 'Mathematics',
                isCore: true,
                chapters: [
                    {
                        id: 'm10-ch1',
                        name: 'Real Numbers & Polynomials',
                        topics: ['Fundamental Theorem of Arithmetic', 'Relationship between zeroes & coefficients', 'Division algorithm'],
                    },
                    {
                        id: 'm10-ch2',
                        name: 'Linear Equations & Quadratic Equations',
                        topics: ['Pair of linear equations in 2 variables', 'Quadratic formula & nature of roots (D=b²-4ac)'],
                    },
                    {
                        id: 'm10-ch3',
                        name: 'Arithmetic Progressions',
                        topics: ['nth term of an AP', 'Sum of first n terms', 'Application word problems'],
                    },
                    {
                        id: 'm10-ch4',
                        name: 'Triangles & Coordinate Geometry',
                        topics: ['Basic Proportionality Theorem (Thales)', 'Similarity criteria', 'Distance and section formulae'],
                    },
                    {
                        id: 'm10-ch5',
                        name: 'Trigonometry & Applications',
                        topics: ['Trigonometric ratios & identities', 'Standard angles (0°, 30°, 45°, 60°, 90°)', 'Heights and distances word problems'],
                    },
                    {
                        id: 'm10-ch6',
                        name: 'Circles, Areas & Volumes',
                        topics: ['Tangents from an external point', 'Sectors & segments of circles', 'Surface area and volume of combined solids'],
                    },
                    {
                        id: 'm10-ch7',
                        name: 'Statistics & Probability',
                        topics: ['Mean, median, mode of grouped data', 'Theoretical probability concepts'],
                    },
                ],
            },
            {
                id: 'physics',
                name: 'Physics',
                isCore: true,
                chapters: [
                    {
                        id: 'p10-ch1',
                        name: 'Light: Reflection & Refraction',
                        topics: ['Mirror & lens formulae, magnification', 'Ray diagrams for spherical mirrors & lenses', 'Refractive index & Snell’s law'],
                    },
                    {
                        id: 'p10-ch2',
                        name: 'Human Eye & Colourful World',
                        topics: ['Defects of vision (myopia, hypermetropia)', 'Prism dispersion & rainbow', 'Atmospheric refraction & scattering'],
                    },
                    {
                        id: 'p10-ch3',
                        name: 'Electricity & Magnetic Effects',
                        topics: ['Ohm’s law, resistance & resistivity', 'Series & parallel combinations, Joule heating', 'Magnetic field lines, solenoid, Fleming’s rules'],
                    },
                ],
            },
            {
                id: 'chemistry',
                name: 'Chemistry',
                isCore: true,
                chapters: [
                    {
                        id: 'c10-ch1',
                        name: 'Chemical Reactions & Equations',
                        topics: ['Balancing chemical equations', 'Combination, decomposition, displacement, redox', 'Corrosion & rancidity'],
                    },
                    {
                        id: 'c10-ch2',
                        name: 'Acids, Bases & Salts',
                        topics: ['pH scale importance', 'Preparation & uses of bleaching powder, baking soda, POP', 'Neutralization & water of crystallization'],
                    },
                    {
                        id: 'c10-ch3',
                        name: 'Metals, Non-Metals & Carbon Compounds',
                        topics: ['Reactivity series & ionic compounds', 'Covalent bonding in carbon', 'Homologous series, functional groups & combustion'],
                    },
                ],
            },
            {
                id: 'biology',
                name: 'Biology',
                isCore: false,
                chapters: [
                    {
                        id: 'b10-ch1',
                        name: 'Life Processes',
                        topics: ['Nutrition in plants and humans', 'Respiration & ATP production', 'Human circulatory system & excretion'],
                    },
                    {
                        id: 'b10-ch2',
                        name: 'Control, Reproduction & Heredity',
                        topics: ['Nervous system, reflex arc & hormones', 'Asexual & sexual reproduction', 'Mendel’s monohybrid & dihybrid cross'],
                    },
                ],
            },
        ],
    },

    // -------------------------------------------------------------
    // Target Grade 12 (Evaluates Grade 11 Prerequisite Knowledge)
    // -------------------------------------------------------------
    '12': {
        targetGrade: '12',
        testGrade: '11',
        label: 'Grade 11 Curriculum (for Grade 12 Admission)',
        description: 'Advanced Senior Secondary test across Higher Mathematics, Mechanics, Physical Chemistry, and Biological systems.',
        subjects: [
            {
                id: 'maths',
                name: 'Mathematics',
                isCore: true,
                chapters: [
                    {
                        id: 'm11-ch1',
                        name: 'Sets, Relations & Functions',
                        topics: ['Types of sets, Venn diagrams', 'Domain, codomain and range of functions'],
                    },
                    {
                        id: 'm11-ch2',
                        name: 'Complex Numbers & Quadratic Equations',
                        topics: ['Algebra of complex numbers', 'Modulus and conjugate', 'Roots with negative discriminant'],
                    },
                    {
                        id: 'm11-ch3',
                        name: 'Sequences, Series & Binomial Theorem',
                        topics: ['Arithmetic & Geometric Progressions (AP/GP)', 'Binomial expansion general term'],
                    },
                    {
                        id: 'm11-ch4',
                        name: 'Calculus: Limits & Derivatives',
                        topics: ['Intuitive limits, standard trigonometric limits', 'First-order derivative of polynomials & trig functions'],
                    },
                ],
            },
            {
                id: 'physics',
                name: 'Physics',
                isCore: true,
                chapters: [
                    {
                        id: 'p11-ch1',
                        name: 'Kinematics & Laws of Motion',
                        topics: ['Vectors & projectile motion', 'Newton’s laws & circular dynamics'],
                    },
                    {
                        id: 'p11-ch2',
                        name: 'Work, Energy & Power / Gravitation',
                        topics: ['Work-energy theorem, potential energy curves', 'Kepler’s laws, escape velocity, satellites'],
                    },
                    {
                        id: 'p11-ch3',
                        name: 'Thermodynamics & Oscillations',
                        topics: ['First law of thermodynamics, heat engines', 'Simple Harmonic Motion (SHM) & wave equation'],
                    },
                ],
            },
            {
                id: 'chemistry',
                name: 'Chemistry',
                isCore: true,
                chapters: [
                    {
                        id: 'c11-ch1',
                        name: 'Structure of Atom & Periodic Trends',
                        topics: ['Quantum numbers, electronic configurations', 'Ionization enthalpy, electronegativity trends'],
                    },
                    {
                        id: 'c11-ch2',
                        name: 'Chemical Bonding & Molecular Structure',
                        topics: ['Lewis dot structures, VSEPR theory', 'Hybridization (sp, sp², sp³), Hydrogen bonding'],
                    },
                    {
                        id: 'c11-ch3',
                        name: 'Thermodynamics & Equilibrium',
                        topics: ['Enthalpy, entropy, Gibbs free energy', 'Le Chatelier’s principle, pH of buffer solutions'],
                    },
                ],
            },
        ],
    },
};

/**
 * Helper: Resolve syllabus definition for any requested target grade.
 * Falls back to Grade 7 (Grade 6 test) if unspecified.
 */
export function getSyllabusForTargetGrade(targetGrade) {
    const key = String(targetGrade || '7');
    return SYLLABUS_BY_TARGET_GRADE[key] || SYLLABUS_BY_TARGET_GRADE['7'];
}

/**
 * Helper: Generate initial selections for a given preset.
 * Preset options:
 * - 'full': All subjects, all chapters, all topics
 * - 'core': Core STEM subjects only (Maths & Science), all chapters & topics
 */
export function getPresetSelection(syllabus, presetType = 'full') {
    const selectedSubjects = {};

    syllabus.subjects.forEach((subj) => {
        if (presetType === 'core' && !subj.isCore) {
            return; // Skip non-core subjects for core STEM preset
        }

        const selectedChapters = {};
        subj.chapters.forEach((ch) => {
            selectedChapters[ch.id] = {
                chapterName: ch.name,
                topics: [...ch.topics], // All topics included
            };
        });

        selectedSubjects[subj.id] = {
            subjectName: subj.name,
            chapters: selectedChapters,
        };
    });

    return selectedSubjects;
}

/**
 * Helper: Calculate human-readable portion metrics (e.g. "2 Subjects, 11 Chapters, 34 Topics").
 */
export function calculatePortionSummary(selectedSubjects) {
    const subjectKeys = Object.keys(selectedSubjects || {});
    let totalChapters = 0;
    let totalTopics = 0;

    subjectKeys.forEach((sId) => {
        const chapters = selectedSubjects[sId]?.chapters || {};
        const chKeys = Object.keys(chapters);
        totalChapters += chKeys.length;
        chKeys.forEach((cId) => {
            totalTopics += (chapters[cId]?.topics || []).length;
        });
    });

    return {
        subjectCount: subjectKeys.length,
        chapterCount: totalChapters,
        topicCount: totalTopics,
        summaryLabel: `${subjectKeys.length} Subject${subjectKeys.length === 1 ? '' : 's'}, ${totalChapters} Chapter${totalChapters === 1 ? '' : 's'}, ${totalTopics} Topic${totalTopics === 1 ? '' : 's'}`,
    };
}
