_ID = "120"

def addID():
    with open("data/allplayers.csv", "a") as o:
        with open("data/teamplayers.txt", "r") as i:
            for line in i:
                line = _ID + "," + line
                o.write(line)
            o.write("\n")

def stripName():
    with open("data/raw.txt", "r") as i:
        with open("data/teamplayers.txt", "w") as o:
            for line in i:
                start = line.find("\\")
                end = line.find(",")
                delete = line[start:end]
                new = line.replace(delete, "")
                o.write(new)

stripName()
addID()