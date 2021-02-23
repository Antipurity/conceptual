# Conceptual

In progress!

A programming language used as the fully general world/environment for a machine-learned model that is itself.

In short:

- We have artificialness, generality, and intelligence:
  - With code, we can look at it and run it. With machine learning, we can learn it.
- What we don't have are: a working prototype, a GPU of any worth, a team, or external motivation.

Out long: we introduce and implement TGBA.

- Having made a programming language with a typed program generator, we attempt to learn all aspects of that, mainly, learned functions made by learned-numeric-embedding types. (We learn goal-maximizing choices interconnected in directed acyclic graphs that are function bodies.)
- We expose as much of the programming language itself as we can, to those auto-functions.
- We put all auto-functions into one re-generated memory (auto-world), to be connected however they decide to. Learn globally and act locally.
- We allow auto-functions to be allocated automatically, with either basic (human-defined) goals or auto-function goals.
- We give each auto-function its own things to learn, for scalability: minimizing contrastive inequivalency loss, and predicting profiling information such as call duration, and optionally its own goal. This self-awareness improves sample efficiency.
- Memory and compute are finite, so we learn what to allow to learn via measuring popularity, and Q-learning what all goals and metrics will become post-gradient-descent (culling least-prediction auto-functions when there are too many). This results in open-ended evolution, with self-similarity serving as the noisy-reproduction mechanism of good auto-functions.
- This should make programs that can do anything well (interpreters/compilers) to be the most popular ones, so in theory, if we train an auto-world for long enough, we can stop training but still have the auto-world keep learning as if nothing happened, which is good for performance. Transcendence is hard, tho. Haven't made it.

Difficulties of developing both PL and ML. Benefits of none (until done).    
Throwing AND underperforming?    
Ohhh nooo.

Out very long: we have splendid tutorials in-system, figure it out.    
It's not like we're in the business of passing off stillborns as developmentally-challenged healthy babies.

Time resumes.

# Installation

Click. (Once on the main branch, anyway.)
