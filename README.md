# webgourmet
This is a read-only, pseudo-web interface for Gourmet Recipe Manager. Since the desktop program has very limited HTML exporting support, and no smartphone/tablet support at all, I wrote this code in order to be able to look at my recipes from my mobile.

It consists of two main components:

### Server side script

There's a script named `extractjson.sh` that exports Gourmet recipes to JSON format. It needs access to Gourmet's database (usually located at ~/.gourmet/recipes.db). The output of this script is a JSON file that should be named `recipes.json`, and should be placed in a web server, with the web interface explained next.

Typical usage of this script would be placing it in a crontab, so it generates the recipes JSON file periodically.

### Web interface

A simple web interface that displays the recipes in a nice way. It uses some AJAX to allow filtering recipes and adjusting quantities, just like Gourmet desktop application.

Just place the files in a folder inside a web server, and it should work out of the box. No server technologies (PHP, etc.) are needed, just plain HTML and Javascript.

## System requirements

The server side script needs [csvkit](http://csvkit.readthedocs.org/en/0.9.1/) installed (specifically csvjson command), a SQLite3 client, and standard bash. All of them easily installable through standard repositories.

The web interface uses simple jQuery, so it doesn't need anything besides a relatively modern web browser.
