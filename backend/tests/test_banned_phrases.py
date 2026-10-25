import os
import re
from pathlib import Path


def test_no_banned_phrases_in_codebase():
    """Scans backend and frontend source for banned claims and terms:
    - 'production-ready'
    - 'zero hallucination'
    - 'Pathology Lab'
    - '2,500'
    - 'VERIFIED_GENUINE'
    - 'atropine'
    - 'Sentinel' outside legitimate disclaimers / candidate registry
    """
    # Repo root is two levels up from backend/tests
    repo_root = Path(__file__).resolve().parent.parent.parent

    # Construct banned terms dynamically to prevent self-matching in this file
    part_prod = "production-" + "ready"
    part_halluc = "zero " + "hallucination"
    part_patho = "Pathology " + "Lab"
    part_num = "2," + "500"
    part_vg = "VERIFIED_" + "GENUINE"
    part_atrop = "atr" + "opine"
    part_sentinel = "sent" + "inel"

    banned_exact = [
        part_prod,
        part_halluc,
        part_patho,
        part_num,
        part_vg,
        part_atrop,
    ]

    ignored_dirs = {".git", ".venv", "node_modules", ".next", "__pycache__", ".pytest_cache"}
    scanned_extensions = {".py", ".tsx", ".ts", ".md", ".txt", ".json"}
    this_file = Path(__file__).name

    violations = []

    for root, dirs, files in os.walk(repo_root):
        # Prune ignored directories
        dirs[:] = [d for d in dirs if d not in ignored_dirs and not d.startswith(".")]

        for fname in files:
            if fname == this_file or fname in {"package-lock.json", "digest.txt"}:
                continue
            fpath = Path(root) / fname
            if fpath.suffix not in scanned_extensions:
                continue

            try:
                content = fpath.read_text(encoding="utf-8", errors="ignore")
            except Exception:
                continue

            # 1. Check general banned terms
            for banned in banned_exact:
                if banned.lower() in content.lower():
                    # Find line numbers
                    for line_no, line in enumerate(content.splitlines(), 1):
                        if banned.lower() in line.lower():
                            violations.append(f"{fpath.relative_to(repo_root)}:{line_no} contains banned term '{banned}': {line.strip()}")

            # 2. Check 'Sentinel' outside NDVI disclaimer / candidate notes / negative test assertions
            if part_sentinel in content.lower():
                for line_no, line in enumerate(content.splitlines(), 1):
                    lower_line = line.lower()
                    if part_sentinel in lower_line:
                        # Allow legitimate disclaimers, negative test assertions, or research candidate catalog
                        is_disclaimer = "disclaimer" in lower_line or "warning" in lower_line or "not connected" in lower_line
                        is_negative_test = "assert" in lower_line and ("not in" in lower_line or "not" in lower_line)
                        is_research_candidate = "research" in str(fpath).lower() and "candidate" in lower_line
                        if not (is_disclaimer or is_negative_test or is_research_candidate):
                            violations.append(f"{fpath.relative_to(repo_root)}:{line_no} contains unpermitted '{part_sentinel}': {line.strip()}")

    assert not violations, "Banned phrases detected in codebase:\n" + "\n".join(violations)
