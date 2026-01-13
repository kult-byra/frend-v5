# Setup

Run `pnpm install` to install dependencies.

This project uses Tailwind and Typescript, with Biome for linting and formatting.

# Setup Biome

Install the Biome vscode plugin and you are pretty good to go.


# Custom icons
It is highly reccommended to be concious about icons in the front end of the application. Wherever possible, try to create a SVG spritesheet for your icons. [Read more about why here](https://benadam.me/thoughts/react-svg-sprites/).

Even though this is a bit more work per icon, the performance gains are noticeable. Also we get typesafe icons :D

## Adding new icons

Adding new icons are preferably done by using `@sly-cli/sly`. Read more about [Sly CLI here](https://sly-cli.fly.dev/). 

To add `arrow-down-square` Lucide icon do:

`pnpm add-icon lucide-icons arrow-down-square`. First time you use a new package you need to set the directory to `svg-icons`. 

You can also manually add SVG icons to the folder. To create the spritesheet you need to run `pnpm build:icons` this is added in the example `sly.json` folder as a postinstall. 

# Types / Schema / Groq

Schemas needs to be set up using `@sanity/typed` package. Using this in combination with `groq-builder` makes us able to do fully schema based typed queries without zod..



# Env

Enviroment variables are validated at build time. When adding enviroment variables you must update the schema in `/src/env/schema.mjs`

In order for preview to work you need to connfigure a Sanity token with read and write permissions.

To setup fathom simply add `NEXT_PUBLIC_FATHOM_ID` and `NEXT_PUBLIC_FATHOM_SITES` in your env file. The sites variable should be a url or comma separated list of urls like: `www.kult.design,kult.design`.

# Errors?

Wierd errors happen quite often, try to do a hard refresh and then restart the server before asking for help.
