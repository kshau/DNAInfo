import json

codon_wheel_raw = open("codon_wheel.json", "r").read()
codon_wheel = json.loads(codon_wheel_raw)

def proteins_from_mRNA(strand):

  proteins = []
  
  for g in strand:
    
    bases = list(g)
  
    for b in codon_wheel[bases[0]][bases[1]]:
      
      if bases[2] in b["bases"]:
        proteins.append(b["protein"])
        break

  return proteins

def mRNA_from_DNA(strand):

  new_strand = []
  
  for g in strand:

    new_gene = ""
    
    for b in list(g):
      if b == "T":
        new_gene += "A"
      elif b == "A":
        new_gene += "U"
      elif b == "G":
        new_gene += "C"
      elif b == "C":
        new_gene += "G"

    new_strand.append(new_gene)

  return new_strand