import {createRequire} from 'node:module';import {mkdir} from 'node:fs/promises';
const require=createRequire(import.meta.url);const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const browser=await chromium.launch({channel:'chrome',headless:true});const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
await mkdir('screenshots',{recursive:true});await page.goto(process.env.QA_URL||'http://127.0.0.1:4173');await page.screenshot({path:'screenshots/landing-desktop.png',fullPage:true});
await page.getByRole('button',{name:'Field manual'}).click();await page.getByRole('dialog').waitFor();await page.keyboard.press('Escape');
await page.getByRole('button',{name:'Launch solo expedition'}).click();await page.getByRole('button',{name:'Reclaim stores'}).click();await page.getByRole('button',{name:'Emergency oversight'}).click();await page.screenshot({path:'screenshots/game-desktop.png',fullPage:true});
await page.locator('.card').first().click();await page.getByRole('button',{name:'Begin cycle 2'}).waitFor();await page.reload();await page.getByRole('button',{name:'Resume expedition'}).click();await page.getByRole('button',{name:'Begin cycle 2'}).click();
await page.getByRole('button',{name:'Confidential audit'}).click();await page.getByRole('button',{name:'Your private briefing'}).click();if(!(await page.locator('.secret').innerText()).includes('previous contribution'))throw Error('Missing private evidence');
await page.setViewportSize({width:390,height:844});await page.screenshot({path:'screenshots/game-mobile.png',fullPage:true});if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Horizontal overflow');
page.on('dialog',d=>d.accept());await page.getByRole('button',{name:'New expedition'}).click();await page.getByRole('button',{name:'Local table'}).click();await page.getByRole('button',{name:'Reclaim stores'}).click();await page.getByRole('button',{name:'Open protocol',exact:false}).click();
for(let i=0;i<4;i++){if(await page.locator('.card,.secret').count())throw Error('Secret rendered before handoff');await page.getByRole('button',{name:/I am .*reveal/}).click();await page.locator('.card').first().click();}
await page.getByRole('button',{name:'Begin cycle 2'}).waitFor();
await page.getByRole('button',{name:'New expedition'}).click();await page.setViewportSize({width:1440,height:1000});await page.getByRole('button',{name:'Launch solo expedition'}).click();
for(let round=1;round<=8;round++){
 const values=await page.locator('.meter strong').allTextContents();const resource=values.map(v=>parseInt(v));
 await page.getByRole('button',{name:resource[1]<=4?'Reclaim stores':resource[3]>=4?'Open deliberation':resource[0]<=4?'Repair hull':'Reclaim stores'}).click();
 await page.getByRole('button',{name:resource[3]>=4?'Open protocol':'Emergency oversight'}).click();
 const cards=await page.locator('.card').allTextContents();const scores=cards.map(c=>Number(c.match(/\+(\d+)/)?.[1]||0));await page.locator('.card').nth(scores.indexOf(Math.max(...scores))).click();
 if(await page.getByText('EXPEDITION CONCLUDED',{exact:true}).count())break;
 await page.getByRole('button',{name:/Begin cycle/}).click();
}
await page.getByText('EXPEDITION CONCLUDED',{exact:true}).waitFor();await page.screenshot({path:'screenshots/ending-desktop.png',fullPage:true});
if(errors.length)throw Error(errors.join('\n'));console.log('Browser QA passed: manual, solo turn, autosave/resume, audit, 390px layout, four private handoffs.');await browser.close();
