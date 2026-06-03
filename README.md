![Project Notes Screenshot](Screenshot%202026-01-04%20235331.png)

## Project Notes

This is a very basic tool to replace Notepad .txt notes on projects. When I work on small side projects, I always end up with a .txt file full of To-Dos and reference URLs of resources related to the project I'm working on. This is a replacement for that.

It's important to note that this is a very basic "duct tape engineering" level tool, not a really replacement for something like Notion or Evernote.

This is technically a basic web app, but it is designed to be used locally only. Also, I almost think of this as a document rather than a web app. That isn't totally accurate but it relates to the text files it is replacing. 

### What this project is:

* It's a hacky little rudimentary tool to organize ToDos and relevant links when working on a project.

### What it is not:

* Perfect. 
* Made with users in mind that are not me.
* A replacement for Notion or Evernote

### Features:

- KanBan board with 4 columns and editable cards.
  - KanBan card description is optional.
  - Cards are draggable to change their status.

- Link collection area: basically just a list of URLs with an optional description.
  - Links aren't editable, just delete and redo if you want to change something.
  - Links are draggable to change their order.
- You can have multiple collections of KanBans and URLs, each with its own tab.
- Look and feel is handled by DaisyUI, there is a dropdown to select the theme you want. (Dark modes sometimes look a bit janky because the stock Tailwind/DaisyUI shadows aren't great. A custom shadow fix may be incoming.)
- Data is automatically saved to JSON, but local storage should also show you the last used state when opening the app.
  - Selecting which JSON to use is a little clunky due to code convenience and because this is a basic personal project and good enough for me. It saves having to start a server every time.
  - When you open the app, it will ask you to open an existing data file or create a new blank one.
  - Your browser will then likely ask you to allow the app to edit files from the last time you visited this "site". (Meaning just the app itself.) Select allow.
  - Now the app can autosave to the JSON every time you make a change.

### Good to know:

- All HTML, CSS and JS powering the app are written inline in one html file. Not a great feature for production, but in this instance you get the convenience of only having one file.
- You can have multiple JSON files and switch between them using the "save" and "open" buttons, but I just use the same one.
- Spell check should be handled by your browser.
