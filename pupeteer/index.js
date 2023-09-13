const puppeteer = require('puppeteer');
const fs =require('fs');


// const infiniteScroll= async (page)=>{

//     while(true){
        
//     const prevHeight= await page.evaluate('document.body.scrollHeight');
//     await page.evaluate('window.scrollTo(0,document.body.scrollHeight)');
//     await page.waitForFunction(`document.body.scrollHeight > ${prevHeight}`);
//     await new promise ((resolve)=>setTimeout(resolve,1000));

//     }
// }

async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight - window.innerHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}



(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto("https://www.myntra.com/men-casual-shirts");
  

  await autoScroll(page);
  const getInfo = await page.evaluate(() => {
    const productElements = document.querySelectorAll('.product-base');
    const productInfo = [];

    productElements.forEach((productElement) => {

       price = productElement.querySelector('.product-discountedPrice')?.innerText;
       title =productElement.querySelector('.product-product')?.innerText;
       imgURL =productElement.querySelector('img')?.getAttribute('src');
       if(!imgURL) {
        console.log('img not retrieved',productElement.querySelector('img'));
       }

      productInfo.push({ price ,title,imgURL });
    });

    return productInfo;
  });

  console.log(getInfo);


  await browser.close();

  fs.writeFile('data.json',JSON.stringify(getInfo),(err)=>{
    if(err) throw err;
    console.log('json saved succesfully :)');
  })
})();
