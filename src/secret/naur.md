# Thoughts on Programming as Theory Building

Below are a scramble, a mish-mash, a birds-nest of thoughts on Peter Naur's *Programming as Theory Building*.

I've quoted lots of parts I found interesting and useful, and bolded any text that is my actual commentary.

## quotes/commentary

### program understanding/theory

"[...] it is important to have an appropriate understanding of what programming is. If our understanding is inappropriate we will misunderstand the difficulties that arise in the activity and our attempts to overcome them will rise to conflicts and frustrations." 

**This feels like it touches directly on mindstorms and the question of how we actually teach programming. Do we teach programming as "learning to write programs" or "learning to build theories" and do we communicate and rely on the theory building view of programs in our discussions of the nuts-and-bolts of actually programming?**

"the full program text and additional documentation is insufficient in conveying to even the highly motivated group B the deeper insight into the design, that theory which is immediately present to the members of group A."

"after about 10 years [it was] clear that at that later stage the original powerful structure was still visible but made entirely ineffective by amorphous additions of many different kinds."

**[https://en.wikipedia.org/wiki/The_Concept_of_Mind](https://en.wikipedia.org/wiki/The_Concept_of_Mind)**

**This ^ is where Naur is pulling the term "theory" from**

"the basic issue is to show how the knowledge possessed by the programmer by virtue of his or her having the theory necessarily, and in an essential manner, transcends that which is recorded in the documented products."

"The programmer's knowledge transcends that given in documentation in at least three essential areas"

- "1) The programmer having the theory of the program can explain how the solution relates to the affairs of the world that it helps to handle"
- "2) The programmer having the theory of the program can explain why each part of the program is what it is, in other words is able to support the actual program text with a justification of some sort."
- "3) The programmer having the theory of the program is able to respond constructively to any demand for a modification of the program so as to support the affairs of the world in a new manner."

### program modification

"The expectation that program modification at low cost ought to be possible is one that calls for closer analysis. First it should be noted that such an expectation cannot by supported by analogy with modifications of other complicated manmade constructions."

"The expectation of the possibility of low cost program modifications conceivably finds support in the fact that a program is a text held in medium allowing for easy editing. For this support to be valid it must clearly be assumed that the dominating cost is one of text manipulation. This would agree with a notion of programming as text production. On the Theory Building View this whole argument is false." 

"flexibility can in general only be achieved at a substantial cost"

"The point is that the kind of similarity [between program and new demands] that has to be recognized is accessible to the human beings who possess the theory of the program, although entirely outside the reach of what can be determined by rules, since even the criteria on which to judge it cannot be formulated."

"In a certain sense there can be no question of a theory modification, only of a program modification."

"For a program to retain its quality it is mandatory that each modification is firmly grounded in the theory of it."

**A thought I am having - is there a maximum size to a theory? It feels like it must be so, and consequently a maximum size to a program.**

"Indeed, the very notion of qualities such as simplicity and good structure can only be understood in terms of the theory of the program, since they characterize the actual program text in relation to such program texts that might have been written to achieve the same execution behavior, but which exist only as possibilities in the programmer's understanding."

## theory: bound to human beings

"A main claim of the Theory Building View of programming is that an essential part of any program, the theory of it, is something that could not conceivably be expressed, but is inextricably bound to human beings."

"What is required [to build a theory] is that the new programmer has the opportunity to work in close contact with the programmers who already possess the theory, so as to be able to become familiar with the place of the program in the wider context of the relevant real world situations and so as to acquire the knowledge of how the program works and how unusual program reactions and program modifications are handled within the program theory."

"This problem of education of new programmers in an existing theory of a program is quite similar to that of the educational problem of other activities *where the knowledge of how to do certain things dominates over the knowledge that certain things are the case, such as writing and playing a music instrument.*" (emphasis mine)

"reestablishing the theory of a program merely from the documentation is strictly impossible" **!!**

"it is hardly conceivable that the revival would be assigned to new programmers without at least some knowledge of the theory had by the original team" **ha! if only**

"[a rewrite] is more likely to produce a viable program than program revival, and at no higher, and possibly lower, cost." does this fit with anyone's lived experience? I know for my own hobby projects it's true, but not at work. But maybe that's for organizational problems.

## against programming methods

"In building the theory there can be no particular sequence of actions, for the reason that a theory held by a person has no inherent division into parts and no inherent ordering." and ergo, according to Naur, "there can be no right method" for building software, since methods are purely about ordered sequences of actions, building up parts.

**Oh heck yeah, he targets the scientific method directly next. Oh and then he uses the lack of scientific studies supporting programming methods as evidence that they don't work. damned if you do, damned if you don't.**

"the notion of methods as systems of rules that in an arbitrary context and mechanically will lead to good solutions is an illusion."

## anti-industrial view of programming

"Another related view is that human being perform best if they act like machines, by following rules, with consequent stress on formal modes of expression"

"Since this theory by its very nature is part of the mental possession of each programmer, it follows that the notion of the programmer as an easily replaceable component in the program production activity has to be abandoned."

**This feels very anti-industrial, from a philosophical perspective. There's a lot to pick apart here, and the way Naur takes it ("the raising of the status of programmers") is actually a surprisingly non-radical approach, considering the earlier points in the article.**
