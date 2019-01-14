Made by: Benjamin Hagel
Jan 12, 2019

Full stack solution for this problem does its best to implement the specified use cases.
This is a NodeJS application that uses the [Express](https://www.npmjs.com/package/express) framework to handle the
delivery of the webpage as well as the API calls for searching.


RUN INSTRUCTIONS
If you are not using the hosted version for testing (at http://affsoft.ca/) you
can clone this repository and run 'npm install' in the root directory to
automatically download the Express library and then run 'node server' and access
the local version at 'localhost:80' in your browser.


Credit for Levenshtein distance implementation: [Levenshtein Distance Algo](https://coderwall.com/p/uop8jw/fast-and-working-levenshtein-algorithm-in-javascript)

(Challenge instructions below)





#Challenge Instructions
# Web Engineer Challenge - Summer 2019

Build a web app to search for waste items using the Toronto Waste Wizard database, and save frequently used ones.

## Instructions
- Reproduce the design as provided in the screenshot, which displays example search results.
- The data must be taken from the [Waste Wizard Lookup data (JSON)](https://www.toronto.ca/city-government/data-research-maps/open-data/open-data-catalogue/#5ed40494-a290-7807-d5da-09ab6a56fca2).
- Typing in the search field should *NOT* perform an API call.
- A search must be performed when hitting enter or clicking the search button.
- When the search input field is cleared, the list of results should also be cleared.
- Performing a search should render a list of potential matching items based on keywords. Each item should:
   - Render the title and description of the item.
   - Render a grey star button *if the item is not already favourited*.
   - Render a green star icon *if the item is not already favourited*.
   - Clicking the star button should add the item to the favourites list.
- When the number of favourites is more than one, the app should render a list of items. Each saved item should:
   - Render the title and description of the item.
   - Render a green star button *if the item has been favourited*.
   - Clicking the green star button should remove the item from the saved list.

## Design

![Design](http://cdn.shopify.com/static/web-eng-challenge-summer-2019/design.png)

## Submission

In your application, please include:

1. A link to your codebase, for review.
2. A link to a hosted version, for testing.
