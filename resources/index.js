class Byte {

  constructor(name, displayText) {
    this.binArr = new Array(8).fill(0); // -> [0, 0, 0, 0, 0, 0, 0, 0]
    this.name = name; // Class name for HTML elements
    this.displayText = displayText; // Name to display on web page

    this.draw();
    this.render();
  }

  toBinStr() {
  // Output `this.binArr` as binary string
    return this.binArr.join('');
  }

  toInt() {
  // Output `this.binArr` as integer 
    return Number(`0b${this.toBinStr()}`);
  }

  updateBinArr(num) {
  // Translate int input `num` to binary and update `this.binArr`
    let s = num.toString(2);
    s = '00000000'.substr(s.length) + s;
    s = s.split('');
    s = s.map((x) => parseInt(x));
    this.binArr = s;
    if (this.binArr.length > 8) { this.binArr.shift(); }
  }

  draw() {
    const self = this;
    const containerDiv = document.getElementById("container");

    this.drawRowNameDiv(containerDiv);
    this.drawOperatorsDiv(self, containerDiv);
    this.drawByteDiv(self, containerDiv);
    this.drawBinDiv(containerDiv);
    this.drawIntDiv(containerDiv);
  }

  drawRowNameDiv(containerDiv) {
    this.rowNameDiv = document.createElement("div");
    this.rowNameDiv.classList.add("row-name");
    this.rowNameDiv.textContent = this.displayText;
    containerDiv.appendChild(this.rowNameDiv);
  }

  drawBinDiv(containerDiv) {
    // Draw binary div
    this.binDiv = document.createElement("div");
    this.binDiv.classList.add("binary");
    this.binDiv.classList.add(this.name);
    containerDiv.appendChild(this.binDiv);
  }

  drawIntDiv(containerDiv) {
    // Draw integer div
    this.intDiv = document.createElement("div");
    this.intDiv.classList.add("integer");
    this.intDiv.classList.add(this.name);
    containerDiv.appendChild(this.intDiv);
  }

  render() {
    for (let i = 0; i < 8; i++ ) {
      this.bitDivs[i].classList.toggle("toggle", this.binArr[i] == 1);
    }
    this.binDiv.textContent = this.toBinStr();
    this.intDiv.textContent = this.toInt();
  }
}


class InputByte extends Byte {
  constructor(name, displayText) {
    super(name, displayText);
    this.observers = [];
  }

  flipBit(i) {
    // Flip bit `i` of `this.binArr`
    this.binArr[i] = this.binArr[i] ? 0: 1;
    this.notifyObservers();
  }

  shiftLeft() {
  // Shift bits left one place
    let i = this.toInt();
    i <<= 1;
    this.updateBinArr(i);
    this.notifyObservers();
  }

  shiftRight() {
  // Shift bits right one place
    let i = this.toInt();
    i >>= 1;
    this.updateBinArr(i);
    this.notifyObservers();
  }

  drawByteDiv(byteObj, containerDiv) {
    // Draw byte div
    this.byteDiv = document.createElement("div");
    this.byteDiv.classList.add("byte");
    this.byteDiv.classList.add(this.name);
    for (let i = 0; i < 8; i++) {
      const bitBtn = document.createElement("button");
      bitBtn.classList.add("bit");
      bitBtn.classList.add(`bit-${i}`);
      bitBtn.addEventListener("click", function() {
        byteObj.flipBit(i);
        byteObj.render();
      });
      this.byteDiv.appendChild(bitBtn);
    }
    this.bitDivs = this.byteDiv.children;
    containerDiv.appendChild(this.byteDiv);
  }

  drawOperatorsDiv(byteObj, containerDiv) {
    // Draw operators div
    this.operatorsDiv = document.createElement("div");
    this.operatorsDiv.classList.add("operators");
    this.operatorsDiv.classList.add(this.name);
    const shiftLeft = document.createElement("button");
    const shiftRight = document.createElement("button");
    shiftLeft.innerText = '<<';
    shiftRight.innerText = '>>';
    shiftLeft.addEventListener("click", function() {
      byteObj.shiftLeft()
      byteObj.render();
    });
    shiftRight.addEventListener("click", function() {
      byteObj.shiftRight();
      byteObj.render();
    });
    this.operatorsDiv.append(shiftLeft, shiftRight);
    containerDiv.appendChild(this.operatorsDiv);
  }

  attach(observer) {
    this.observers.push(observer);
  }

  detach(observer) {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  notifyObservers() {
    this.observers.forEach(observer => observer.update());
  }
}


class OutputByte extends Byte {
  constructor(name, displayText, inputByteA, inputByteB) {
    super(name, displayText);
    this.inputByteA = inputByteA;
    this.inputByteA.attach(this);
    this.inputByteB = inputByteB;
    this.inputByteB.attach(this);
    this.update();

    this.logicBtns = document.getElementById("logic");
    this.logicBtns.addEventListener('change', () => {
      this.update();
    });
  }


  update() {
    let logic = document.querySelector('input[name="logic"]:checked').value;
    let byteAInt = this.inputByteA.toInt();
    let byteBInt = this.inputByteB.toInt();

    if (logic == "AND") {
      this.updateBinArr(byteAInt & byteBInt);
      logic = "&";
    } else if (logic == "OR") {
      this.updateBinArr(byteAInt | byteBInt);
      logic = "|";
    } else if (logic == "XOR") {
      this.updateBinArr(byteAInt ^ byteBInt);
      logic = "^";
    } 
    this.render();
    
    const outputDiv = document.getElementById("output");
    outputDiv.innerHTML = `<code>${byteAInt} ${logic} ${byteBInt} = ${this.toInt(self.binArray)}</code>`;
     
  }

  drawByteDiv(byteObj, containerDiv) {
    // Draw byte div
    this.byteDiv = document.createElement("div");
    this.byteDiv.classList.add("byte");
    this.byteDiv.classList.add(this.name);
    for (let i = 0; i < 8; i++) {
      const bitBtn = document.createElement("button");
      bitBtn.classList.add("bit");
      bitBtn.classList.add(`bit-${i}`);
      this.byteDiv.appendChild(bitBtn);
    }
    this.bitDivs = this.byteDiv.children;
    containerDiv.appendChild(this.byteDiv);
  }

  drawOperatorsDiv(byteObj, containerDiv) {
    // Draw operators div
    this.operatorsDiv = document.createElement("div");
    this.operatorsDiv.classList.add("operators");
    this.operatorsDiv.classList.add(this.name);
    this.operatorsDiv.setAttribute('id', 'logic');
    this.operatorsDiv.innerHTML = `
      <input type="radio" id="AND" name="logic" value="AND" checked="checked">
      <label for="AND">AND</label>
 
      <input type="radio" id="OR" name="logic" value="OR">
      <label for="OR">OR</label>

      <input type="radio" id="XOR" name="logic" value="XOR">
      <label for="XOR">XOR</label>
    `;
    containerDiv.appendChild(this.operatorsDiv);
  }

}


let byteA = new InputByte("byte-a", "Input A");
let byteB = new InputByte("byte-b", "Input B");
let byteY = new OutputByte("byte-y", "Output Y", byteA, byteB);
