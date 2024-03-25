from flask import Flask, request, render_template
from flask_cors import CORS
from methods import mRNA_from_DNA, proteins_from_mRNA, codon_wheel
import os

app = Flask('app')

@app.route('/api/dna', methods=["GET"])
def DNA_info():
  
  strand_str = str(request.args.get('strand', default=1, type=str)).upper()
  strand = [strand_str[i:i+3] for i in range(0, len(strand_str), 3)]

  if strand_str == "1" or len(strand_str) < 3:
    return {
      "status": "error", 
      "message": "No DNA strand provided! Use /api/dna?strand=XXX", 
    }

  if len(strand[-1]) < 3:
    del strand[-1]

  try:

    strand_mRNA = mRNA_from_DNA(strand)
  
    return {
      "status": "ok",
      "DNA": strand,
      "mRNA": strand_mRNA, 
      "proteins": proteins_from_mRNA(strand_mRNA)
    }

  except IndexError:
    
    return {
      "status": "error", 
      "message": "Invalid DNA strand provided!", 
      "DNA": strand
    }

@app.route('/api/codonWheel', methods=["GET"])
def get_codon_wheel():
  return codon_wheel

@app.route("/api/mutation", methods=["GET"])
def mutation_info():
  
  original_str = str(request.args.get('original', default=1, type=str)).upper()
  new_str = str(request.args.get('new', default=1, type=str)).upper()

  original = [original_str[i:i+3] for i in range(0, len(original_str), 3)]
  new = [new_str[i:i+3] for i in range(0, len(new_str), 3)]

  if original_str == "1" or len(original_str) < 3 or new_str == "1" or len(new_str) < 3:
    return {
      "status": "error", 
      "message": "One or more DNA strands missing! Use /api/mutation?original=XXX&new=XXX", 
    }

  try:
    proteins_from_mRNA(original)
    proteins_from_mRNA(new)

  except KeyError:
    return {
      "status": "error", 
      "message": "Invalid DNA strand(s) provided!", 
      "original": original, 
      "new": new
    }

  if original_str == new_str:
    return {
      "status": "ok", 
      "mutated": False
    }

  else:
    return {
      "status": "ok", 
      "mutated": True, 
      "mutationType": "unknown (for now)"
    }

@app.route("/", methods=["GET"])
def main():
  return render_template("index.html")

CORS(app)
app.run(host='0.0.0.0', port=8080)