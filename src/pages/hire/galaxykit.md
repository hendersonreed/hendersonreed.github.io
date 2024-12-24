# galaxykit

[galaxykit](https://github.com/ansible/galaxykit) is a testing utility written during my time at Red Hat for creating, reading, and deleting test data inside Red Hat's [Ansible Automation Hub](https://docs.ansible.com/ansible/latest/reference_appendices/automationhub.html).

![](/assets/portfolio-images/galaxykit.png)

It exposes both a Python API and a command-line interface that's suitable for interactive use. The CLI interface was also used to produce bindings in other languages, namely in Automation Hub's front-end tests that were written in Javascript using [Cypress.](https://www.cypress.io/)

## background:

In my role at Red Hat, I was, for the first year, **exactly half** of the Quality Engineering team for Automation Hub (AH), which is a Django-based web application for publishing and versioning Ansible collections.

It was in that first 6 months at Red Hat that, as I was learning my way around the myriad repositories that comprise the Ansible Org's codebase, I recognized a *ton* of code duplication that specifically pertained to managing test data inside AH. There were curl calls in numerous Jenkins pipelines, there was a suite of integration tests with Python `requests` calls smattered throughout, there were front-end tests in Cypress that were going to need even more test data utilities.

Right after the fall release of the Ansible Automation Platform, I started thinking about this problem, and the fact that, as far as I could tell, everyone needed the same thing, which was just a small and ergonomic utility for instantiating and reading test data. *I like writing small and ergonomic utilities*, I thought.

## building:

As someone working day-to-day in a Python organization, on a Python web-app, with Python tests, I chose the first language that came to mind: Rust.

Just kidding! I picked Python.

<div class="sidenote">

### why didn't you use an automatically generated OpenAPI client?

This was a decision I struggled with actually. There are a few reasons:

1. AH didn't have an entirely accurate OpenAPI spec. Generating it from the code itself resulted in something that was maybe 75% correct on average, and that just wasn't good enough to build a good suite of tests.
2. Testing a product with a client that's automatically generated from the code of that product could mask errors or inconvenient/unergonomic aspects of the product.

To expand on point 2, I think that it's very easy to allow automated tooling to paper over interfaces that turn out to be important. To my mind, *any* kind of developer tooling should have an easy-to-use API. Relying on an automatically generated API client means that you could build a *horrible* API and because the client exists, you won't know how it feels to use it unaided. And should you ever need finer-grained control, you're going to be digging into gross generated client code to update/amend it. And every time the API changes you need to regenerate the client, so it's hard to keep your changes around, etc etc.

</div>

Ultimately, the MVP of galaxykit was very simple - you can browse the first 25 commits at my [personal repo](https://github.com/hendersonreed/galaxykit), before I got it migrated to the Ansible GitHub org. It started out as just wrapping Docker client invocations, because that was the personal pain of my own that initially had me looking at building a client that wrapped up a lot of AH-specific functionality.

After I added functionality for managing groups and users, I pushed out v0.0.1 and started integrating it into tests elsewhere.

### Some lessons I took from implementation:

1. use a real CLI parser from the outset. I didn't and later regretted it!
2. Trust your mental map of the code, and build your file structure around that. Make sure you can communicate your mental map if you do this.
3. [Work hard to communicate the technical structure of what you're building.](https://github.com/ansible/galaxykit/blob/main/CONTRIBUTE.md)

## generating momentum:

*The key to generating adoption is finding collaborators.*

In my case, it turned out that the sole other engineer on the AH QE team, and also one of the lead developers on the front-end became major contributors to galaxykit, and helped it gain adoption across front-end dev, back-end dev and other teams in the QE division.

The other aspect of that helped galaxykit build momentum was the straightforward CLI interface. It became easy to share with folks who needed to interact with an AH instance only occasionally in their work. Remembering how to go through the GUI to add a user was more work than remembering `galaxykit user create`.

## the legacy

At the time of publishing (April 2024), almost 3 years after that v0.0.1 release of galaxykit (May 11, 2021), it's still seeing regular development, and remains a core part of numerous test suites. I feel really lucky to have had the opportunity to build something that's saved so many precious human hours.
