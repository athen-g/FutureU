import json
from pathlib import Path

DATA_DIR = Path("f:/FutureU/src/data")

CODE_MIGRATION_MAP = {
    '30331': '03033', '30332': '03033', '30333': '03033', '30335': '03033', '30336': '03033',
    '30352': '03035', '30353': '03035', '30359': '03035',
    '43042': '04304', '43043': '04304', '43046': '04304',
    '61752': '06175',
    '62762': '06276', '62763': '06276', '62764': '06276', '62766': '06276',
    '62852': '06285', '62853': '06285',
    '69382': '06938', '69383': '06938', '69388': '06938',
    '06006': '16006'
}

def migrate_code(code):
    return CODE_MIGRATION_MAP.get(code, code)

def migrate_branch_code(bcode):
    if not bcode:
        return bcode
    clean = bcode
    # Strip letters to get numeric part
    digits = "".join([c for c in bcode if c.isdigit()])
    if len(digits) == 9:
        clean = "0" + bcode
    # Apply COEP/etc mappings
    # (Note: DBATU, PCCOE etc. match directly after prepending 0, so they don't need manual branch mapping here)
    coep_map = {
        '0600619110': '1600619110', '0600624510': '1600624210',
        '0600626610': '1600626610', '0600629310': '1600629310',
        '0600637210': '1600637210', '0600646410': '1600646410',
        '0600661210': '1600661210', '0600662710': '1600662710',
        '0600669410': '1600669410',
        # DBATU
        '0303319113K': '0303319110', '0303324513K': '0303324510',
        '0303324613K': '0303324610', '0303329313K': '0303329310',
        '0303337213K': '0303337210', '0303337290L': '0303337210',
        '0303350713K': '0303350710', '0303352713K': '0303352710',
        '0303361213K': '0303361210',
        # PCCOE
        '0617524590L': '0617524510',
    }
    return coep_map.get(clean, clean)

def load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def build_index():
    index = {}
    
    # 2024 seat matrix
    sm24 = load_json(DATA_DIR / "2024-25/seat_matrix.json")
    for college in sm24.get("colleges", []):
        cc = migrate_code(college["college_code"])
        if cc not in index:
            index[cc] = {
                "college_code": cc, "college_name": college["college_name"],
                "branches": {}
            }
        for bk, branch in college.get("branches", {}).items():
            mbk = migrate_branch_code(bk)
            index[cc]["branches"][mbk] = {
                "branch_code": mbk, "branch_name": branch["branch_name"], "college_code": cc,
                "total_seats": branch.get("total_seats", 0),
                "cutoffs": {}
            }
            
    # 2023 seat matrix
    sm23 = load_json(DATA_DIR / "2023-24/seat_matrix.json")
    for college in sm23.get("colleges", []):
        cc = migrate_code(college["college_code"])
        if cc not in index:
            index[cc] = {
                "college_code": cc, "college_name": college["college_name"],
                "branches": {}
            }
        for bk, branch in college.get("branches", {}).items():
            mbk = migrate_branch_code(bk)
            if mbk not in index[cc]["branches"]:
                index[cc]["branches"][mbk] = {
                    "branch_code": mbk, "branch_name": branch["branch_name"], "college_code": cc,
                    "total_seats": branch.get("total_seats", 0),
                    "cutoffs": {}
                }
            
    # 2022 seat matrix
    sm22 = load_json(DATA_DIR / "2022-23/seat_matrix.json")
    for college in sm22.get("colleges", []):
        cc = migrate_code(college["college_code"])
        if cc not in index:
            index[cc] = {
                "college_code": cc, "college_name": college["college_name"],
                "branches": {}
            }
        for bk, branch in college.get("branches", {}).items():
            mbk = migrate_branch_code(bk)
            if mbk not in index[cc]["branches"]:
                index[cc]["branches"][mbk] = {
                    "branch_code": mbk, "branch_name": branch["branch_name"], "college_code": cc,
                    "total_seats": branch.get("total_seats", 0),
                    "cutoffs": {}
                }

    def merge(cutoff_data, year, cap, type_key):
        for college in cutoff_data.get("colleges", []):
            cc = migrate_code(college["college_code"])
            if cc not in index:
                index[cc] = {
                    "college_code": cc, "college_name": college["college_name"],
                    "branches": {}
                }
            for bk, branch in college.get("branches", {}).items():
                mbk = migrate_branch_code(bk)
                if mbk not in index[cc]["branches"]:
                    index[cc]["branches"][mbk] = {
                        "branch_code": mbk, "branch_name": branch["branch_name"], "college_code": cc,
                        "total_seats": 0,
                        "cutoffs": {}
                    }
                b = index[cc]["branches"][mbk]
                if year not in b["cutoffs"]:
                    b["cutoffs"][year] = {
                        "cap1": {"mh": {}, "ai": {}},
                        "cap2": {"mh": {}, "ai": {}, "diploma": {}},
                        "cap3": {"mh": {}, "ai": {}, "diploma": {}}
                    }
                b["cutoffs"][year][cap][type_key] = branch.get("cutoffs", {})

    # Load all 18 cutoff files
    # 2022-23
    merge(load_json(DATA_DIR / "2022-23/cap1/mh_cutoff.json"), "2022-23", "cap1", "mh")
    merge(load_json(DATA_DIR / "2022-23/cap1/ai_cutoff.json"), "2022-23", "cap1", "ai")
    merge(load_json(DATA_DIR / "2022-23/cap2/mh_cutoff.json"), "2022-23", "cap2", "mh")
    merge(load_json(DATA_DIR / "2022-23/cap2/ai_cutoff.json"), "2022-23", "cap2", "ai")
    merge(load_json(DATA_DIR / "2022-23/cap3/mh_cutoff.json"), "2022-23", "cap3", "mh")
    merge(load_json(DATA_DIR / "2022-23/cap3/ai_cutoff.json"), "2022-23", "cap3", "ai")

    # 2023-24
    merge(load_json(DATA_DIR / "2023-24/cap1/mh_cutoff.json"), "2023-24", "cap1", "mh")
    merge(load_json(DATA_DIR / "2023-24/cap1/ai_cutoff.json"), "2023-24", "cap1", "ai")
    merge(load_json(DATA_DIR / "2023-24/cap2/mh_cutoff.json"), "2023-24", "cap2", "mh")
    merge(load_json(DATA_DIR / "2023-24/cap2/ai_cutoff.json"), "2023-24", "cap2", "ai")
    merge(load_json(DATA_DIR / "2023-24/cap3/mh_cutoff.json"), "2023-24", "cap3", "mh")
    merge(load_json(DATA_DIR / "2023-24/cap3/ai_cutoff.json"), "2023-24", "cap3", "ai")

    # 2024-25
    merge(load_json(DATA_DIR / "2024-25/cap1/mh_cutoff.json"), "2024-25", "cap1", "mh")
    merge(load_json(DATA_DIR / "2024-25/cap1/ai_cutoff.json"), "2024-25", "cap1", "ai")
    merge(load_json(DATA_DIR / "2024-25/cap2/mh_cutoff.json"), "2024-25", "cap2", "mh")
    merge(load_json(DATA_DIR / "2024-25/cap2/ai_cutoff.json"), "2024-25", "cap2", "ai")
    merge(load_json(DATA_DIR / "2024-25/cap3/mh_cutoff.json"), "2024-25", "cap3", "mh")
    merge(load_json(DATA_DIR / "2024-25/cap3/diploma_cutoff.json"), "2024-25", "cap3", "diploma")

    return index

idx = build_index()

print(f"Total Colleges Loaded: {len(idx)}")

no_branches = []
no_seats = []
no_cutoffs = []

for cc, college in idx.items():
    branches = college.get("branches", {})
    if not branches:
        no_branches.append(college)
        continue
    
    total_seats = sum(b.get("total_seats", 0) for b in branches.values())
    if total_seats == 0:
        no_seats.append(college)
        
    has_cutoffs = False
    for b in branches.values():
        if b.get("cutoffs"):
            has_cutoffs = True
            break
    if not has_cutoffs:
        no_cutoffs.append(college)

print(f"\n1. Colleges with NO branches: {len(no_branches)}")
for c in no_branches[:10]:
    print(f"  - {c['college_code']}: {c['college_name']}")
if len(no_branches) > 10:
    print(f"  - ... and {len(no_branches) - 10} more")

print(f"\n2. Colleges with 0 total seats: {len(no_seats)}")
for c in no_seats[:10]:
    print(f"  - {c['college_code']}: {c['college_name']}")
if len(no_seats) > 10:
    print(f"  - ... and {len(no_seats) - 10} more")

print(f"\n3. Colleges with NO cutoffs at all (across all years): {len(no_cutoffs)}")
for c in no_cutoffs[:10]:
    print(f"  - {c['college_code']}: {c['college_name']}")
if len(no_cutoffs) > 10:
    print(f"  - ... and {len(no_cutoffs) - 10} more")
