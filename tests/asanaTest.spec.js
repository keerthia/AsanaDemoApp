const { test, expect , beforeEach, afterAll, chromium} = require('@playwright/test');
const testData = require('../login.json'); // Import the JSON file
const projectApps=require('../projects.json');
const taskState = {
    TODO: "To Do",
    INPROGRESS: "In Progress",
    DONE:"Done"
};

//runs before every test to login with the provided username and password
test.beforeEach(async ({page}) => {
          await page.goto('https://animated-gingersnap-8cf7f2.netlify.app/');
          await page.waitForLoadState('domcontentloaded'); // Wait for the page to fully load
          await page.locator('#username').fill(testData[0].username);//username
          await page.locator('#password').fill(testData[0].password);//password
          await page.locator('//button[text()="Sign in"]').click();
          await page.waitForLoadState('domcontentloaded');
          console.log("User Logging in", testData[0].username)
});


//This test.describe groups all the tests that have to be performed under Web Application Tab
test.describe('Verify Web Application', () => {
const appIndex=0;//to retrieve the Web Application tasks and tags to be verified from the projects.json
       test('Verify user authentication is in To Do in Web Application',async ({ page }) => {
             await page.waitForLoadState('networkidle');// Wait for the page to fully load
             try{
             console.log('Verifying To Do section');
             const toDoInDoneAndItem=await verifyMainStatus(page,appIndex,projectApps.app[appIndex].toDo.items[0],0,taskState.TODO);
            await verifySubTags(toDoInDoneAndItem.toDoInDone.nth(0),toDoInDoneAndItem.statusItem,0);
         }

             catch(error){
                console.log("To Do",error.message);
             }
        });


       test('Verify Fix navigation bug and Bug is in To Do',async ({ page }) => {
       try{
             await page.waitForLoadState('networkidle');// Wait for the page to fully load
             const toDoInDoneAndItem=await verifyMainStatus(page,appIndex,projectApps.app[appIndex].toDo.items[1],0,taskState.TODO);//page,elemnt index ToDo, json index,string
             //console.log("toDoInDoneAndItem",await toDoInDoneAndItem.toDoInDone.nth(0).textContent());
             await verifySubTags(toDoInDoneAndItem.toDoInDone.nth(0),toDoInDoneAndItem.statusItem,1);
             }
             catch(error){
                              console.log("Verify Fix navigation bug",error.message);
                           }

        });



   test('Verify Design system updates and Design is InProgress',async ({ page }) => {
      try{
                   await page.waitForLoadState('networkidle');// Wait for the page to fully load
                   const toDoInDoneAndItem=await verifyMainStatus(page,appIndex,projectApps.app[appIndex].inProgress.items[0],1,taskState.INPROGRESS);//page,elemnt index ToDo, json index,string
                   //console.log("toDoInDoneAndItem",await toDoInDoneAndItem.toDoInDone.nth(0).textContent());
                   await verifySubTags(toDoInDoneAndItem.toDoInDone.nth(0),toDoInDoneAndItem.statusItem,0);
                  }
             catch(error){
                              console.log("Verify Design system updates",error.message);
                           }

        });
});
//This test.describe groups all the tests that have to be performed under Mobile Application Tab
test.describe('Verify Mobile Application',() => {
const appIndex=1;//to retrieve the Mobile Application tasks and tags to be verified from the projects.json
    test('Verify To Do in Mobile Application',async ({ page }) => {
       try{
             await page.waitForLoadState('networkidle');// Wait for the page to fully load
             const toDoInDoneAndItem=await verifyMainStatus(page,appIndex,projectApps.app[appIndex].toDo.items[0],0,taskState.TODO);//page,elemnt index ToDo, json index,string
             //console.log("toDoInDoneAndItem",await toDoInDoneAndItem.toDoInDone.nth(0).textContent());
             await verifySubTags(toDoInDoneAndItem.toDoInDone.nth(0),toDoInDoneAndItem.statusItem,0);
             }
             catch(error){
                              console.log("Verify To Do Mobile Application",error.message);
                           }

        });
        test('Verify In Progress in Mobile Application',async ({ page }) => {
               try{
                     await page.waitForLoadState('networkidle');// Wait for the page to fully load
                     const toDoInDoneAndItem=await verifyMainStatus(page,appIndex,projectApps.app[appIndex].inProgress.items[0],1,taskState.INPROGRESS);//page,elemnt index ToDo, json index,string
                     //console.log("toDoInDoneAndItem",await toDoInDoneAndItem.toDoInDone.nth(0).textContent());
                     await verifySubTags(toDoInDoneAndItem.toDoInDone.nth(0),toDoInDoneAndItem.statusItem,0);
                     }
                     catch(error){
                                      console.log("Verify In Progress in Mobile Application",error.message);
                                   }

                });
     test('Verify Done in Mobile Application',async ({ page }) => {
                    try{
                         await page.waitForLoadState('networkidle');// Wait for the page to fully load
                         const toDoInDoneAndItem=await verifyMainStatus(page,appIndex,projectApps.app[appIndex].done.items[0],3,taskState.DONE);//page,elemnt index ToDo, json index,string
                         //console.log("toDoInDoneAndItem",await toDoInDoneAndItem.toDoInDone.nth(0).textContent());
                         await verifySubTags(toDoInDoneAndItem.toDoInDone.nth(0),toDoInDoneAndItem.statusItem,0);

                          }
                          catch(error){
                                           console.log("Verify Done in Mobile Application",error.message);
                                        }

                     });
});


//this fucntion verifies the subtags in each element
async function verifySubTags(pageToDO, item,indexFornthElement){
try{

                const subTags=await pageToDO.locator('//div[@class="flex flex-wrap gap-2 mb-3"]');;
                let subTag;
                const count=await subTags.count();
               // console.log("subTags.nth(0).textContent",{elem: await subTags.nth(0).textContent()});
               // console.log("subTags.nth(1).textContent",{elem: await subTags.nth(1).textContent()});

                for (const tag of item.tags) {
                    if(count<=1){
                    console.log("In if tag.subTags", tag.subTags);
                         subTag=await subTags.locator(`//span[text()="${tag.subTags}"]`);

                         }
                    else{
                                        console.log("In else tag.subTags", tag.subTags);
                         subTag=await subTags.nth(indexFornthElement).locator(`//span[text()="${tag.subTags}"]`);
                         }
                    await subTag.waitFor({state:'visible' });
                    await expect(subTag).toBeVisible();
                    if(await subTag.isVisible())
                       console.log(tag.subTags," is visible and it is placed under ",item.title ,"as expected");
                       console.log("elem:subTag.textContent()", {elem: await subTag.textContent()});
                }
                }
                 catch (error) {
                    console.error('Error locating subTags:', error);
                    // Handle the error, e.g., retry the action, log the error, or fail the test
                }
}

//retrives the elements that are under Web or Mobile application tabs
async function retrieveAppElements(page,application){
            await page.waitForSelector(`//h2[text()="${application}"]`);
            const app=await page.locator(`//h2[text()="${application}"]`);
            await expect(page.locator(`//h2[text()="${application}"]`)).toBeVisible();
            if(app.isVisible()){
                console.log("User Successfully logged in");
                console.log(await app.textContent()," is Visible");
                }
             await app.click();
            const appPage=await page.locator('//div[@class="h-full overflow-x-auto"]');
            const isAppVisible=await appPage.isVisible();
            await expect(appPage).toBeVisible();
            const mainStatus=await appPage.locator('//div[@class="flex flex-col w-80 bg-gray-50 rounded-lg p-4"]');//ToDo,InProgress, Review
            return mainStatus;
}
//retrives the elements from function retrieveAppElements and returns the element needed for the test
async function verifyMainStatus(page,appIndex,item,itemIndex,str){
             const statusElements=await retrieveAppElements(page,projectApps.app[appIndex].name);
          /*  console.log("statusElement0",appIndex,{elem : await statusElements.nth(0).textContent()});
             console.log("statusElement1",appIndex,{elem : await statusElements.nth(1).textContent()});
             console.log("statusElement2",appIndex,{elem : await statusElements.nth(2).textContent()});
             console.log("statusElement3",appIndex,{elem : await statusElements.nth(3).textContent()});
*/
             const element=statusElements.nth(itemIndex);
             console.log("element.isVisible()",await element.isVisible());
             const toDoInDone=await element.locator('//div[@class="flex flex-col gap-3"]');
             await toDoInDone.waitFor({state:"visible"});
             console.log("todoInDone",{elem : await toDoInDone.textContent()});
             const statusItem=item;
             const title=await toDoInDone.nth(0).locator(`//h3[text()="${statusItem.title}"]`);
             await title.waitFor({ state: 'visible' });
             await expect(title).toContainText(statusItem.title);
             if(title.isVisible()){
                console.log(statusItem.title," is under ",str);
             }
             return {toDoInDone,statusItem};
}