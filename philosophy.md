# Guiding principles

Bullet points are easier to digest than text, so here are guiding principles:

- Extensible is better than monolithic. Many small things on a common base can be created (or learned) gradually, one-by-one; one huge thing is incomprehensible until learned. For understanding, this includes intuitive bases present in a mind.

- Noise before silence. Improvement does not regress, so *anything* is better than nothing. Moreover, the project can easily be cut short at any time, so better to annoy people with the incomplete than risk it never existing.

- Separate cleanly. The first dozen (PL-level) concepts may seem overly unusual, ambitious, and detached from the current way of doing things; but all that is necessary to fully allow not even knowing about any unused concept. (For example, all the complication with access is for this.)

- The same is worthless. Be unique, or do not be.

- One concept, one way of expressing it. Having several ways to define a function is no good; achieve shortness of interface with proper separation.

- Expressivity before speed. Premature optimization is the root of all non-good; it is a collection of concepts, ought to be expressed in a proper framework properly — that framework comes first, and makes building optimization easy. Replace "speed"/"optimization" with any concept.

- Terseness through expressivity. The more expressive the design, the simpler it is to use; the less conceptually artificial special cases, the shorter the using code is.

- Automatic should exactly equal manual. If random self-evolution has even the slightest chance to crash or break the system, then it cannot be used. Bugs and undefined behavior are to be eliminated.

- Formalization should exactly equal intuition. Code, words, or the mind itself — all made to express the same truth; all targets for implementation.

- Combine all in one place. The existing multitude of inventions is only united by a user's mind now. Give them a proper framework to combine in, and the resulting singularity will eat the world it came from.

- Be self-aware. A base implementation is good, a meta-circular one is impressive, but both is immortal. Explain every part of yourself perfectly, and that *is* AI — you in a different medium. Pattern-matching is more natural with self-awareness.

- It can always be better. Improve, do not simply strive towards an ideal (converge to good).

- Do not code a lot. Apparently. This one should probably be dropped.

Conceptual is a strange and experimental PL to develop. It is a half-formed proposal to achieve true AI through creating a conceptual singularity, which is where that strangeness comes from and leads to.

The rest is uninteresting.

# The rest

This document describes the design philosophy behind the Conceptual programming language, and why it exists the way it does.

# Concepts; purity

What is a thought, an idea, a concept? When is one remembered and re-discovered, and when is a new one created? If a mind is made only from thoughts, then they define the world and everything else, dynamically during life; is a mind then fundamentally about dynamic definition, about extensible thoughts put together?

*A thought is something that can be developed further.*

The concepts vaguely mentioned above may be nice to think about, but to attain the very essence of humanity and create an artificial intelligence (why *not* have that as an ultimate  goal?), one has to be much more precise, to the point of making formalization (artificial) and intuition (intelligence) the same; using concepts from programming, and creation of a new programming base (language), is a must. (Implementation is more important than a bunch of words though, even if it is the hardest.)

- **Purity**

Even the most basic concepts are constructed from others, like a circular puzzle.

Consider this: a thing (that has some structure — an object) that depends only on its own structure, pure of (without) any hidden information attached to its identity. This means that equal pure objects can and should be merged into one.

It is often seen in programming, though not in its pure form. Languages with pure functions, pure data structures, common subexpression merging in compilers. Traditionally it is always either all or nothing though; separating purity from everything (making it optional) allows for more power and expressivity.

Concepts are pure definitions. What has been thought of is remembered, including any runtime-collected (non-structural) information. Why remember what has never been thought of, and why not remember what *has*?

- **By definition**

To cut it short, concepts allow the new to re-define the old, data to re-define code. It is at once a new programming paradigm (requiring a language to try it out in), and a model of a mind (a proper base for AI).
