#!/bin/bash
# Extract Gourmet recipes from SQLite DB to JSON format
# Dependencies: csvkit (csvjson command)

# Path to Gourmet database
RECIPESFILE="/home/u82066/.gourmet/recipes.db"

# If recipes file path is given as a parameter, use it
if [ $# -eq 1 ]; then
    RECIPESFILE=$1
fi

echo "["
recipes=()
while read recipe; do
    idrecipe=$(echo $recipe | cut -d"|" -f1)
    titrecipe=$(echo $recipe | cut -d"|" -f2)
    yields=$(echo $recipe | cut -d"|" -f3)
    yieldunits=$(echo $recipe | cut -d"|" -f4)
    instructions=$(echo $recipe | cut -d"|" -f5)

    ingredients=$(sqlite3 -header -csv $RECIPESFILE "select amount,unit,item from ingredients where recipe_id=$idrecipe order by position" | csvjson)

    if [[ $ingredients ]]; then
        recipes+=("{\"id\":\"$idrecipe\",\"title\":\"$titrecipe\",\"yields\":\"$yields\",\"yieldunits\":\"$yieldunits\",\"ingredients\":$ingredients,\"instructions\":\"$instructions\"}")
    fi
done < <(sqlite3 $RECIPESFILE 'select id,title,yields,yield_unit,instructions from recipe;' | sed 's/^[0-9].*/INILIN\0/g' | tr '\n' '#' | sed 's/#INILIN/INILIN/g' | sed 's/INILIN/\nINILIN/g'| sed 's/^INILIN//g' | sed '/^$/d;s/#/<br>/g')
printf -v recipelist ",%s" "${recipes[@]}"
recipelist=${recipelist:1}
echo $recipelist
echo "]"
