#!/usr/bin/env python3
"""Check appcast.xml enclosures. A missing file passes, since the first release creates it."""
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

PREFIX = "https://github.com/katipally/faber-ADE/releases/download/"
SPARKLE = "{http://www.andymatuschak.org/xml-namespaces/sparkle}"
path = Path(__file__).resolve().parents[2] / "appcast.xml"

if not path.exists():
    print("appcast.xml not present yet, nothing to check")
    sys.exit(0)

errors = []
try:
    root = ET.parse(path).getroot()
except ET.ParseError as e:
    sys.exit(f"error: appcast.xml is not well-formed: {e}")
items = root.findall("./channel/item")
if not items:
    errors.append("no <item> in the channel")
for i, item in enumerate(items, 1):
    enclosure = item.find("enclosure")
    if enclosure is None:
        errors.append(f"item {i}: no enclosure")
        continue
    url = enclosure.get("url", "")
    if not url.startswith(PREFIX):
        errors.append(f"item {i}: enclosure url must start with {PREFIX}")
    if not enclosure.get(SPARKLE + "edSignature"):
        errors.append(f"item {i}: sparkle:edSignature is missing")
    length = enclosure.get("length", "")
    if not length.isdigit() or int(length) <= 0:
        errors.append(f"item {i}: length must be a positive integer")
    if item.find(SPARKLE + "version") is None and enclosure.get(SPARKLE + "version") is None:
        errors.append(f"item {i}: sparkle:version is missing")
for e in errors:
    print(f"error: {e}")
print(f"{len(items)} items checked, {len(errors)} errors")
sys.exit(1 if errors else 0)
