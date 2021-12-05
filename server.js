const express = require('express');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const path = require('path');
app.use(cors());

app.get('/sync', async(req, res) => {

  // open the browser and prepare a page
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox']});
  const page = await browser.newPage();
  await page.goto('https://candhis.cerema.fr/_public_/campagne.php', {"waitUntil" : "networkidle0"});
  await page.click('#idLisCamp');
  const aPierreNoire = await page.$x("//a[contains(., '02911 - Les Pierres Noires [TR]')]");
  await Promise.all([
    await aPierreNoire[0].click(),
    page.waitForNavigation(),
  ]);
  let html = await page.evaluate(() => document.body.innerHTML);
  $ = cheerio.load(html);
  const table = $('#idCardCamp table');
  html = $.html(table);

  res.send({
      success: true,
      data: {
        hello: 'world',
        html: html,
      }
  });

  await browser.close();
});

app.use(express.static('public'));

app.get('*', (req, res) => {
   res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
   console.log(`Server is up at port ${port}`);
});