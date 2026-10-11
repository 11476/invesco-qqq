class Cell {
  static UniqueID = 1;
  constructor(val, activate_dom_link = true) {
      this.value = val;
      this.uid = Cell.UniqueID;
    Cell.UniqueID++;
    if (activate_dom_link) this.activate_cell_dom_link();
  }
  activate_cell_dom_link() {
    this.cell_dom_link = new Cell_DOM_Link(this.uid);
  }
}
class Cell_DOM_Link {
  constructor(UniqueID) {
    this.dom_element = document.createElement("div");
    this.dom_element.classList.add("cell");
      this.dom_element.id = `cell-${UniqueID}`;
      this.dom_element.onclick = this.onclick;
  }
    onclick(...a) {
        alert(JSON.stringify(a));
    }
  add_to(el) {
    el.appendChild(this.dom_element);
  }
}
class BoardInfo {
  constructor(l, w, np) {
    this.l = l;
    this.w = w;
    this.np = np;
  }
}
class Board {
  constructor(BoardInfo, activate_dom_link = true) {
    this.info = BoardInfo;
    this.generate();
      if (activate_dom_link) this.activate_board_dom_link();
  }
    generate() {
      this.cells = Array.from({ length: this.info.l }, () =>
        Array.from({ length: this.info.w }, () => new Cell(Math.floor(Math.random()*10+10))),
      ); // to be changed later
    }
  activate_board_dom_link() {
    this.dom_link = new Board_DOM_Link(this.info.l, this.info.w, this.cells);
  }
  
}
class Board_DOM_Link {
  constructor(l, w, cells) {
    this.length = l;
      this.width = w;
      this.cells = cells;
    this.dom_element = document.getElementById("board");
    
    this.adjust_css();
    this.add_current_cell_array();
  }

  add_current_cell_array() {
    this.cells.forEach((elementP) => {
      elementP.forEach((element) => {
        //   console.log(element, this.dom_element);
        element.cell_dom_link.add_to(this.dom_element);
        element.cell_dom_link.dom_element.innerHTML = `${element.value}`;
      });
    });
  }

  rem_current_cell_array() {
    this.cells.forEach((element) => {
      element.CDM.add_to(null);
    });
  }
  adjust_css() {
    this.dom_element.style.gridTemplateColumns = `repeat(${this.length}, 1fr)`;
    this.dom_element.style.gridTemplateRows = `repeat(${this.width}, 1fr)`;
  }
    update() {
        //todo: Move cells to their positions based on what changed in the board;
        
  }
}
var b = new Board(new BoardInfo(3, 12, null));
