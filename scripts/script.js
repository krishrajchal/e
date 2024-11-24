/*

*/ 

/**
 * 
 * @param {string} bingLink The bing link to get the final link.
 */
async function getActualLinkFromBing(bingLink){
    // damn cors error. 
    const link = bingLink.includes("bing") ? bingLink.slice(0, -1) + "F" : bingLink

    let response = await fetch(link, {redirect:"follow"})
        .then(response => {
            console.log('Final URL:', response.url); 
            return response.text();
        })
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));

}