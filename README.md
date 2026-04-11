# i_wreck_things — Personal Website
## By Sidharth R

---

## FOLDER STRUCTURE

```
site/
├── index.html              ← The entire website (single page)
├── css/
│   └── style.css           ← All styles (edit colors/fonts here)
├── js/
│   └── main.js             ← All logic + your image/post catalogues
├── images/
│   ├── digital/            ← Digital art images
│   ├── traditional/        ← Ink, pencil, physical art photos
│   └── photography/        ← Your photos
└── thoughts/               ← Blog posts as plain .txt files
```

---

## HOW TO ADD ART IMAGES

1. Drop your image file into the right folder:
   - Digital art → `images/digital/`
   - Traditional art → `images/traditional/`
   - Photos → `images/photography/`

2. Open `js/main.js` and find the `catalogue` section (around line 60).

3. Add one line to the right array:
   ```js
   { src: 'images/digital/my-new-artwork.png', caption: 'My Artwork Title' },
   ```

4. Save. Done. It shows up automatically.

---

## HOW TO WRITE A BLOG POST

1. Create a new `.txt` file in the `thoughts/` folder.
   Name it anything: `my-thoughts-on-robots.txt`

2. Write it in this format:
   ```
   title: My Thoughts on Robots
   date: April 2026
   tag: Robots
   emoji: 🤖
   excerpt: A short sentence shown on the card preview.
   ---
   Your full post text goes here.

   Blank lines create new paragraphs.

   ## This becomes a subheading

   > This becomes a blockquote
   ```

3. Open `js/main.js`, find the `thoughtFiles` array (around line 90):
   ```js
   const thoughtFiles = [
     'thoughts/my-thoughts-on-robots.txt',   // ← add this line
   ];
   ```

4. Save. Your post appears on the site.

**Available tags:** Art, Tech, Life, Robots, Random

---

## HOW TO DEPLOY (FREE, takes 2 minutes)

### Option A — Netlify Drop (easiest)
1. Go to https://app.netlify.com/drop
2. Drag the entire `site/` folder onto the page
3. Done — you'll get a live URL instantly

### Option B — GitHub Pages
1. Create a GitHub repo
2. Upload all the files in `site/`
3. Go to Settings → Pages → Deploy from main branch
4. Your site is live at `yourusername.github.io/reponame`

### Option C — Vercel
1. Go to https://vercel.com/new
2. Import your GitHub repo or drag the folder
3. Click Deploy

---

## HOW TO EDIT THE ABOUT SECTION

Open `index.html` and find the `<!-- ABOUT -->` section.
The text is in plain HTML — just edit the `<p>` paragraphs directly.

---

## HOW TO CHANGE COLORS

Open `css/style.css`. At the top you'll find `:root { }` with all color variables:

```css
--terra:   #c4521a;   /* The main terracotta orange/red accent */
--cobalt:  #1a4fa0;   /* Blue accent */
--cream:   #f7f3ec;   /* Background */
--ink:     #1a1612;   /* Text / dark sections */
```

Change any hex value and it updates everywhere.

---

## CONTACT INFO

To update your contact info, open `index.html` and find the `<!-- CONTACT -->` section.
Edit the email, phone, and Instagram link directly.
