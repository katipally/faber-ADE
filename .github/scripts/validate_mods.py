#!/usr/bin/env python3
"""Validate .faber/marketplace.json and every mods/<id>/ folder. Standard library only."""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
LOADED = {".ts", ".tsx", ".js", ".json"}
ID = re.compile(r"[a-z0-9][a-z0-9-]*")
SEMVER = re.compile(r"\d+\.\d+\.\d+([-+][0-9A-Za-z.+-]+)?")
NAME = re.compile(r"[A-Za-z0-9][A-Za-z0-9._-]{0,63}")
errors, warnings = [], []


def load(path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, ValueError) as e:
        errors.append(f"{path.relative_to(ROOT)}: {e}")


def check_mod(folder):
    rel = folder.relative_to(ROOT)
    manifest = load(folder / "mod.json")
    if not isinstance(manifest, dict):
        errors.append(f"{rel}: mod.json must be a JSON object")
        return None
    mod_id = manifest.get("id")
    if not isinstance(mod_id, str) or len(mod_id) > 64 or not ID.fullmatch(mod_id):
        errors.append(f"{rel}: id must be lowercase letters, digits and hyphens, up to 64")
    elif mod_id != folder.name:
        errors.append(f"{rel}: folder name must equal id ({mod_id})")
    if not isinstance(manifest.get("version"), str) or not SEMVER.fullmatch(manifest["version"]):
        errors.append(f"{rel}: version must be semver")
    if not isinstance(manifest.get("description"), str) or not manifest["description"].strip():
        errors.append(f"{rel}: description is required")
    requires = manifest.get("requires", [])
    if not isinstance(requires, list) or not all(isinstance(r, str) for r in requires):
        errors.append(f"{rel}: requires must be a list of strings")
    entry = manifest.get("entry")
    if entry is not None and (not isinstance(entry, str) or entry.startswith("/") or ".." in entry.split("/")):
        errors.append(f"{rel}: entry must be a relative path")
    files = {p.relative_to(folder).as_posix() for p in folder.rglob("*") if p.is_file()}
    if not (entry in files if entry else files & {"register.ts", "register.tsx"}):
        errors.append(f"{rel}: entry file is missing (register.ts or register.tsx)")
    loaded = sum((folder / f).stat().st_size for f in files if Path(f).suffix in LOADED)
    if loaded > 2 * 1024 * 1024:
        errors.append(f"{rel}: loaded files total {loaded} bytes, the limit is 2 MB")
    for f in files:
        name = Path(f).name
        if name.startswith(".env") or Path(f).suffix in {".pem", ".key", ".p12"} or name.startswith("id_rsa"):
            errors.append(f"{rel}/{f}: key file in a mod")
    if "README.md" not in files:
        errors.append(f"{rel}: README.md is required")
    if not manifest.get("license") and not any(f.upper().startswith("LICENSE") for f in files):
        warnings.append(f"{rel}: no license in mod.json or a LICENSE file")
    return manifest


def main():
    mods = {}
    for folder in sorted((ROOT / "mods").glob("*/")):
        manifest = check_mod(folder)
        if manifest:
            mods[folder.name] = manifest
    path = ROOT / ".faber" / "marketplace.json"
    if path.stat().st_size > 1 << 20:
        errors.append("marketplace.json is over 1 MB")
    market = load(path)
    if isinstance(market, dict):
        if not isinstance(market.get("name"), str) or not NAME.fullmatch(market["name"]):
            errors.append("marketplace name must be letters, digits, dots, dashes or underscores")
        entries = market.get("mods", [])
        if not isinstance(entries, list) or len(entries) > 500:
            errors.append("mods must be a list of at most 500 entries")
            entries = []
        seen = set()
        for i, e in enumerate(entries):
            where = f"marketplace mods[{i}]"
            if not isinstance(e, dict):
                errors.append(f"{where}: must be an object")
                continue
            mid, source = e.get("id"), e.get("source")
            if not isinstance(mid, str) or not ID.fullmatch(mid) or len(mid) > 64:
                errors.append(f"{where}: invalid id {mid!r}")
                continue
            if mid in seen:
                errors.append(f"{where}: duplicate id {mid}")
            seen.add(mid)
            if not isinstance(source, str) or not source:
                errors.append(f"{where} ({mid}): source is required")
                continue
            if source.startswith("./"):
                if ".." in source.split("/"):
                    errors.append(f"{where} ({mid}): source must stay inside the repo")
                    continue
                target = ROOT / source[2:]
                if not (target / "mod.json").is_file():
                    errors.append(f"{where} ({mid}): {source} has no mod.json")
                elif mods.get(target.name, {}).get("id") != mid:
                    errors.append(f"{where} ({mid}): {source} holds a mod with a different id")
                elif e.get("version") and e["version"] != mods[target.name].get("version"):
                    errors.append(f"{where} ({mid}): version {e['version']} differs from mod.json {mods[target.name].get('version')}")
            if "description" in e and not isinstance(e["description"], str):
                errors.append(f"{where} ({mid}): description must be a string")
        for mid in mods:
            if mid not in seen:
                warnings.append(f"mods/{mid} is not listed in the marketplace")
    for w in warnings:
        print(f"warning: {w}")
    for e in errors:
        print(f"error: {e}")
    print(f"{len(mods)} mods checked, {len(errors)} errors, {len(warnings)} warnings")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
