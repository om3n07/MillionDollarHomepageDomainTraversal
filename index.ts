import domains from './domains';
var http = require('https');

// YOUR API KEY HERE
const apiKey = '';
const fs = require('fs');
var writer = fs.createWriteStream('./output/results.txt', {flags: 'a'});


function checkAllDomains() {
    domains.forEach(d => {
        logDomainAvailability(d);
        
    });
}

function logDomainAvailability(name: string) {
    http.get(`https://domain-availability-api.whoisxmlapi.com/api/v1?apiKey=${apiKey}&domainName=${name}`, (resp: any) => {
        let data = '';

        resp.on('data', (chunk: any) => {
          data += chunk;
        });
      
        // The whole response has been received. Log the result.
        resp.on('end', () => {
            const response = JSON.parse(data);
            if (response.DomainInfo) {
                const availability = `domain: ${response.DomainInfo.domainName}, availability: ${response.DomainInfo.domainAvailability} \r\n`;
                console.log(availability);
                writer.write(availability);
            } else {
                console.log(response);
            }
        });
      
    }).on("error", (err: any) => {
        console.log("Error: " + err.message);
    });
}

checkAllDomains();