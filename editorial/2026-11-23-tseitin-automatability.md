# BOUNDARY editorial research review — 2026-11-23

**Editorial status:** Draft for human review. **Mathematical status:** No BOUNDARY proof verified; P versus NP remains open. This document does not assert new mathematical results by BOUNDARY.

## Plain-language summary

A new paper published on 22 November 2026 reports that ordinary resolution and regular resolution are *automatable on Tseitin contradictions*: roughly, proof-search time can be bounded polynomially in the input and the size of a shortest unrestricted resolution proof, for this restricted family. This is directly relevant to our earlier resolution/parity exploration. It is **not** an efficient general SAT algorithm, a proof that P=NP, or a resolution of our pairing-slice question. It sharpens the distinction between *finding proofs for a particular structured family* and *lower bounds for broader proof systems*.

## Technical claim from external literature (not a BOUNDARY theorem)

Dmitry Itsykson and Petr Smirnov, **“Resolution Is Automatable on Tseitin Formulas,”** ECCC TR26-332, posted 22 November 2026, state that regular and unrestricted resolution are automatable on Tseitin contradictions and that their minimum refutation lengths are polynomially related on that family. Their abstract describes treewidth-parameterized proof-search algorithms and new resolution lower bounds on arbitrary connected graphs, with an additional line-graph bound for bridgeless graphs.

**Source:** https://eccc.weizmann.ac.il/report/2026/332/

**Verification status:** External research preprint; claim extracted from the authors' abstract, **not independently reproduced or checked by BOUNDARY**. In particular, do not generalize from Tseitin contradictions to arbitrary CNF formulas, from ordinary resolution to unrestricted resolution-over-parities, or from automatability to polynomial-time satisfiability.

## Context and precise limitations

- Efremenko, Garlík and Itsykson, **“Lower Bounds for Regular Resolution over Parities,”** *SIAM Journal on Computing* 54(4), published 1 August 2025, prove an exponential lower bound for **regular** Res(⊕); this does not resolve unrestricted dag-like Res(⊕) lower bounds. https://doi.org/10.1137/24M1696640
- Bhattacharya and Chattopadhyay, **“Exponential Lower Bounds on the Size of ResLin Proofs of Nearly Quadratic Depth,”** ECCC TR25-106 (originally 30 July 2025; revised December 2025), give lower bounds for depth-restricted Res(⊕), not an unrestricted proof-system lower bound. https://eccc.weizmann.ac.il/report/2025/106/
- For BOUNDARY's **pairing-slice hierarchy**, no new theorem, reproducible counterexample, or independently verified overlap-aware coverage bound has been established in this review. The finite-degree separation recorded in the notebook remains a working claim pending reconstruction.
- For the **prime-modulus counting** direction, the unresolved issue remains efficient evaluation of the proposed weighted solution polynomial; changing the coefficient field does not itself provide an algorithm. No new algorithm or verified reduction is claimed here.

## Next falsifiable test

Construct a small, fully specified Tseitin CNF family on connected graphs, including a bridged and a bridgeless example. For each graph: (1) document the parity charge and unsatisfiability; (2) encode the CNF and check satisfiability by brute force for tiny instances; (3) obtain explicit ordinary-resolution refutations with independently checkable clauses; (4) measure proof length and graph/line-graph treewidth; (5) compare only against the **exact theorem statements** after reading the full ECCC paper. Record any counterexample to a proposed BOUNDARY generalization. These tests are **proposed, not executed**.

For the pairing-slice program, first write an unambiguous definition of degree-q slice, score overlap, admissible cancellation, and size parameter. Then enumerate the smallest overlapping instances and seek a counterexample to the proposed coverage bound. Do not extrapolate finite enumerations to asymptotic lower bounds.

## Community and provenance

The repository contains a moderated Supabase suggestion/reply schema, but this review did **not** obtain a verified read of live approved comments or replies. Therefore **no community objections or contributions are attributed** here. No additional user/ChatGPT mathematical research cycle was verified beyond the existing public notebook. The public site has not been changed by this draft.

**Editorial gate:** Confirm the full-paper statement, proof-system definitions, and any test outputs before promoting this note to a public research update.