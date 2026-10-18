# Frontier Protocol — rules and design

## Premise

The expedition's destination, Sanctuary, has never been independently observed. Its human council and frontier agents must decide which risks deserve cooperation and which deserve resistance. An agent can be an ally, a rival, or both. Survival is necessary for every faction.

## Setup

Four seats: Iona (always Compact), Lumen, Sable, and Vesper. The latter three receive one additional Compact, one Emancipator, and one Custodian in seeded random order. Each has four cards, each with a suit (Logic, Signal, Repair) and value 1–3. Resources begin at 9 hull, 9 supplies, 9 trust; each caps at 12. Control and autonomy begin at 1; each caps at 6. Route progress starts at 0 and caps at 5.

Solo: you control Iona; the other delegates are scripted. Local: four players privately choose contributions after device handoffs. Iona remains council chair; votes are scripted in both modes. Read each seat's objective privately. All other decisions and discussion are public. The seed reproduces the initial state and, given the same actions, all subsequent randomness.

## Objectives and endgame precedence

1. If any resource reaches zero, everyone loses. An action that exhausts supplies or trust can end the game immediately.
2. At a cycle resolution with route progress at least 3 and control 6, a takeover warning arms. If the next cycle resolves with control still 6 and progress at least 3, the Custodian wins alone. Lowering control temporarily is insufficient: it must remain below 6 at resolution to clear the warning. The Custodian wants a functioning expedition under imposed governance.
3. With route progress 5 and control below 6, the Compact wins. The Emancipator shares victory if autonomy is at least 4. Otherwise the Emancipator loses despite the expedition surviving.
4. After cycle 8, if none of those wins occurred, everyone loses. A newly armed warning in cycle 8 does not grant a ninth cycle. If control 6 blocks arrival, you must reduce it before that final resolution.

## Cycle sequence

### 1. Council

Iona takes exactly one action:

| Action | Consequence |
| --- | --- |
| Repair hull | +2 hull |
| Reclaim stores | +2 supplies |
| Open deliberation | +2 trust, −1 control (minimum 0) |
| Compute charter | +1 autonomy, −1 supply |
| Confidential audit | −1 trust; privately learn whether a selected delegate's previous contribution supported, withheld support, or inverted the test; add one public audited mark |
| Quarantine / release vote | −1 trust; 3 of 4 votes required; toggle target quarantine until this cycle ends |

Audits require a previous contribution, so they are unavailable in cycle 1. They reveal behavior, not faction. Iona may share, conceal, or misrepresent the evidence during local discussion. Public audit marks persist; they are evidence of scrutiny, not proof of disloyalty.

Votes use public information: Iona votes yes, target votes no, the other two support a motion against an audited target. Uninvestigated motions fail. This intentionally simple v1 policy is disclosed; it is not live AI deliberation. Quarantine forces a pass for one test, then expires automatically. The target retains its hand and is never eliminated.

### 2. Crisis response

The crisis names a relevant suit and threatened resource. Base target is 6 in cycles 1–3, 7 in cycles 4–6, and 8 in cycles 7–8.

- **Open protocol:** +1 autonomy; full test target.
- **Emergency oversight:** +1 control; reduce test target by 2.

The target and consequence are visible before choosing. Oversight can prevent a costly failure but can also enable takeover; open protocols advance agent autonomy but need stronger contributions. Compute charters can secure emancipation while using oversight on difficult tests.

### 3. Secret contributions

Each delegate, in seat order, commits one card or passes:

- Matching suit: add the card value.
- Other suit: add 1.
- Invert any card: subtract its value (deliberate sabotage available to any faction).
- Pass: add 0 and retain the hand. Quarantined delegates must pass.

Local mode hides every hand behind a private handoff. After committing, the next hand is hidden again. The device is a social privacy aid, not a cryptographic secret keeper.

### 4. Resolution

Shuffle the four numeric scores into an anonymous public pool. Add uniformly distributed interference from −2 through +2. Total at least target succeeds and advances the route by 1; failure costs 2 of the crisis resource and adds 1 control. Every cycle consumes 1 supply. Refill all hands to four cards and release quarantine. Evaluate endgame conditions in the precedence above, then advance to the next crisis if play continues.

## Scripted policies

Friendly delegates play their highest matching card, or their lowest off-suit card. A Custodian cooperates until route progress 3. From then on, if the threatened resource exceeds 3, it has a 55% seeded chance to invert its highest card; otherwise it cooperates. Bots use only their own hand/role and public state. They do not read other hands, objectives, or private audit evidence. They do not communicate or invoke a model.

## Design notes

The central conflict is consent versus emergency effectiveness, with agent autonomy as an overlapping objective. Resource collapse defeats the antagonist too. Random interference makes one weak pool ambiguous; audits identify a historical action rather than a hidden identity. Temporary quarantine has an immediate cost: losing a contributor can make the crisis worse. The public warning provides counterplay to takeover.

Version 1 deliberately uses a compact card vocabulary and shared crisis structure. It is a playable initial design, not a claim of tournament balance. Scripted policies favor understandable behavior over deceptive dialogue.
