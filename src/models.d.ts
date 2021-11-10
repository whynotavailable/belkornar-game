interface DataFile {
  areas: Area[];
  processes: Process[];
}

interface Area {
  id: string;
  name: string;
  people?: string[];
  activities?: string[];
}

interface Process {
  id: string;
  name: string;
  exp?: ExpDrop[];
  input?: Quantity[];
  output?: Quantity[];
  group?: string;
  groups?: string[];
}

interface ExpDrop {
  id: string;
  exp: number;
}

interface Quantity {
  id: string;
  amount?: number;
}

interface Requirement {
  id: string;
}

/*
id: mine_copper
name: mine copper
exp:
  - id: skill__mining
    exp: 15
output:
  - id: item__copper
requirements:
  - id: skill__mining
group: mining

---

id: create_copper_bar
name: create copper bar
input:
  - id: item__copper
output:
  - id: item__copper_bar
exp:
  - id: skill__smithing
    exp: 15
requirements:
  - id: skill__smithing
group: smithing

---

id: smithing
name: smithing
groups:
  - process__create_copper_bar

 */
