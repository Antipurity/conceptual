# Conceptual

In progress!

A programming language used as the fully general world/environment for a machine-learned model that is itself.

In short:

- We have artificialness, generality, and intelligence:
  - With code, we can look at it and run it. With machine learning, we can learn it.
- What we don't have are: ablation studies, a PL that's optimized for self-learning, hardware of any worth, a team, or external motivation.

Out long: we introduce and implement TGBA.

- We neurally compile cons-cells with self-determined goals, and learn from executing them repeatedly.
- Having made a programming language with a typed program generator, we throw human-defined types away so that we could learn them: at every smallest part of the program (cons-cell), we have an RL agent to choose both car and cdr pointers. This can create and execute any structure.
- We expose as much of the programming language itself as we can, as the base of those cons-cells. In particular, "set the goal's value to be `V`" is an exposed function.
- We put all cons-cells into one re-generated memory (cons-world), to be connected however they decide to. Learn globally and act locally, meaning, linear-in-cons-cell-count runtime per epoch to connect all to all in a best way (relying on the assumption that structures don't change much).
- So general that it's bland, as we don't explicitly implement any feature-engineering such as equivalency loss or function profiling or de/allocation (evolution). We don't, because with enough cons-cells (and numbers in NNs), they can all be learned. (In particular, evolution (a provider of randomness) is learnable if and only if we learn diverse/arbitrary enough structures, so that all new structures can find themselves in the past: we unroll open-ended evolution, by opening ends to diversity (ha-ha, funny pun). Things like useful transcendence and useful self-determination are also consequences of generality, as is everything else.)
- Currently trying to get its internal reward to go up, and eliminate all causes of learning-gets-stopped (like out-of-memory).

Difficulties of developing both PL and ML. Benefits of none (until done).    
Throwing AND underperforming?    
Ohhh nooo.

Out very long: we have splendid tutorials in-system, figure it out.    
It's not like we're in the business of passing off stillborns as developmentally-challenged healthy babies.

Time resumes.

# Installation

Click. (Once on the main branch, anyway.)
