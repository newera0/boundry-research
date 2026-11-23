/*
  Public research summaries, written for this website.
  These are working notes, NOT independently verified mathematical results.
  To publish a new entry, append an item in updates and adjust the dates/statuses below.
*/
window.BOUNDARY_DATA = {
  project: {
    name: 'BOUNDARY',
    title: 'P versus NP, in public.',
    status: 'Unsolved',
    phase: 'Investigating a candidate counting barrier',
    lastUpdated: '2026-11-22',
    cycles: 15,
    proofStatus: 'No accepted proof',
    verification: 'Independent verification not completed'
  },
  tracks: [
    {
      id: 'proof-complexity', number: '01', icon: 'grid', name: 'Proof complexity',
      label: 'Barrier mapped', status: 'barrier',
      summary: 'Examining whether resolution width or affine extraction forces hard proofs for structured SAT instances.',
      plain: 'We tested whether familiar proof techniques run into unavoidable obstacles on selected Boolean puzzles. Some examples turn out to have short proofs, so a universal claim would be too strong.',
      technical: 'Tseitin/resolution-width and affine-extraction obstructions were explored. Compact parity derivations and easy counting arguments block a naive lower-bound transfer.',
      lesson: 'Compact parity proofs prevent an overly broad hardness claim.'
    },
    {
      id: 'prime-modulus', number: '02', icon: 'hash', name: 'Prime-modulus counting',
      label: 'Conditional path', status: 'conditional',
      summary: 'Studying weighted solution polynomials and what can be learned by evaluating them modulo primes.',
      plain: 'We tried encoding possible solutions into a polynomial and asking what the polynomial can reveal. The key evaluation problem appears to carry much of the original difficulty.',
      technical: 'Weighted solution-polynomial zero testing intersects ⊕P-complete behavior. Random isolation offers a conditional NP=RP-style implication, not a deterministic polynomial-time algorithm.',
      lesson: 'The desired fast evaluation routine has not been obtained.'
    },
    {
      id: 'pairing-slices', number: '03', icon: 'layers', name: 'Pairing-slice hierarchy',
      label: 'Active investigation', status: 'active',
      summary: 'Testing whether bounded-degree pairing slices can cover overlapping weighted-score patterns.',
      plain: 'Imagine pairing up many potential solutions so their contributions cancel. We want to know whether simple pairing rules can ever cover every difficult instance efficiently.',
      technical: 'The notebook records an explicit binary-weight fixed-degree hierarchy distinguishing degree-q from degree-(q+1) slice pairings. The next task is an overlap-aware coverage bound with polynomially bounded deterministic hard families.',
      lesson: 'A scalable deterministic lower bound is still missing.'
    },
    {
      id: 'verification', number: '04', icon: 'shield', name: 'Verification & critique',
      label: 'Always running', status: 'active',
      summary: 'Stress-testing assumptions and searching for counterexamples before elevating any claim.',
      plain: 'A clever argument is only a starting point. Every step needs clear assumptions, reproducible examples, and criticism from other researchers.',
      technical: 'Explicit counterexamples, model assumptions, asymptotic quantifiers, proof-system restrictions, reproducible calculations, and outside review are required before any theorem claim.',
      lesson: 'There is no independently verified P ≠ NP or P = NP result here.'
    }
  ],
  updates: [
    {
      id: 'update-07', date: '2026-11-22', tag: 'CURRENT FRONTIER', category: 'open', title: 'The overlap problem becomes the next target',
      plain: 'The latest research question asks whether overlapping score patterns leave enough uncovered cases that a simple cancellation method cannot handle them all.',
      technical: 'Target: formalize and bound the union of degree-q pairing slices under overlapping weighted scores, and investigate polynomial-bounded deterministic hard families.',
      outcome: 'Open question', detail: 'A proposed line of attack, not a validated lower bound.', track: 'pairing-slices'
    },
    {
      id: 'update-06', date: '2026-11-21', tag: 'WORKING LEMMA', category: 'conditional', title: 'Fixed-degree pairing hierarchy explored',
      plain: 'A restricted example suggests that adding one degree of freedom can make some cancellation patterns possible that were not available at a lower degree.',
      technical: 'An explicit binary-weight fixed-degree construction was recorded separating degree-q and degree-(q+1) slice pairings in a restricted setting.',
      outcome: 'Working notebook claim', detail: 'Needs independent reconstruction; not a general complexity separation.', track: 'pairing-slices'
    },
    {
      id: 'update-05', date: '2026-11-21', tag: 'OBSTRUCTION', category: 'barrier', title: 'Polynomial zero testing retains hard structure',
      plain: 'Turning the question into algebra did not make the hard part disappear. The step we need to compute efficiently remains unresolved.',
      technical: 'Weighted solution-polynomial zero testing encounters parity-counting complexity; no polynomial-time deterministic evaluation algorithm was established.',
      outcome: 'Bottleneck identified', detail: 'Reformulating a hard problem does not, by itself, solve it.', track: 'prime-modulus'
    },
    {
      id: 'update-04', date: '2026-11-21', tag: 'CONDITIONAL', category: 'conditional', title: 'Isolation route connects to randomized complexity',
      plain: 'Random weights could sometimes isolate a solution, but this route requires an additional algorithmic breakthrough.',
      technical: 'Isolation-style random weights provide a conditional route with NP=RP consequences given efficient evaluation, not a claim that NP=RP.',
      outcome: 'Conditional implication', detail: 'The required fast evaluation method has not been supplied.', track: 'prime-modulus'
    },
    {
      id: 'update-03', date: '2026-11-21', tag: 'COUNTEREXAMPLE', category: 'barrier', title: 'Matching plus parity can encode 3-SAT',
      plain: 'A restricted-looking representation can still express very hard problems. That means its apparent simplicity cannot be treated as a proof of easiness.',
      technical: 'The matching-plus-parity framework can recover 3-SAT structure, obstructing a naive general lower-bound bridge.',
      outcome: 'Overbroad approach rejected', detail: 'A useful failure: the family is more expressive than first assumed.', track: 'proof-complexity'
    },
    {
      id: 'update-02', date: '2026-11-21', tag: 'COUNTEREXAMPLE', category: 'barrier', title: 'Short parity proofs defeat a simple width argument',
      plain: 'Certain puzzles that appeared difficult have unexpectedly compact ways of being proved inconsistent.',
      technical: 'Compact parity derivations and easily counted pigeonhole structures defeat the simplest transfer from width or counting to a general lower bound.',
      outcome: 'Candidate route narrowed', detail: 'Hard examples alone do not establish universal hardness.', track: 'proof-complexity'
    },
    {
      id: 'update-01', date: '2026-11-21', tag: 'RESEARCH START', category: 'milestone', title: 'The first fifteen investigation cycles consolidated',
      plain: 'We began by mapping several proof strategies and recording what each does and does not show.',
      technical: 'Notebook rounds 1–15 considered Tseitin formulas, resolution width, affine extraction, parity proofs, counting, and matching-based encodings.',
      outcome: 'Research record started', detail: 'This is a condensed project log, not a verbatim archive or a referee-checked paper.', track: 'proof-complexity'
    }
  ],
  challenges: [
    { id: 'challenge-1', index: 'A', field: 'Combinatorics', difficulty: 'HIGH PRIORITY', title: 'Prove or refute a coverage bound',
      question: 'Can the union of overlapping degree-q pairing slices be bounded sharply enough to leave an explicit hard family?',
      need: 'A formal statement, a proof attempt, or a counterexample with small q.', icon: 'target' },
    { id: 'challenge-2', index: 'B', field: 'Complexity theory', difficulty: 'OPEN', title: 'Find the missing reduction',
      question: 'What precise reduction, if any, transports a restricted slice lower bound into a standard model of computation?',
      need: 'Identify the computation model, overhead, uniformity, and quantifiers.', icon: 'link' },
    { id: 'challenge-3', index: 'C', field: 'Algebra & algorithms', difficulty: 'OPEN', title: 'Stress-test the polynomial route',
      question: 'Can a small example defeat the proposed zero-testing or isolation step, or clarify the needed assumptions?',
      need: 'Executable examples, explicit countercases, or a rigorous conditional theorem.', icon: 'flask' }
  ],
  glossary: [
    { term: 'P', definition: 'Decision problems solvable in polynomial time by a deterministic algorithm.' },
    { term: 'NP', definition: 'Decision problems whose yes-instances have polynomial-size certificates verifiable in polynomial time.' },
    { term: '3-SAT', definition: 'The satisfiability problem for Boolean formulas in conjunctive normal form with at most three literals per clause.' },
    { term: 'Lower bound', definition: 'A proof that every algorithm or proof within a specified model needs at least some amount of time, space, or size.' },
    { term: '⊕P', definition: 'A counting complexity class associated with deciding whether the number of accepting computations is odd.' }
  ]
};