const api = location.href + "/api";

const codonInputsDiv = document.querySelector(".codoninputs");
const evalBtn = document.querySelector(".btn.eval");
const clearBtn = document.querySelector(".btn.clear");
const inputForm = document.querySelector(".inputform");

const mRNAOutput = document.querySelector(".outputsection.mrna");
const proteinsOutput = document.querySelector(".outputsection.proteins");

const output = document.querySelector(".out");

var codonInputs;

function keydownEvent(e) {

  const codonHyphens = document.querySelectorAll(".codonhyphen.dna");
  
  if (codonInputs[codonInputs.length - 1].value.length == 3 && e.key.length == 1) {
    
    const newInput = codonInputs[0].cloneNode(true);
    newInput.setAttribute("class", "codoninput");
    newInput.value = "";
    
    codonInputsDiv.appendChild(newInput);

    const codonHyphen = document.querySelector(".codonhyphen.dna").cloneNode(true);
    codonHyphen.setAttribute("class", "codonhyphen dna");
    codonInputsDiv.appendChild(codonHyphen);
    
    newInput.select();
    
  }

  else if (event.key == "Backspace" && codonInputs.length > 1 && codonInputs[codonInputs.length - 1].value.length == 0) {

    const lastCodonValue = codonInputs[codonInputs.length - 2].value;
    
    codonInputs[codonInputs.length - 1].remove();
    codonHyphens[codonHyphens.length - 1].remove();
    
    codonInputs[codonInputs.length - 2].select();

    codonInputs[codonInputs.length - 2].value = lastCodonValue + " ";
    
  }
  
}

function validateCodonInputs() {
  
  codonInputs = document.querySelectorAll(".codoninput");

  for (var c of [...codonInputs]) {

    const codon = c.value.toUpperCase();
    
    if (/^[ATGC]{3}$/.test(codon) || codon == "") {
      c.style.backgroundColor = "#0096c7";
      evalBtn.disabled = false;
    }
      
    else {
      c.style.backgroundColor = "red";
      evalBtn.disabled = true;
    }
    
  }

}

async function getDNAInfo(codonString) {
  
  const res = await fetch(`${api}/dna?strand=${codonString}`, {"mode": "cors"});
  const json = await res.json();
  return json;
}

function clearOutput() {
  const outputs = document.querySelectorAll(".output, .codonhyphen.mrna");
  for (var o of outputs) {
    o.remove();
  }
}

function clearInputCodons() {
  output.hidden = true;
  const inputs = document.querySelectorAll(".codoninput:not(.codoninput.original), .codonhyphen.dna:not(.codonhyphen.dna.original)");
  for (var o of inputs) {
    o.remove();
  }
  codonInputs[0].value = "";
}

function codonFormSubmitEvent(e) {
  
  e.preventDefault();

  var codonString = "";

  for (var c of [...codonInputs]) {
    codonString += c.value.toUpperCase();
  }

  getDNAInfo(codonString).then(json => {

    clearOutput();
    
    for (var i in json.mRNA) {

      const mRNA = json.mRNA;
      const proteins = json.proteins;
      
      const mRNACodon = document.createElement("span");
      mRNACodon.innerText = mRNA[i];
      mRNACodon.setAttribute("class", "output");

      mRNAOutput.appendChild(mRNACodon);

      if (i != mRNA.length - 1) {
        const hyphen = document.createElement("span");
        hyphen.innerText = "-";
        hyphen.setAttribute("class", "codonhyphen mrna");

        mRNAOutput.appendChild(hyphen);
      }

      const protein = document.createElement("span");
      protein.innerText = proteins[i];
      protein.setAttribute("class", "output");

      proteinsOutput.appendChild(protein);
      
    }
    
  });

  output.hidden = false;

}

window.addEventListener("keydown", keydownEvent); 
inputForm.addEventListener("submit", codonFormSubmitEvent);
clearBtn.addEventListener("click", clearInputCodons);

setInterval(validateCodonInputs, 10);