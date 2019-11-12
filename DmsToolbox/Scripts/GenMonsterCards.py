import os
from bs4 import BeautifulSoup as BS

testing  = False

newDir = 'MonsterStatBlocks'

try:
    os.makedirs(newDir)    
    print("Directory Created ")
except FileExistsError:
    print("Directory already exists")

referenceFile = open("References\MonsterManual.xml","r")

ref = referenceFile.read()
soup = BS(ref, features="html.parser")
cards = soup.find_all("monster")

print("Begin Generating Monster Stat Blocks")

for card in cards:
    cardName = card.find('name').string
    cardName = cardName.replace('/','-')
    
    newFileName = (newDir+"/"+cardName)
    newFile = open(newFileName,"w")
    
    for content in card.contents:
        if(content.name == None):
            continue
        try:
            newFile.write(content.name+": "+content.string+"\n")
        except:
            children = content.children
            header = True
            for child in children:
                if(child.name == None):
                    continue
                if header:
                    newFile.write(child.parent.name+": "+child.string+"\n")
                    header = False
                else:
                    newFile.write("\t"+child.string+"\n")
    
    newFile.close()

print("End Generating Monster Stat Blocks")

referenceFile.close()