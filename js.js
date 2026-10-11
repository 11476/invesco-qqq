class Cell {
  static UniqueID = 1;
  constructor(val, activate_dom_link = true) {
      this.value = val;
      this.uid = Cell.UniqueID;
    Cell.UniqueID++;
    if (activate_dom_link) this.activate_cell_dom_link();
  }
  activate_cell_dom_link(board = null) {
    this.cell_dom_link = new Cell_DOM_Link(this, board);
  }
}
class Cell_DOM_Link {
  constructor(cell, board = null) {
    this.cell = cell;
    this.board = board;
    this.dom_element = document.createElement("div");
    this.dom_element.classList.add("cell");
    this.dom_element.id = `cell-${cell.uid}`;
    this.dom_element.addEventListener("click", () => this.onclick());
  }

  onclick() {
    if (!this.board) return;

    const selected = this.board.selectedCellDomLink;
    if (!selected) {
      this.select();
      return;
    }
    if (selected === this) {
      this.clear_selection();
      return;
    }

    const [selectedRow, selectedColumn] = selected.position();
    const [row, column] = this.position();
    if (Math.abs(selectedRow - row) + Math.abs(selectedColumn - column) === 1) {
      [selected.cell.value, this.cell.value] = [this.cell.value, selected.cell.value];
      selected.update_value();
      this.update_value();
      this.clear_selection();
      this.board.merge_matches();
      return;
    }

    this.clear_selection();
    this.select();
  }

  position() {
    const row = this.board.cells.findIndex((cells) => cells.includes(this.cell));
    return [row, this.board.cells[row].indexOf(this.cell)];
  }

  select() {
    this.board.selectedCellDomLink = this;
    this.dom_element.classList.add("selected");
    const [row, column] = this.position();
    this.board.cells.forEach((cells, rowIndex) => {
      cells.forEach((cell, columnIndex) => {
        if (Math.abs(row - rowIndex) + Math.abs(column - columnIndex) === 1) {
          cell.cell_dom_link.dom_element.classList.add("swappable");
        }
      });
    });
  }

  clear_selection() {
    this.board.selectedCellDomLink = null;
    this.board.cells.flat().forEach((cell) => {
      cell.cell_dom_link.dom_element.classList.remove("selected", "swappable");
    });
  }

  update_value() {
    this.dom_element.innerHTML = `${this.cell.value}`;
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
    this.cells.flat().forEach((cell) => cell.activate_cell_dom_link(this));
    this.dom_link = new Board_DOM_Link(this.info.l, this.info.w, this.cells);
  }

  find_matches() {
    const matches = new Set();
    const mark_runs = (line) => {
      let start = 0;
      while (start < line.length) {
        let end = start + 1;
        while (end < line.length && line[end].value === line[start].value) {
          end++;
        }
        if (end - start >= 3) {
          for (let index = start; index < end; index++) {
            matches.add(line[index]);
          }
        }
        start = end;
      }
    };

    this.cells.forEach(mark_runs);
    for (let column = 0; column < this.info.w; column++) {
      mark_runs(this.cells.map((row) => row[column]));
    }
    return matches;
  }

  merge_matches() {
    const matches = this.find_matches();
    if (matches.size === 0) return 0;

    for (let column = 0; column < this.info.w; column++) {
      const survivors = this.cells
        .map((row) => row[column])
        .filter((cell) => !matches.has(cell));
      const replacements = Array.from(
        { length: this.info.l - survivors.length },
        () => {
          const cell = new Cell(Math.floor(Math.random() * 10 + 10), false);
          cell.activate_cell_dom_link(this);
          return cell;
        },
      );
      const updated_column = [...replacements, ...survivors];
      updated_column.forEach((cell, row) => {
        this.cells[row][column] = cell;
      });
    }

    this.dom_link.update();
    return matches.size;
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
        element.cell_dom_link.add_to(this.dom_element);
        element.cell_dom_link.update_value();
      });
    });
  }

  rem_current_cell_array() {
    this.dom_element.replaceChildren();
  }
  adjust_css() {
    this.dom_element.style.gridTemplateColumns = `repeat(${this.width}, 1fr)`;
    this.dom_element.style.gridTemplateRows = `repeat(${this.length}, 1fr)`;
  }
  update() {
    this.rem_current_cell_array();
    this.add_current_cell_array();
  }
}
var b = new Board(new BoardInfo(3, 12, null));
