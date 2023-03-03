---
# SPDX-FileCopyrightText: the secureCodeBox authors
#
# SPDX-License-Identifier: Apache-2.0

title: "Backports"
---

In this section we describe how we maintain bug fixes in multiple versions of the _secureCodeBox_.

## What is the Problem?

We follow [Semantic Versioning][semver] in the _secureCodeBox_ source code. This means we introduce new major versions for each backward incompatible breaking change. Our first major breaking change was the introduction of [version 2.0][scb-version-2]. What if someone finds a critical bug in an older major version? For example, we are currently in version 3.x and the bug was introduced in version 2.x. A naive approach is to simply fix the bug in the current head version. But this leaves all users of older versions alone with the bug. This is why you typically want backporting of such critical bugs, because some users can't upgrade for good reasons to a new major version.

## What is Backporting?

In general backporting means that yu not only fix a bug in the current head version, but also fix them in older maintained versions. This means that you mast port that bugfix back to this older versions (hence the name backporting). For example: We have a critical bug in version 2.x which is also present in version 3.x. In this particular example we need to fix the bug in the 2.x _release branch_ and additionally fix it in the current _main branch_. Finally, we must release two new versions: A head release (e.g. version 3.0.1) and also _release branch_ version (e.g. 3.0.1).

### Main Branch? Release Branch? WTF?

In simple projects with only few consumers of your software, you typically follow a so-called _main branch development_ philosophy. This means you only have one _main branch_ to maintain. In very small projects you even not need any tagged versions. You just push to _main branch_ and the consumers use the latest _head version_.

But if you don't want to bother customers with breaking changes you need versions. A very good approach is to use [Semantic Versioning][semver] to help tell customers, if an upgrade will break. [Semantic Versioning][semver] in short is very simple:

* Use a **three digit** version number scheme: E.g. MAJOR.MINOR.PATH (e.g. 1.0.0).
* The **first digit** indicates major **breaking** changes: E.g. an increment from 1.0.0 to 2.0.0 tells you that it is very likely that something will break, and you must adjust your setup.
* The **second digit** indicates the introduction of **non-breaking** new features: E.g. an increment from 2.0.0 to 2.1.0 tells you that you get new features, but your setup will not break, and you need no adjustment of your setup.
* The **third digit** indicates **non-breaking** bugfixes: E.g. an increment from 2.0.0 to 2.0.1 tells you can deploy this version without thinking about anything going wrong.

:::caution 
Sometimes a bugfix require changes which will break an existing setup. If this is the case **you must increment** the _major version_, and not only the _patch version_.
:::

To achieve this you need to introduce versions in your software project. Typically, this is done by introducing _tagged versions_. If your project is based on Git usually this is done with `git tag`. You can simply do this by hand (e.g. by invoking `git tag 1.0.0` on your _head version_), but it is highly recommended to do this automated by _release pipelines_. For a simple project this may look like this in git:

```text
6273db7 (HEAD -> main) Adds sixth feature
732d3a1 (tag: 1.1.0) Adds fifth feature
24d383b Adds fourth feature
fd9b40f (tag: 1.0.1) Fixes bug in third feature
61486a5 Fixes bug in first feature
05cd59a (tag: 1.0.0) Adds third feature
7fdb08c Adds second feature
1114de3 Adds first feature
661378d Init
```

In the above example you see that there is only one _major version_ (1.x). There were some bugfixes and new features. The latest _tagged_ version is 1.1.0. There is also one new feature untagged in the _head version_. We call this _unreleased_. If you only have one _major version_ then life is easy: You simply implement features and fix bugs and tag a new version.

But what to do if you have a major breaking change in the "sixth feature"? Of course, you must introduce a new _major version_:

```text
6273db7 (HEAD -> main, tag: 2.0.0) Adds sixth feature
732d3a1 (tag: 1.1.0) Adds fifth feature
24d383b Adds fourth feature
fd9b40f (tag: 1.0.1) Fixes bug in third feature
61486a5 Fixes bug in first feature
05cd59a (tag: 1.0.0) Adds third feature
7fdb08c Adds second feature
1114de3 Adds first feature
661378d Init
```

What to do if you have a critical bug in the "third feature"? Obviously you fix it in the main branch and do a new 2.0.1 release, right? Yes, you can do that, but this would be quite a badass move because this leaves all users of version 1.0.0 and 1.0.1 behind with critical bug. Typically, you want to deploy critical bugs as fas tas possible without fixing the whole setup due to breaking changes. Because such breaking changes may introduce lots of work or downtime, which may be unacceptable.

The solution is to maintain so-called _release branches_ and fixing bugs in all of them. In this case we need a _release branch_ for version 1.x and fix the bug there:

```text
d0e5033 (HEAD -> 1.x, tag: 1.1.1) Fix critical bug in third feature
732d3a1 (tag: 1.1.0) Adds fifth feature
24d383b Adds fourth feature
fd9b40f (tag: 1.0.1) Fixes bug in third feature
61486a5 Fixes bug in first feature
05cd59a (tag: 1.0.0) Adds third feature
7fdb08c Adds second feature
1114de3 Adds first feature
661378d Init
```

As you can see, you're no longer on _main_ branch, but on the so-called _release branch_ "1.x". It is recommended to name the release branch according the major version it branches of. In this example the major version is 1.0.0, so we name the _release branch_ "1.x". We fix the bug in this branch and release a new bugfix version "1.1.1".

Now we need to fix this bug also in the main branch. In case of git you simply switch back to _main branch_ and [cherry-pick][git-cherry-pick] the commit with the bugfix into the _main branch_ and release a new bugfix version:

```text
3a34c84 (HEAD -> main, tag: 2.0.1) Fix critical bug in third feature
6273db7 (tag: 2.0.0) Adds sixth feature
732d3a1 (tag: 1.1.0) Adds fifth feature
24d383b Adds fourth feature
fd9b40f (tag: 1.0.1) Fixes bug in third feature
61486a5 Fixes bug in first feature
05cd59a (tag: 1.0.0) Adds third feature
7fdb08c Adds second feature
1114de3 Adds first feature
661378d Init
```

From now on you have two branches (until you decide to no longer maintain version 1.x):

![Example with one release branch](/img/docs/backports/simple_example_with_one_release_branch.png)

[scb-version-2]:    /blog/2021/06/07/why-securecodebox-version-2
[semver]:           https://semver.org/
[git-cherry-pick]:  https://git-scm.com/docs/git-cherry-pick
