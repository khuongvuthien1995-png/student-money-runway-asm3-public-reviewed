"""Validate C7 artifact existence, local links and explicit incomplete gates."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FOLDER = ROOT / "docs/assessment/c7"
NAMES = ["ASM3_DEMO_STORYBOARD", "ASM3_DEMO_SCRIPT_EN", "ASM3_DEMO_REHEARSAL_VI",
         "ASM3_DEMO_SHOT_LIST", "ASM3_PROMPT_DOCUMENT", "PEER_REVIEW_01",
         "PEER_REVIEW_02", "PEER_REVIEW_03", "ASM3_SUBMISSION_MANIFEST",
         "ASM3_FINAL_MARKING_AUDIT", "ASM3_C7_FINAL_REPORT",
         "ASM3_COURSE_KNOWLEDGE_TRACEABILITY", "ASM3_PEER_ACCESS_GUIDE",
         "ASM3_GITHUB_PUBLICATION_AND_CLONE_AUDIT", "ASM3_FINAL_TECHNICAL_RELEASE_AUDIT",
         "ASM3_HISTORY_REDACTION_PROPOSAL"]
missing = []
checked_links = 0
for name in NAMES:
    path = FOLDER / (name + ".md")
    assert path.is_file() and path.stat().st_size, name
    fence = False
    for line in path.read_text(encoding="utf-8").splitlines():
        if line.startswith("```"):
            fence = not fence
            continue
        if fence:
            continue
        for target in re.findall(r"\]\(([^)]+)\)", line):
            if target.startswith(("http:", "https:", "#")):
                continue
            checked_links += 1
            target = target.split("#")[0]
            if not (path.parent / target).resolve().exists():
                missing.append({"file": path.name, "target": target})
assert not missing, missing
script = (FOLDER / "ASM3_DEMO_SCRIPT_EN.md").read_text(encoding="utf-8")
segments = re.findall(r"^## (\d{2}):(\d{2})[–-](\d{2}):(\d{2})", script, re.MULTILINE)
assert len(segments) == 13, "All timed narration sections must be readable"
cursor = 0
for start_m, start_s, end_m, end_s in segments:
    start, end = int(start_m) * 60 + int(start_s), int(end_m) * 60 + int(end_s)
    assert start == cursor and end > start, "Timeline must be contiguous"
    cursor = end
assert cursor == 300
rehearsal = (FOLDER / "ASM3_DEMO_REHEARSAL_VI.md").read_text(encoding="utf-8")
assert "Hướng dẫn" in rehearsal and "tài khoản" in rehearsal
assert "H??ng" not in rehearsal, "Vietnamese text must preserve UTF-8 accents"
for number in range(1, 4):
    text = (FOLDER / f"PEER_REVIEW_{number:02}.md").read_text(encoding="utf-8")
    assert all(f"| S{i} | PENDING" in text for i in range(1, 6))
    assert all(f"| R{i} | PENDING" in text for i in range(1, 4))
    assert "0 / 5" in text and "0 / 3" in text
index = json.loads((FOLDER / "evidence/prompt-source-index.json").read_text())
assert len(index) >= 13
brief = json.loads((FOLDER / "evidence/official-brief-review.json").read_text())
assert brief["pagesRead"] == [1, 2, 3, 4, 5, 6]
clip = FOLDER / "evidence/raw-live-preview-anonymous.webm"
assert clip.is_file() and clip.stat().st_size > 0
metadata = json.loads((FOLDER / "evidence/raw-video-metadata.json").read_text())
assert metadata["completeFiveMinuteDemo"] is False and metadata["personalNarration"] is False
result = {"requiredMarkdownFiles": len(NAMES), "localLinksChecked": checked_links,
          "brokenLocalLinks": missing, "peerReports": "PENDING, 0/5 screenshots and 0/3 recommendations each",
          "promptAppendices": len(index), "rawClipDurationSeconds": metadata["durationSeconds"],
          "completeIndividualDemo": False, "officialRubric": "VERIFIED LOCAL COPY; COMPLETION PARTIAL",
          "plannedTimelineSeconds": cursor, "vietnameseUtf8": True}
(FOLDER / "evidence/artifact-validation.json").write_text(json.dumps(result, indent=2), encoding="utf-8")
print(json.dumps(result, indent=2))
