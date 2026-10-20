# A Beginner's Guide to GitHub

> 2026-10-20 · Source: [Github 零基础终极教程！](https://www.bilibili.com/video/BV14Y3p6uE6b/) (Bilibili, in Chinese)

A condensed outline of a 37-minute beginner course. The video has no captions, so the sections below are my own notes on each chapter rather than a transcript.

## The short version

**Git** tracks changes on your own machine. **GitHub** stores those repositories online and layers collaboration on top. Day to day, you only need one loop: `clone → edit → add → commit → push`.

## About the video

| | |
| --- | --- |
| Title | Github 零基础终极教程！ |
| Creator | 木子不写代码 |
| Length | 37 min 31 s, single part, 4K |
| Published | 2026-08-03 |
| Watch | <https://www.bilibili.com/video/BV14Y3p6uE6b/> |

## What it covers

1. What GitHub is
2. Four ways to find good repositories
3. The interface, plus stars, forks and watches
4. How GitHub actually works
5. Seven common open-source licences, compared
6. Four ways to download and use a project
7. Creating and open-sourcing your first repository

## 1. What GitHub is

Git is a distributed version control system written by Linus Torvalds in 2005 to manage the Linux kernel. It runs on your machine and records who changed what, and when.

GitHub, launched in 2008 and owned by Microsoft since 2018, is a hosting platform for Git repositories. It gives them a home in the cloud and adds collaboration features on top.

The relationship is often stated backwards, so keep this in mind: **Git works fine without GitHub; GitHub is meaningless without Git.**

A repository is not just "a folder of code" — it carries the full history, and you can put anything text-based in it: notes, configs, documentation, even a whole website.

## 2. Four ways to find good projects

| Approach | Where | Best for |
| --- | --- | --- |
| Search qualifiers | The search bar | Precise lookups: `topic:llm stars:>1000 language:python` |
| Trending | `github.com/trending` | Seeing what is gaining traction, filterable by language and period |
| Topics | `github.com/topics` | Browsing a field when you do not have the right keyword yet |
| Awesome lists | Search `awesome <topic>` | Curated lists that someone already spent hours assembling |

Two habits worth forming: **follow people and organisations whose taste you trust**, since their starred lists become recommendations; and **star** anything promising instead of assuming you will remember it.

## 3. The interface and the vocabulary

| Term | What it means | Where people get confused |
| --- | --- | --- |
| Repository | A project, with its full history | It is not just a folder |
| Star | Bookmark plus a vote of confidence | It does **not** copy the code to your account |
| Fork | A copy of someone's repository under your account | Your changes do not flow back on their own |
| Watch | Subscribe to notifications | Available at several levels, including issues-only |
| Issue | A place to report bugs and discuss ideas | Not limited to bugs — used for proposals too |
| Pull request | A request to merge your changes into a repository | The core of open-source contribution |
| Release | A published version | Ships a tag, binaries and notes |
| Actions | Automation triggered by events | Tests, builds and deploys on every push |

Reading a repository you have never seen: start with the README, then check the Releases page and how alive the Issues are.

## 4. How GitHub works

Changes move through four areas:

```text
working tree  →  staging area  →  local repository  →  remote repository
              add            commit                push
```

- `clone` / `pull` — bring work down from the remote
- `add` — choose which changes go into the next commit
- `commit` — freeze the staged changes into a snapshot with a message
- `push` — send the snapshot to the remote

The standard contribution flow on someone else's project:

```text
fork → clone → create a branch → edit → commit → push to your fork → open a pull request → review → merge
```

"Distributed" means every clone holds the complete history. You can commit offline; there is no single point of failure.

## 5. Seven common open-source licences

| Licence | Family | Must derivatives stay open? | Note |
| --- | --- | --- | --- |
| MIT | Permissive | No | Shortest and most common; keep the notice |
| Apache-2.0 | Permissive | No | Adds an explicit patent grant; enterprise-friendly |
| BSD-2 / 3-Clause | Permissive | No | The 3-Clause version forbids using the author's name as endorsement |
| MPL-2.0 | Weak copyleft | Changed **files** must stay open | File-level, coexists with other licences |
| LGPL | Weak copyleft | Dynamic linking may stay closed | Common for libraries |
| GPL-2.0 / 3.0 | Strong copyleft | Yes | Derivatives must be GPL as well |
| Unlicense / CC0 | Public domain | No | All rights waived |

Rule of thumb: **MIT for anything personal**; Apache-2.0 when you want others to adopt it without patent worries; GPL when you want improvements to flow back. In reverse, be careful about pulling GPL code into your own project — it may force you to open-source.

## 6. Four ways to get a project

| Method | How | Good for | Trade-off |
| --- | --- | --- | --- |
| Download ZIP | Code → Download ZIP | A quick look at the source | No history, cannot `pull` updates |
| `git clone` | Command line | Development and staying current | Requires Git installed |
| Release assets | Downloads on the Releases page | Using the software as a user | Only what the maintainer packaged |
| GUI client | GitHub Desktop, or the web uploader | Avoiding the command line | Fewer features |

The question that decides it: **will you want to follow updates?** If yes, clone. If no, ZIP is fine.

## 7. Your first repository

On the web, click **New repository** and mind four fields:

- **Name** — lowercase letters, digits and hyphens; GitHub rejects non-ASCII characters
- **Visibility** — public if others should see it, private otherwise
- **Add a README** — tick it, or the repository looks empty
- **.gitignore and licence** — pick templates instead of writing them yourself

To push an existing local project:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<user>/<repo>.git
git push -u origin main
```

An open-source repository needs three things before it is useful to anyone else: a **README** that explains what it is and how to use it, a **LICENCE**, and a **.gitignore** so secrets and junk never get committed.

## Glossary

- **commit** — a snapshot with a message
- **branch** — an independent line of work
- **merge** — bringing a branch back in
- **conflict** — two changes to the same lines; resolved by hand
- **origin / upstream** — your default remote / the original project you forked from
- **HEAD** — where you currently are
- **tag** — a name pinned to a commit, usually a version number

## Further reading

- GitHub Docs: <https://docs.github.com/en/get-started>
- Pro Git (free book): <https://git-scm.com/book/en/v2>
- Licence picker: <https://choosealicense.com/>
