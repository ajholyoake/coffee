Nespresso Coffee Shop
=====================
Runs in iisnode
Make sure windows authentication is installed for IIS (in windows features)

In feature delegation -> handler mappings, set to read / write and reset all delegation

Make sure website directory has read/write permissions for the IIS_USERS group (or whatever it’s called)


Things to do:
-------------

On admin side:

Put coffee list for new order into a db table
Also file for creating the fixtures (i.e. write from the text file to the db to begin with)
Scrape the coffee names!

NeDB for file based database (mongo-like api)
https://github.com/louischatriot/nedb
