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
    - 'Verified bulletin'
    - 'IMD' (weather is Open-Meteo only)
    - 'MSAMB' (no live MSAMB adapter)
    - 'Sentinel' outside legitimate disclaimers / candidate registry
    - 'verified' anywhere in frontend/app UI text
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
    part_vb = "Verified " + "bulletin"
    part_msamb = "MS" + "AMB"
    part_imd = "I" + "MD"
    part_verified = "veri" + "fied"

    banned_exact = [
        part_prod,
        part_halluc,
        part_patho,
        part_num,
        part_vg,
        part_atrop,
        part_vb,
    ]

    msamb_regex = re.compile(rf"\b{part_msamb}\b", re.IGNORECASE)
    imd_regex = re.compile(rf"\b{part_imd}\b", re.IGNORECASE)
    verified_regex = re.compile(rf"\b{part_verified}\b", re.IGNORECASE)

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
                    for line_no, line in enumerate(content.splitlines(), 1):
                        lower_line = line.lower()
                        if banned.lower() in lower_line:
                            is_negative_test = "assert" in lower_line and ("not in" in lower_line or "not" in lower_line)
                            if not is_negative_test:
                                violations.append(f"{fpath.relative_to(repo_root)}:{line_no} contains banned term '{banned}': {line.strip()}")

            # 2. Check 'Sentinel' outside NDVI disclaimer / candidate notes / negative test assertions
            if part_sentinel in content.lower():
                for line_no, line in enumerate(content.splitlines(), 1):
                    lower_line = line.lower()
                    if part_sentinel in lower_line:
                        is_disclaimer = "disclaimer" in lower_line or "warning" in lower_line or "not connected" in lower_line
                        is_negative_test = "assert" in lower_line and ("not in" in lower_line or "not" in lower_line)
                        is_research_candidate = "research" in str(fpath).lower() and "candidate" in lower_line
                        if not (is_disclaimer or is_negative_test or is_research_candidate):
                            violations.append(f"{fpath.relative_to(repo_root)}:{line_no} contains unpermitted '{part_sentinel}': {line.strip()}")

            # 3. Check IMD and MSAMB in code files (.py, .tsx, .ts)
            if fpath.suffix in {".py", ".tsx", ".ts"}:
                for line_no, line in enumerate(content.splitlines(), 1):
                    lower_line = line.lower()
                    is_negative_test = "assert" in lower_line and ("not in" in lower_line or "not" in lower_line)
                    if is_negative_test:
                        continue
                    if msamb_regex.search(line):
                        violations.append(f"{fpath.relative_to(repo_root)}:{line_no} contains banned term '{part_msamb}': {line.strip()}")
                    if imd_regex.search(line):
                        violations.append(f"{fpath.relative_to(repo_root)}:{line_no} contains banned term '{part_imd}': {line.strip()}")

            # 4. Check 'verified' anywhere in frontend/app UI files (.tsx, .ts)
            if "frontend" in str(fpath).replace("\\", "/").split("/") and "app" in str(fpath).replace("\\", "/").split("/"):
                if fpath.suffix in {".tsx", ".ts"}:
                    for line_no, line in enumerate(content.splitlines(), 1):
                        lower_line = line.lower()
                        if verified_regex.search(line):
                            violations.append(f"{fpath.relative_to(repo_root)}:{line_no} contains banned UI word '{part_verified}': {line.strip()}")

    assert not violations, "Banned phrases detected in codebase:\n" + "\n".join(violations)
