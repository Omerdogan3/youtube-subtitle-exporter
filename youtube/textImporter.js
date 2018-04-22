const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
var util = require('util');

let browser;
let page;
let videoName = "subtitle";

module.exports = textImporter = async(link) =>{
    const youtubeMask = "https://www.youtube.com/watch?v=";
    console.log(link);
    try{
        browser = await puppeteer.launch({headless: true, args: [
            `--window-size=${ 1600 },${ 1200 }`
        ]});
        page = await browser.newPage();
        page.setDefaultNavigationTimeout(300000);
        await page.goto(youtubeMask.concat(link));
        await page.waitFor(2000);
        await page.click('#menu > ytd-menu-renderer > yt-icon-button');
        await page.waitFor(2000);
        await page.click('#items > ytd-menu-service-item-renderer:nth-child(2) > yt-formatted-string');
        await page.waitFor(2000);
        
        //Eksik Video Name alip return et!!!



        const data = await page.evaluate(()=>{
            const tds =  Array.from(document.querySelectorAll('.style-scope ytd-transcript-renderer'));
            return tds.map((td) => td.textContent.replace(/\s\s+/g, ' '));
        });
        await page.close();
        await browser.close();

        result = {
            data: data,
            videoName: videoName
        }
        return result;
    }catch(error){
        return "error";
    }
    
}

