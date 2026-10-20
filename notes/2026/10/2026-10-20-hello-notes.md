---
title: 示例笔记：从这里开始
date: 2026-10-20
tags: [使用说明]
status: done
---

# 示例笔记：从这里开始

> 这是一篇示例，用来演示格式并让索引有内容。读完可以删掉这个文件。

## 一句话

这个仓库是一套「随手记 → 自动成索引」的学习笔记本，不预设学科分类，靠**日期 + 标签**组织。

## 要点

- 文件名格式：`YYYY-MM-DD-slug.md`，放在 `notes/YYYY/MM/` 下
- 每篇开头写 front matter（标题、日期、标签、状态）
- 写完跑一次 `python scripts/build_index.py`，根目录的 `INDEX.md` 会自动更新

## 备注

起草中的笔记把 `status` 写成 `draft`，整理完再改成 `done`，索引里会分开展示。

## 延伸

- 笔记模板见 `templates/note.md`
- 读书笔记模板见 `templates/reading.md`
