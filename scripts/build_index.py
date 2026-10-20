#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""扫描 notes/ 下所有笔记的 front matter，生成根目录的 INDEX.md。

零依赖，只用到标准库。用法：
    python scripts/build_index.py

规则：
- 笔记放在 notes/YYYY/MM/YYYY-MM-DD-slug.md
- 每篇开头需要 front matter：title / date / tags / status
- 缺少必需字段、文件名不合规时会打印警告，但仍会生成索引
"""
import os
import re
import sys
from datetime import datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
NOTES_DIR = os.path.join(ROOT, "notes")
OUT_FILE = os.path.join(ROOT, "INDEX.md")

REQUIRED = ("title", "date")
NAME_RE = re.compile(r"^(\d{4})-(\d{2})-(\d{2})-[a-z0-9\-]+\.md$")
STATUS_LABEL = {"draft": "草稿", "done": "完成", "wip": "进行中"}


def parse_front_matter(text):
    """极简 YAML front matter 解析：只支持 key: value 与 key: [a, b] / 短横线列表。"""
    if not text.startswith("---"):
        return {}
    end = text.find("\n---", 3)
    if end == -1:
        return {}

    meta = {}
    current_list_key = None
    for raw in text[3:end].split("\n"):
        line = raw.rstrip()
        if not line.strip():
            continue

        item = re.match(r"^\s*-\s+(.*)$", line)
        if item and current_list_key:
            meta[current_list_key].append(item.group(1).strip().strip("'\""))
            continue

        kv = re.match(r"^([A-Za-z_][\w-]*)\s*:\s*(.*)$", line)
        if not kv:
            continue
        key, value = kv.group(1), kv.group(2).strip()
        current_list_key = None

        if not value:
            meta[key] = []
            current_list_key = key
        elif value.startswith("[") and value.endswith("]"):
            meta[key] = [v.strip().strip("'\"") for v in value[1:-1].split(",") if v.strip()]
        else:
            meta[key] = value.strip("'\"")
    return meta


def collect():
    entries = []
    warnings = []

    for dirpath, dirnames, filenames in os.walk(NOTES_DIR):
        dirnames[:] = [d for d in dirnames if not d.startswith(".")]
        for name in sorted(filenames):
            if not name.endswith(".md"):
                continue
            full = os.path.join(dirpath, name)
            rel = os.path.relpath(full, ROOT).replace("\\", "/")

            if not NAME_RE.match(name):
                warnings.append("%s 文件名不符合 YYYY-MM-DD-slug.md" % rel)

            with open(full, encoding="utf-8") as fh:
                meta = parse_front_matter(fh.read())

            if not meta:
                warnings.append("%s 缺少 front matter" % rel)
                meta = {}

            for field in REQUIRED:
                if not meta.get(field):
                    warnings.append("%s 缺少字段 %s" % (rel, field))

            tags = meta.get("tags") or []
            if isinstance(tags, str):
                tags = [t.strip() for t in tags.split(",") if t.strip()]

            entries.append({
                "rel": rel,
                "title": meta.get("title") or os.path.splitext(name)[0],
                "date": str(meta.get("date") or ""),
                "tags": tags,
                "status": (meta.get("status") or "").lower(),
                "source": meta.get("source") or "",
            })

    entries.sort(key=lambda e: (e["date"] or "0000-00-00", e["title"]), reverse=True)
    return entries, warnings


def build_markdown(entries):
    today = datetime.now().strftime("%Y-%m-%d")
    lines = []
    lines.append("# 笔记索引")
    lines.append("")
    lines.append("> 本文件由 `python scripts/build_index.py` 自动生成，**请勿手改**。新增或修改笔记后重新运行即可。")
    lines.append("")
    lines.append("共 **%d** 篇 · 生成于 %s" % (len(entries), today))
    lines.append("")

    if not entries:
        lines.append("还没有笔记。复制 `templates/note.md` 到 `notes/YYYY/MM/` 下开始写吧。")
        lines.append("")
        return "\n".join(lines)

    lines.append("## 按时间")
    lines.append("")
    lines.append("| 日期 | 标题 | 标签 | 状态 |")
    lines.append("| --- | --- | --- | --- |")
    for e in entries:
        tags = " ".join("`%s`" % t for t in e["tags"]) if e["tags"] else "—"
        status = STATUS_LABEL.get(e["status"], e["status"] or "—")
        lines.append("| %s | [%s](%s) | %s | %s |"
                     % (e["date"] or "—", e["title"], e["rel"], tags, status))
    lines.append("")

    grouped = {}
    for e in entries:
        for tag in (e["tags"] or ["未标签"]):
            grouped.setdefault(tag, []).append(e)

    lines.append("## 按标签")
    lines.append("")
    for tag in sorted(grouped, key=lambda t: (-len(grouped[t]), t)):
        lines.append("### %s (%d)" % (tag, len(grouped[tag])))
        lines.append("")
        for e in grouped[tag]:
            lines.append("- [%s](%s)" % (e["title"], e["rel"]))
        lines.append("")

    return "\n".join(lines)


def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")

    if not os.path.isdir(NOTES_DIR):
        print("找不到 notes/ 目录：%s" % NOTES_DIR)
        return 1

    entries, warnings = collect()
    with open(OUT_FILE, "w", encoding="utf-8", newline="\n") as fh:
        fh.write(build_markdown(entries))

    print("已生成 INDEX.md：%d 篇笔记" % len(entries))
    tags = sorted({t for e in entries for t in e["tags"]})
    print("标签 %d 个：%s" % (len(tags), "、".join(tags) if tags else "无"))
    if warnings:
        print("\n发现 %d 处需要留意：" % len(warnings))
        for w in warnings:
            print("  - " + w)
    return 0


if __name__ == "__main__":
    sys.exit(main())
